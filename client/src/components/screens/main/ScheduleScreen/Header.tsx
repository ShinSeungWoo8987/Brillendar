import produce from 'immer';
import { useApolloClient, useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';

import { screenModeVar } from '../../../../stores';
import { darkModeToWhite, HeaderSection, HeaderView, TextMode } from '../../../../styles/styled';
import {
  useGetUserDataAndFollowQuery,
  useRequestFollowMutation,
  useRequestUnFollowMutation,
  GetFollowerCountDocument,
  GetFollowerCountQuery,
  GetUserDataAndFollowQuery,
  GetUserDataAndFollowDocument,
  useGetFollowerCountLazyQuery,
  useUpdateProfileImgMutation,
} from '../../../../generated/graphql';
import { thousandStr, uploadProfileImg } from '../../../../functions';
import { Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '../../../../styles/vectorIcons';
import appTheme from '../../../../styles/constants';

const { COLORS, STYLED_FONTS } = appTheme;

interface HeaderProps {
  id?: string;
  username?: string;
  profile_img?: string;
  follower_count?: number;
}

const Header: React.FC<HeaderProps> = ({ id, username, profile_img, follower_count }) => {
  const client = useApolloClient();
  const screenMode = useReactiveVar(screenModeVar);
  const [profileImg, setProfileImg] = useState(profile_img);

  useEffect(() => {
    setProfileImg(profile_img);
  }, [profile_img]);

  const [hasGalleryPermission, setHasGalleryPermission] = useState<Boolean | null>(null);
  const [updateProfileImg, {}] = useUpdateProfileImgMutation();

  const { data } = useGetUserDataAndFollowQuery({ fetchPolicy: 'cache-only' });
  const [requestFollow] = useRequestFollowMutation();
  const [requestUnFollow] = useRequestUnFollowMutation();

  const [followerCnt, setFollowerCnt] = useState(0);

  const me = id === data?.getUserDataAndFollow.member?.id;

  //
  const getUserDataAndFollowCache = client.readQuery<GetUserDataAndFollowQuery>({
    query: GetUserDataAndFollowDocument,
  });

  const checkMember = getUserDataAndFollowCache?.getUserDataAndFollow.member?.followings.filter(
    (m) => m.target.id === id
  );

  useEffect(() => {
    // 팔로우 요청-> 상대가 받아줌->새로고침->팔로우 업데이트됨.
    if (checkMember && checkMember.length === 1) {
      setFollowerCnt(checkMember[0].target.follower_count);
    }
  }, [getUserDataAndFollowCache]);

  //

  useEffect(() => {
    if (me) {
      const myFollowerCnt = data!.getUserDataAndFollow.member!.followers.filter(
        (member) => member.relation === 2
      )!.length;
      setFollowerCnt(myFollowerCnt);
    } else {
      setFollowerCnt(follower_count!);
    }
  }, [id]);

  const sendProfileImgMutation = (url?: string) =>
    updateProfileImg({
      variables: { url: url ? url : '' },
      update: (store, { data }) => {
        if (data) {
          // profile_img 변경
          const getUserDataAndFollowCache = store.readQuery<GetUserDataAndFollowQuery>({
            query: GetUserDataAndFollowDocument,
          });

          if (getUserDataAndFollowCache?.getUserDataAndFollow) {
            store.writeQuery<GetUserDataAndFollowQuery>({
              query: GetUserDataAndFollowDocument,
              data: produce(getUserDataAndFollowCache, (a) => {
                if (a && a['getUserDataAndFollow']['member']) {
                  a['getUserDataAndFollow']['member']['profile_img'] = url ? url : '';
                }
              }),
            });
          }
          setProfileImg(url);
        }
      },
    });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      uploadProfileImg(result.uri).then((res) => {
        const url = res.data;
        // 여기서 쿼리 및 업데이트
        sendProfileImgMutation(url);
      });
    }
  };

  const createThreeButtonAlert = () =>
    Alert.alert(
      '프로필 사진 설정',
      '', // '앨범 접근 권한이 필요합니다.',
      [
        {
          text: '기본 이미지로 변경',
          onPress: () => {
            if (profile_img !== '') sendProfileImgMutation();
          },
        },
        { text: 'Cancel', style: 'cancel' },
        { text: '앨범에서 사진 선택', onPress: () => pickImage() },
      ],
      { cancelable: false }
    );

  const handleProfileImg = () => {
    createThreeButtonAlert();
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  };

  const onUnFollow = (isFollowRequest: boolean = false) => {
    if (id) {
      requestUnFollow({
        variables: { id },
        update: async (store, { data }) => {
          // requestUnFollow가 true면, 팔로우 취소됨
          if (data?.requestUnFollow) {
            // 팔로워 수 변경
            if (!isFollowRequest) {
              setFollowerCnt(followerCnt - 1);

              //
              const getFollowerCountCache = store.readQuery<GetFollowerCountQuery>({
                query: GetFollowerCountDocument,
                variables: { id },
              });

              if (getFollowerCountCache?.getFollowerCount) {
                store.writeQuery<GetFollowerCountQuery>({
                  query: GetFollowerCountDocument,
                  variables: { id },
                  data: produce(getFollowerCountCache, (x) => {
                    if (x) {
                      x['getFollowerCount'] -= 1;
                    }
                  }),
                });
              }
            }

            // 팔로잉 목록에서 제거
            const getUserDataAndFollowCache = store.readQuery<GetUserDataAndFollowQuery>({
              query: GetUserDataAndFollowDocument,
            });

            if (getUserDataAndFollowCache?.getUserDataAndFollow) {
              store.writeQuery<GetUserDataAndFollowQuery>({
                query: GetUserDataAndFollowDocument,
                data: produce(getUserDataAndFollowCache, (a) => {
                  if (a && a['getUserDataAndFollow']['member']) {
                    let temp = [...a['getUserDataAndFollow']['member']['followings']];

                    const index = temp.findIndex((member) => member.target.id === id);
                    if (index !== -1) temp.splice(index, 1);

                    a['getUserDataAndFollow']['member']['followings'] = temp;
                  }
                }),
              });
            }
          }
        },
      });
    }
  };

  const onFollow = () => {
    if (id) {
      requestFollow({
        variables: { id },
        update: (store, { data }) => {
          // requestFollow 2면, 팔로우 요청이 아닌 팔로우 성공
          if ((data && data.requestFollow === 1) || (data && data.requestFollow === 2)) {
            let newFollowerCnt = followerCnt + 1;

            if (data.requestFollow === 2) {
              // 팔로워 수 변경
              setFollowerCnt(newFollowerCnt);
            }

            // 팔로워 목록에 추가
            const getUserDataAndFollowCache = store.readQuery<GetUserDataAndFollowQuery>({
              query: GetUserDataAndFollowDocument,
            });

            if (getUserDataAndFollowCache?.getUserDataAndFollow) {
              store.writeQuery<GetUserDataAndFollowQuery>({
                query: GetUserDataAndFollowDocument,
                data: produce(getUserDataAndFollowCache, (a) => {
                  if (a && a['getUserDataAndFollow']['member']) {
                    let temp = [...a['getUserDataAndFollow']['member']['followings']];

                    temp.push({
                      __typename: 'Follow',
                      relation: data.requestFollow,
                      target: {
                        __typename: 'Member',
                        id,
                        username: username!,
                        profile_img,
                        follower_count: newFollowerCnt, // +1 값을 넣음
                      },
                    });

                    a['getUserDataAndFollow']['member']['followings'] = temp;
                  }
                }),
              });
            }
          }
        },
      });
    }
  };

  const myScheduleFollowIcon = <MaterialCommunityIcons name="heart" size={16} color="#fd8686" style={{ padding: 6 }} />;

  // //////////////

  let isFollow = 0;
  const checkFollow = data?.getUserDataAndFollow.member?.followings.filter((member) => member.target.id === id);
  if (checkFollow && checkFollow.length > 0) {
    isFollow = checkFollow[0].relation;
  }

  let followBtn;
  switch (isFollow) {
    default:
      followBtn = (
        <FollowBtn onPress={() => onFollow()}>
          <MaterialCommunityIcons
            name="heart-outline"
            size={16}
            color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'}
          />
        </FollowBtn>
      );
      break;

    case 1:
      followBtn = (
        <FollowBtn onPress={() => onUnFollow(true)}>
          <MaterialCommunityIcons
            name="heart-half-full"
            size={16}
            color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'}
          />
        </FollowBtn>
      );
      break;

    case 2:
      followBtn = (
        <FollowBtn onPress={() => onUnFollow()}>
          <MaterialCommunityIcons name="heart" size={16} color="#fd8686" />
        </FollowBtn>
      );
      break;
  }

  // //////////////

  return (
    <Wrapper screenMode={screenMode}>
      <Conariner screenMode={screenMode}>
        <HeaderTab>
          {me ? (
            <TouchableOpacity onPress={handleProfileImg}>
              {profileImg ? <ProfileImg source={{ uri: profileImg }} /> : <ProfileView />}
            </TouchableOpacity>
          ) : profileImg ? (
            <ProfileImg source={{ uri: profileImg }} />
          ) : (
            <ProfileView />
          )}

          <UsernameText numberOfLines={1} screenMode={screenMode}>
            {username}
          </UsernameText>
        </HeaderTab>

        <HeaderTab>
          {me ? myScheduleFollowIcon : followBtn}

          <FollowerNumText screenMode={screenMode}>{thousandStr(followerCnt)}</FollowerNumText>
        </HeaderTab>
      </Conariner>
    </Wrapper>
  );
};

