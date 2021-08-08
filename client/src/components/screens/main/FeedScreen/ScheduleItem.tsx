import { useReactiveVar } from '@apollo/client';
import { getDate, getHours, getMinutes, getMonth, getYear } from 'date-fns';
import React from 'react';
import styled from 'styled-components/native';
import { utcToLocalTime } from '../../../../functions';
import { Feed } from '../../../../generated/graphql';
import { screenModeVar } from '../../../../stores';
import appTheme from '../../../../styles/constants';
const { COLORS, FONTS, SIZES, STYLED_FONTS } = appTheme;
import { shadow, TextMode } from '../../../../styles/styled';
import { MainNavProps } from '../../../navigator/Main/MainParamList';

// type Schedule = {
//   start_at: string;
//   finish_at: string;
//   title: string;
// };

interface ScheduleItemProps extends MainNavProps<'Feed'> {
  feed: Feed;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  route,
  navigation,
  feed: {
    member: { id, username, profile_img, follower_count },
    schedules,
  },
}) => {
  const screenMode = useReactiveVar(screenModeVar);

  if (schedules.length === 0) return <></>;

  return (
    <Container screenMode={screenMode} style={shadow}>
      <NavRow
        onPress={() => {
          navigation.navigate('Schedule', { id, username, profile_img, follower_count });
        }}
      >
        {profile_img ? <ProfileImg source={{ uri: profile_img }} /> : <ProfileView />}
        <UsernameText screenMode={screenMode}>{username}</UsernameText>
      </NavRow>

      <DateText screenMode={screenMode}>
        {getYear(utcToLocalTime(schedules[0].start_at))}. {getMonth(utcToLocalTime(schedules[0].start_at)) + 1}.{' '}
        {getDate(utcToLocalTime(schedules[0].start_at))}.
      </DateText>

      {schedules.map((item, idx) => (
        <ScheduleRow key={idx} style={{ marginTop: 4 }}>
          <ScheduleText numberOfLines={1} screenMode={screenMode}>
            {getHours(utcToLocalTime(item.start_at)) < 10
              ? `0${getHours(utcToLocalTime(item.start_at))}`
              : getHours(utcToLocalTime(item.start_at))}
            :
            {getMinutes(utcToLocalTime(item.start_at)) < 10
              ? `0${getMinutes(utcToLocalTime(item.start_at))}`
              : getMinutes(utcToLocalTime(item.start_at))}{' '}
            -{' '}
            {getHours(utcToLocalTime(item.finish_at)) < 10
              ? `0${getHours(utcToLocalTime(item.finish_at))}`
              : getHours(utcToLocalTime(item.finish_at))}
            :
            {getMinutes(utcToLocalTime(item.finish_at)) < 10
              ? `0${getMinutes(utcToLocalTime(item.finish_at))}`
              : getMinutes(utcToLocalTime(item.finish_at))}
          </ScheduleText>
          <TitleText numberOfLines={1}>{item.title}</TitleText>
        </ScheduleRow>
      ))}
    </Container>
  );
};

export default ScheduleItem;

const Container = styled.View<ScreenMode>`
  background-color: ${({ screenMode }) => (screenMode === 'dark' ? '#3D3C3F' : COLORS.white)};
  margin-top: 14px;
  padding-vertical: 23px;
  padding-horizontal: 23px;
  border-radius: 22px;
`;
const NavRow = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const ProfileView = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background-color: #a6b1e0;
`;
const ProfileImg = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background-color: #a6b1e0;
`;
const UsernameText = styled(TextMode)`
  margin-left: 10px;
  font-weight: 600;
  ${STYLED_FONTS.body3}
`;
const DateText = styled.Text<ScreenMode>`
  margin-top: 10px;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 12px;
  color: ${({ screenMode }) => (screenMode === 'dark' ? '#A0A0A0' : '#5f5f5f')};
`;

const ScheduleRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ScheduleText = styled(TextMode)`
  ${STYLED_FONTS.body3}
  font-weight: 500;
  width: 121px;
`;
const TitleText = styled(TextMode)`
  margin-left: 6px;
  ${STYLED_FONTS.body3}
  width: ${SIZES.windowWidth - 23 * 2 - SIZES.paddingHorizontal * 2 - 121 - 6}px;
`;
