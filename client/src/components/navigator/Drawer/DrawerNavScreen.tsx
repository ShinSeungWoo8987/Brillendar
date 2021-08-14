import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { View, TouchableOpacity, Dimensions, Alert, RefreshControl } from 'react-native';
import produce from 'immer';
import * as ImagePicker from 'expo-image-picker';
import { useReactiveVar } from '@apollo/client';
import { DrawerContentComponentProps, DrawerContentOptions, DrawerItem } from '@react-navigation/drawer';

import { Container, TextMode, ChangeBtn, ChangeBtnText } from '../../../styles/styled';
import { uploadProfileImg, deleteSecureStore, setSecureStore } from '../../../functions';

import { screenModeVar, changeScreenMode } from '../../../stores';
import {
  GetUserDataAndFollowDocument,
  GetUserDataAndFollowQuery,
  Maybe,
  useChangePrivateAccountMutation,
  useGetUserDataAndFollowLazyQuery,
  useGetUserDataAndFollowQuery,
  useUpdateProfileImgMutation,
} from '../../../generated/graphql';

import LoadingScreen from '../../../../LoadingScreen';
import RequestItem from './components/RequestItem';

import { FontAwesome, Ionicons, MaterialCommunityIcons } from '../../../styles/vectorIcons';
import appTheme, { paddingHorizontal } from '../../../styles/constants';
const { COLORS, STYLED_FONTS } = appTheme;

const windowHeight = Dimensions.get('window').height;

interface DrawerNavScreenProps extends DrawerContentComponentProps<DrawerContentOptions> {
  setAccessToken: Dispatch<SetStateAction<string | null>>;
}

const DrawerNavScreen: React.FC<DrawerNavScreenProps> = ({ state, descriptors, setAccessToken, navigation }) => {
  const screenMode = useReactiveVar(screenModeVar);

  const [updateProfileImg, {}] = useUpdateProfileImgMutation();

  const [hasGalleryPermission, setHasGalleryPermission] = useState<Boolean | null>(null);

  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [followRequest, setFollowRequest] = useState<ClientMember[]>([]);

  const [getUserDataAndFollow, { error, loading, data }] = useGetUserDataAndFollowLazyQuery({
    fetchPolicy: 'network-only',
  });

  const [changePrivateAccount] = useChangePrivateAccountMutation();

  useEffect(() => {
    getUserDataAndFollow();
  }, []);

  useEffect(() => {
    if (data && data.getUserDataAndFollow.member) {
      const temp = data.getUserDataAndFollow.member.followers.filter((member) => {
        return member.relation === 1;
      });

      const requests: ClientMember[] = temp.map(({ member: { id, username, profile_img, follower_count } }) => ({
        id,
        username,
        profile_img,
        follower_count,
      }));
      setFollowRequest(requests);

      setIsPrivateAccount(data?.getUserDataAndFollow.member?.private!);
    }
  }, [error, data]);

  const onPrivateAccountPress = () => {
    changePrivateAccount({ variables: { isPrivateAccount: !isPrivateAccount } })
      .then((res) => {
        if (res.data?.changePrivateAccount) setIsPrivateAccount(!isPrivateAccount);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

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

  /////////////////////////////////////////////////////////////////////////////////////////////

  const id = data?.getUserDataAndFollow.member?.id;
  const username = data?.getUserDataAndFollow.member?.username;
  const profile_img = data?.getUserDataAndFollow.member?.profile_img;

  const onLogout = () => {
    // setAccessToken(null);
    deleteSecureStore('access_token').then(() => setAccessToken(null));
  };

  const lockIconNormal = isPrivateAccount ? 'ios-lock-closed-sharp' : 'ios-lock-open-sharp';
  const lockIconDark = isPrivateAccount ? 'ios-lock-closed-outline' : 'ios-lock-open-outline';

  const lockIconName = screenMode === 'dark' ? lockIconNormal : lockIconDark;
  const iconColor = screenMode === 'dark' ? COLORS.lightGray3 : COLORS.lightGray;

  return (
    <Wrapper screenMode={screenMode}>
      <Upside>
        <ProfileContainer>
          <RowVerticalCenter>
            <TouchableOpacity onPress={handleProfileImg}>
              {profile_img ? <ProfileImg source={{ uri: profile_img }} /> : <ProfileView />}
            </TouchableOpacity>

            <ProfileText screenMode={screenMode} numberOfLines={1}>
              {username}
            </ProfileText>
          </RowVerticalCenter>
        </ProfileContainer>

        <TopNavView>
          <Item screenMode={screenMode}>팔로우 요청</Item>

          <SelectedScreen screenMode={screenMode}>
            {data?.getUserDataAndFollow.error || error || loading ? (
              <LoadingScreen />
            ) : (
              <Scroll
                style={{ height: windowHeight - 280 }}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={getUserDataAndFollow} />}
              >
                {followRequest.length !== 0 &&
                  followRequest.map((member) => <RequestItem key={member.id} {...member} navigation={navigation} />)}
              </Scroll>
            )}
          </SelectedScreen>
        </TopNavView>
      </Upside>

      <View>
        <Bottom>
          <Row>
            <TouchableOpacity
              onPress={() => {
                const _mode = screenMode === 'dark' ? 'light' : 'dark';
                setSecureStore('screen_mode', _mode);
                changeScreenMode(_mode);
              }}
            >
              <Ionicons
                name={screenMode === 'dark' ? 'ios-moon' : 'ios-sunny-outline'}
                color={iconColor}
                size={24}
                style={IconStyle}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onPrivateAccountPress()}>
              <Ionicons name={lockIconName} color={iconColor} size={24} style={IconStyle} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('LeaveMember')}>
              <Ionicons
                name={screenMode === 'dark' ? 'ios-hand-right' : 'ios-hand-right-outline'}
                color={iconColor}
                size={24}
                style={IconStyle}
              />
            </TouchableOpacity>
          </Row>

          <TouchableOpacity onPress={() => onLogout()}>
            <Ionicons name="ios-log-out-outline" color={iconColor} size={24} />
          </TouchableOpacity>
        </Bottom>
      </View>
    </Wrapper>
  );
};

export default DrawerNavScreen;

const Wrapper = styled(Container)`
  flex: 1;
  display: flex;
  justify-content: space-between;
`;

const Upside = styled.View`
  margin-top: 4px;
  padding-horizontal: 16px;
`;

const ProfileContainer = styled.View`
  flex-direction: row;
  height: 64px;
  align-items: center;
  justify-content: space-between;
`;

const RowVerticalCenter = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProfileView = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 20px;
  background-color: #a6b1e0;
`;

const ProfileImg = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 20px;
`;

const ProfileText = styled(TextMode)`
  margin-left: 4px;
  width: 194px;
  ${STYLED_FONTS.body3}
`;

const TopNavView = styled.View`
  margin-top: 4px;
`;

const Item = styled(TextMode)`
  padding-vertical: 6px;
  ${STYLED_FONTS.body4}
`;

const SelectedScreen = styled.View<ScreenMode>`
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${({ screenMode }) => (screenMode === 'dark' ? COLORS.lightGray2 : COLORS.lightGray3)};
`;
const Scroll = styled.ScrollView``;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const IconStyle = {
  marginRight: 16,
};

const Bottom = styled(Row)`
  /* border-width: 1px; */
  align-items: center;
  height: 48px;
  padding-horizontal: ${paddingHorizontal}px;
`;
