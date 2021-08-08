import { useReactiveVar } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { screenModeVar, changeDrawerEnable } from '../../../../stores';
import { Container, darkModeToWhite, HeaderView, TextMode } from '../../../../styles/styled';
import { MainNavProps } from '../../../navigator/Main/MainParamList';

import styled from 'styled-components/native';
import { useGetLikeMembersLazyQuery } from '../../../../generated/graphql';

import { MaterialIcons } from '../../../../styles/vectorIcons';
import appTheme from '../../../../styles/constants';
const { COLORS, FONTS, SIZES, STYLED_FONTS } = appTheme;

interface LikeScreenProps extends MainNavProps<'Like'> {}

const LikeScreen: React.FC<LikeScreenProps> = ({
  route: {
    params: { id },
  },
  navigation,
}) => {
  useFocusEffect(
    useCallback(() => {
      changeDrawerEnable(false);
      return () => {
        changeDrawerEnable(true);
      };
    }, [])
  );

  const screenMode = useReactiveVar(screenModeVar);

  const [getLikeMembers, { loading, error, data }] = useGetLikeMembersLazyQuery();

  useEffect(() => {
    getLikeMembers({ variables: { schedule_id: id } });
  }, [id]);

  return (
    <Container screenMode={screenMode}>
      <Header screenMode={screenMode}>
        <BackBtn
          onPress={() => {
            navigation.goBack();
          }}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'} />
        </BackBtn>

        <HeaderText screenMode={screenMode}>좋아요</HeaderText>

        <View style={{ width: 40 }} />
      </Header>

      <ScrollView>
        <>
          {data &&
            data.getLikeMembers.likes &&
            data.getLikeMembers.likes.map(({ member: { id, username, profile_img, follower_count } }) => (
              <LikeView key={id}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Schedule', { id, username, profile_img, follower_count })}
                >
                  {profile_img ? <ProfileImg source={{ uri: profile_img }} /> : <ProfileView />}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Schedule', { id, username, profile_img, follower_count })}
                >
                  <UsernameText numberOfLines={1} screenMode={screenMode}>
                    {username}
                  </UsernameText>
                </TouchableOpacity>
              </LikeView>
            ))}
        </>
      </ScrollView>
    </Container>
  );
};

export default LikeScreen;

const Header = styled(HeaderView)``;

const BackBtn = styled.TouchableOpacity`
  width: 40px;
  padding-vertical: 10px;
`;

const HeaderText = styled(TextMode)`
  ${STYLED_FONTS.body2}
  color: ${({ screenMode }) => darkModeToWhite(screenMode)};
`;

const LikeView = styled.View`
  height: 56px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${SIZES.paddingHorizontal}px;
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
  background-color: #a6b1e0;
`;

const UsernameText = styled(TextMode)`
  width: 280px;
  margin-left: 10px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ screenMode }) => darkModeToWhite(screenMode)};
`;
