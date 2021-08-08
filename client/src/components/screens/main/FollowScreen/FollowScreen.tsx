import { useReactiveVar } from '@apollo/client';
import React from 'react';
import styled from 'styled-components/native';

import { StatusBar } from 'expo-status-bar';
import FollowItem from './FollowItem';
import { MainNavProps } from '../../../navigator/Main/MainParamList';
import { screenModeVar } from '../../../../stores';
import { Container, HeaderSection, HeaderView, NavItem, TextMode } from '../../../../styles/styled';
import { Follow, Member, useGetUserDataAndFollowQuery } from '../../../../generated/graphql';
import { chunkedArrayFillNull } from '../../../../functions';
import { View } from 'react-native';
import appTheme from '../../../../styles/constants';
const { COLORS, FONTS, SIZES, STYLED_FONTS } = appTheme;

interface FollowScreenProps extends MainNavProps<'Follow'> {}

const FollowScreen: React.FC<FollowScreenProps> = ({ navigation, route }) => {
  const screenMode = useReactiveVar(screenModeVar);

  const { loading, data, error } = useGetUserDataAndFollowQuery();

  const followers = data?.getUserDataAndFollow.member?.followers;
  const followings = data?.getUserDataAndFollow.member?.followings;

  let finalFollowers: (Follow | null)[][] = []; // member_id
  let finalFollowings: (Follow | null)[][] = []; // target_id

  let followersTemp = followers?.filter((f) => f.relation === 2);
  if (followersTemp && followersTemp.length !== 0) {
    finalFollowers = chunkedArrayFillNull(followersTemp, 5);
  }

  let followingsTemp = followings?.filter((f) => f.relation === 2);
  if (followingsTemp && followingsTemp.length !== 0) {
    finalFollowings = chunkedArrayFillNull(followingsTemp, 5);
  }

  return (
    <Container screenMode={screenMode}>
      <StatusBar style={screenMode === 'dark' ? 'light' : 'dark'} />
      <Header screenMode={screenMode}>
        <Title screenMode={screenMode}>Follower</Title>

        {/* <NavItem>
          <Feather name="edit" size={24} color={darkModeToWhite(screenMode)} />
        </NavItem> */}
      </Header>

      {finalFollowers.map((followers, idx) => (
        <FollowLine key={idx}>
          {followers.map((member, idx) => {
            if (!member) return <View key={idx} style={{ width: 52 }} />;
            return (
              <FollowItem
                key={member.member.id}
                navigation={navigation}
                route={route}
                id={member.member.id}
                username={member.member.username}
                profile_img={member.member.profile_img!}
                follower_count={member.member.follower_count}
              />
            );
          })}
        </FollowLine>
      ))}

      <BottomHeader screenMode={screenMode}>
        <Title screenMode={screenMode}>Following</Title>
      </BottomHeader>

      {finalFollowings.map((followings, idx) => (
        <FollowLine key={idx}>
          {followings.map((member, idx) => {
            if (!member) return <View key={idx} style={{ width: 52 }} />;
            return (
              <FollowItem
                key={member.target.id}
                navigation={navigation}
                route={route}
                id={member.target.id}
                username={member.target.username}
                profile_img={member.target.profile_img!}
                follower_count={member.target.follower_count}
              />
            );
          })}
        </FollowLine>
      ))}
    </Container>
  );
};

export default FollowScreen;

const Header = styled(HeaderView)`
  border-bottom-width: 0px;
`;

const BottomHeader = styled(Header)`
  margin-top: 44px;
`;

const FollowLine = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: ${SIZES.paddingHorizontal}px;
  margin-vertical: 10px;
`;

const Title = styled(TextMode)`
  ${STYLED_FONTS.h2}
`;