export default Header;

const Wrapper = styled.View<ScreenMode>`
  border-color: ${({ screenMode }) => (screenMode === 'dark' ? '#303030' : '#e4e4e4')};
  border-bottom-width: 1px;
`;

const Conariner = styled(HeaderView)`
  margin-vertical: 4px;
  border-bottom-width: 0px;
`;

const HeaderTab = styled(HeaderSection)`
  align-items: center;
`;

const FollowBtn = styled.TouchableOpacity`
  padding: 6px;
`;

const ProfileView = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 18px;
  background-color: #a6b1e0;
`;

const ProfileImg = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 18px;
`;

const UsernameText = styled(TextMode)`
  width: 200px;
  margin-left: 10px;
  ${STYLED_FONTS.body3}

  color: ${({ screenMode }) => darkModeToWhite(screenMode)};
`;

const FollowerNumText = styled(TextMode)`
  margin-left: 4px;
  ${STYLED_FONTS.body4}
  color: ${({ screenMode }) => (screenMode === 'dark' ? COLORS.white : '#5f5f5f')};
`;

/*

update: async (store, { data }) => {
          if (data?.requestUnFollow) {
            // requestUnFollow가 true면, 팔로우 취소됨

            // 팔로워 수 변경
            const getFollowerCountCache = store.readQuery<GetFollowerCountQuery>({
              query: GetFollowerCountDocument,
              variables: { id },
            });

            if (getFollowerCountCache?.getFollowerCnt) {
              store.writeQuery<GetFollowerCountQuery>({
                query: GetFollowerCountDocument,
                variables: { id },
                data: produce(getFollowerCountCache, (x) => {
                  if (x) {
                    x.getFollowerCnt -= 1;
                  }
                }),
              });
            }

            /////
            // 팔로잉 목록에서 제거

            const getUserDataAndFollowCache = store.readQuery<GetUserDataAndFollowQuery>({
              query: GetUserDataAndFollowDocument,
            });

            // const filteredFollowings = getUserDataAndFollowCache!.getUserDataAndFollow.member!.followings.filter(
            //   (member) => member.target.id !== id
            // )!;

            // const temp: GetUserDataAndFollowQuery = {
            //   ...getUserDataAndFollowCache,
            //   getUserDataAndFollow: {
            //     ...getUserDataAndFollowCache!.getUserDataAndFollow,
            //     member: {
            //       ...getUserDataAndFollowCache!.getUserDataAndFollow.member!,
            //       followings: filteredFollowings,
            //     },
            //   },
            // };

            // if (getUserDataAndFollowCache?.getUserDataAndFollow) {
            //   store.writeQuery<GetUserDataAndFollowQuery>({
            //     query: GetUserDataAndFollowDocument,
            //     data: temp,
            //   });
            // }

            // 위/아래 같은 코드 : immer사용

            if (getUserDataAndFollowCache?.getUserDataAndFollow) {
              store.writeQuery<GetUserDataAndFollowQuery>({
                query: GetUserDataAndFollowDocument,
                data: produce(getUserDataAndFollowCache, (a) => {
                  if (a && a['getUserDataAndFollow']['member']) {
                    let temp = [...a['getUserDataAndFollow']['member']['followings']];

                    const index = temp.findIndex((member) => member.target.id === id);
                    if (index !== -1) temp.splice(index, 1);

                    a['getUserDataAndFollow']['member']['followings'] = temp;
                  }
                }),
              });
            }
          }
        },
*/
