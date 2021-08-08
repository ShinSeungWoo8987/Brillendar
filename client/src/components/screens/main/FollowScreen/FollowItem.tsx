import { useReactiveVar } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { screenModeVar } from '../../../../stores';
import appTheme from '../../../../styles/constants';
const { COLORS, STYLED_FONTS } = appTheme;
import { CenterTouchableOpacity, TextMode } from '../../../../styles/styled';
import { MainNavProps } from '../../../navigator/Main/MainParamList';

interface FollowItemProps extends MainNavProps<'Follow'> {
  id: string;
  username: string;
  profile_img?: string;
  follower_count: number;
}

/////
const DeleteButton: React.FC = () => (
  <MinusBtn>
    <View style={{ backgroundColor: COLORS.white, width: 6, height: 1.8, borderRadius: 0.9 }} />
  </MinusBtn>
);
/////

const FollowItem: React.FC<FollowItemProps> = ({ navigation, id, username, profile_img, follower_count }) => {
  const screenMode = useReactiveVar(screenModeVar);

  return (
    <Container onPress={() => navigation.navigate('Schedule', { id, username, profile_img, follower_count })}>
      <View>
        {profile_img ? <ProfileImg source={{ uri: profile_img }} /> : <ProfileView />}
        {/* <DeleteButton /> */}
      </View>

      <UsernameText numberOfLines={1} screenMode={screenMode}>
        {username}
      </UsernameText>
    </Container>
  );
};

export default FollowItem;

const Container = styled.TouchableOpacity`
  width: 52px;
`;

const ProfileView = styled.View`
  width: 52px;
  height: 52px;
  border-radius: 22px;
  background-color: #a6b1e0;
`;

const ProfileImg = styled.Image`
  width: 52px;
  height: 52px;
  border-radius: 22px;
  background-color: #a6b1e0;
`;

const UsernameText = styled(TextMode)`
  width: 100%;

  text-align: center;
  color: ${({ screenMode }) => (screenMode === 'dark' ? COLORS.lightGray2 : COLORS.lightGray)};

  font-size: 12px;
  font-weight: bold;
  ${STYLED_FONTS.body4}
  font-size:12px;
`;

const MinusBtn = styled(CenterTouchableOpacity)`
  background-color: #de7676;
  width: 18px;
  height: 18px;
  border-radius: 9px;

  position: absolute;
  right: -2px;
  top: -2px;
`;
