import { useReactiveVar } from '@apollo/client';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import styled from 'styled-components/native';
import { Maybe } from '../../../../generated/graphql';
import { screenModeVar } from '../../../../stores';
import { TextMode } from '../../../../styles/styled';
import { MainNavProps } from '../../../navigator/Main/MainParamList';

interface OngoingScheduleItemProps extends MainNavProps<'Feed'> {
  id: string;
  username: string;
  profile_img: Maybe<string> | undefined;
  follower_count: number;
  title: string;
}

const OngoingScheduleItem: React.FC<OngoingScheduleItemProps> = ({
  navigation,
  route,
  id,
  username,
  profile_img,
  follower_count,
  title,
}) => {
  const screenMode = useReactiveVar(screenModeVar);

  return (
    <Container
      onPress={() => {
        navigation.navigate('Schedule', { id, username, profile_img, follower_count });
      }}
    >
      <Border start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#F0D6C1', '#E9A7A2']}>
        {/* '#D72466', '#F6B75E' */}
        {profile_img ? <ProfileImg source={{ uri: profile_img }} /> : <ProfileView />}
      </Border>

      <UsernameText numberOfLines={1} screenMode={screenMode}>
        {username}
      </UsernameText>
      <TitleText numberOfLines={1} screenMode={screenMode}>
        {title}
      </TitleText>
    </Container>
  );
};

export default OngoingScheduleItem;

const Container = styled.TouchableOpacity`
  width: 88px;
  margin-right: 10px;
`;

const UsernameText = styled(TextMode)`
  margin-top: 4px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
`;

const TitleText = styled(TextMode)`
  margin-top: 2px;
  font-size: 10px;
  text-align: center;
`;

const Border = styled(LinearGradient)`
  width: 88px;
  height: 88px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const ProfileView = styled.View`
  width: 84px;
  height: 84px;
  border-radius: 18px;
  background-color: #a6b1e0;
`;

const ProfileImg = styled.Image`
  width: 84px;
  height: 84px;
  border-radius: 18px;
  background-color: #a6b1e0;
`;
