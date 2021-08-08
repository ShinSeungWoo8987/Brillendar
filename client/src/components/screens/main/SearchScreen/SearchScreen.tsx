import { useReactiveVar } from '@apollo/client';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { screenModeVar } from '../../../../stores';
import { Container, TextMode } from '../../../../styles/styled';

import { TextInput } from 'react-native-gesture-handler';
import { useSearchMemberLazyQuery } from '../../../../generated/graphql';
import styled from 'styled-components/native';
import { MainNavProps } from '../../../navigator/Main/MainParamList';

import { Feather } from '../../../../styles/vectorIcons';

import appTheme from '../../../../styles/constants';
const { COLORS, FONTS, SIZES, STYLED_FONTS } = appTheme;

interface SearchScreenProps extends MainNavProps<'Search'> {}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchMember, { loading, data }] = useSearchMemberLazyQuery();
  const [searchString, setSearchString] = useState('');
  const screenMode = useReactiveVar(screenModeVar);

  return (
    <Container screenMode={screenMode}>
      <SearchView screenMode={screenMode}>
        <Feather
          name="search"
          color={screenMode === 'dark' ? COLORS.lightGray : COLORS.lightGray4}
          size={16}
          style={{ marginTop: 8 }}
        />
        <SearchText
          placeholder="검색"
          placeholderTextColor={screenMode === 'dark' ? COLORS.lightGray : COLORS.lightGray4}
          onChangeText={(search) => {
            if (search.length < 20) {
              search && searchMember({ variables: { search } });
              setSearchString(search);
            }
          }}
          value={searchString}
          screenMode={screenMode}
        />
      </SearchView>

      <FoundMemberView>
        {searchString !== '' &&
          data?.searchMember &&
          data?.searchMember.map((member) => (
            <FoundMemberItem
              key={member.id}
              onPress={() => {
                navigation.navigate('Schedule', {
                  id: member.id,
                  username: member.username,
                  profile_img: member.profile_img,
                  follower_count: member.follower_count,
                });
                setSearchString('');
              }}
            >
              {member.profile_img ? <ProfileImg source={{ uri: member.profile_img }} /> : <ProfileView />}
              <ProfileNameText screenMode={screenMode} numberOfLines={1}>
                {member.username}
              </ProfileNameText>
            </FoundMemberItem>
          ))}
      </FoundMemberView>
    </Container>
  );
};

export default SearchScreen;

const SearchView = styled.View<ScreenMode>`
  flex-direction: row;
  height: 34px;
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 16px;
  margin-right: 16px;
  padding-left: 12px;

  background-color: ${({ screenMode }) => (screenMode === 'dark' ? COLORS.lightGray3 : COLORS.lightGray2)};
  border-radius: 5px;
  border-width: 1px;
  border-color: ${COLORS.lightGray3};
`;
const SearchText = styled.TextInput<ScreenMode>`
  width: 100%;
  margin-left: 8px;
  margin-top: -2px;

  color: black;
  ${STYLED_FONTS.body4};
`;

const FoundMemberView = styled.ScrollView`
  border-top-color: #e0e0e0;
  border-top-width: 1px;
`;

const FoundMemberItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;

  height: 58px;
  margin-horizontal: ${SIZES.paddingHorizontal}px;
`;

export const ProfileView = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background-color: #a6b1e0;
`;
export const ProfileImg = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background-color: #a6b1e0;
`;

const ProfileNameText = styled(TextMode)`
  ${STYLED_FONTS.body3}
  margin-left: 12px;
  width: 130px;
`;
