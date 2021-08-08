import React, { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity, View } from 'react-native';
import produce from 'immer';
import { useReactiveVar } from '@apollo/client';

import { ChangeBtn, ChangeBtnText, TextMode } from '../../../../styles/styled';

import { screenModeVar } from '../../../../stores';
import styled from 'styled-components/native';
import {
  GetUserDataAndFollowDocument,
  GetUserDataAndFollowQuery,
  useAcceptFollowMutation,
  useRejectFollowMutation,
} from '../../../../generated/graphql';

import { Feather, Entypo } from '../../../../styles/vectorIcons';

import appTheme from '../../../../styles/constants';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
const { STYLED_FONTS } = appTheme;

interface RequestItemProps extends ClientMember {
  navigation: DrawerNavigationHelpers;
}
//
const RequestItem: React.FC<RequestItemProps> = ({ navigation, id, username, profile_img, follower_count }) => {
  const screenMode = useReactiveVar(screenModeVar);

  const [acceptFollow] = useAcceptFollowMutation();
  const [rejectFollow] = useRejectFollowMutation();

  // 팔로우 승인/거절 이후 getUserDataAndFollow의 캐시를 바꿔줘야한다.
  // 캐시 수정하는 방법 찾아보기.
  const onAcceptFollow = () => {
    acceptFollow({
      variables: { id },
      update: (store, { data }) => {
        if (data?.acceptFollow) {
          // 팔로워 목록에 추가
          const getUserDataAndFollowCache = store.readQuery<GetUserDataAndFollowQuery>({
            query: GetUserDataAndFollowDocument,
          });

          if (getUserDataAndFollowCache?.getUserDataAndFollow) {
            store.writeQuery<GetUserDataAndFollowQuery>({
              query: GetUserDataAndFollowDocument,
              data: produce(getUserDataAndFollowCache, (a) => {
                if (a && a['getUserDataAndFollow']['member']) {
                  let temp = [...a['getUserDataAndFollow']['member']['followers']];

                  const updatedArray = produce(temp, (draft) => {
                    const index = draft.findIndex((m) => m.member.id === id);
                    if (index !== -1) draft[index] = { ...draft[index], relation: 2 };
                  });

                  a['getUserDataAndFollow']['member']['followers'] = updatedArray;
                }
              }),
            });
          }
        }
      },
    });
  };

  const onRejectFollow = () => {
    rejectFollow({
      variables: { id },
      update: (store, { data }) => {
        if (data?.rejectFollow) {
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
  };

  const navigateToScheduleScreen = () => navigation.navigate('Schedule', { id, username, profile_img, follower_count });

  return (
    <Container>
      <Section>
        <TouchableOpacity onPress={navigateToScheduleScreen}>
          {profile_img ? <ProfileImg source={{ uri: profile_img }} /> : <ProfileView />}
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToScheduleScreen}>
          <UsernameText screenMode={screenMode} numberOfLines={1}>
            {username}
          </UsernameText>
        </TouchableOpacity>
      </Section>

      <Section>
        <ChangeBtn onPress={() => onAcceptFollow()}>
          <Entypo name="check" size={16} color="white" />
        </ChangeBtn>
        <TouchableOpacity onPress={() => onRejectFollow()}>
          <Feather name="x" size={16} color="#707070" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </Section>
    </Container>
  );
};

export default RequestItem;

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-vertical: 4px;
`;

const Section = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UsernameText = styled(TextMode)`
  margin-left: 4px;
  width: 142px;
  ${STYLED_FONTS.body4}
`;

const ProfileView = styled.View`
  width: 36px;
  height: 36px;
  background-color: #a6b1e0;
  border-radius: 15px;
`;

const ProfileImg = styled.Image`
  width: 36px;
  height: 36px;
  background-color: #a6b1e0;
  border-radius: 15px;
`;
