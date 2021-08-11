import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import styled from 'styled-components/native';
import { seoulToLocalTime, fixNewDateError } from '../../../../functions';
import { CommentRes, Maybe, Member } from '../../../../generated/graphql';
import { screenModeVar } from '../../../../stores';
import { TextMode } from '../../../../styles/styled';
import { differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks } from 'date-fns';
import appTheme from '../../../../styles/constants';
import { useNavigation } from '@react-navigation/native';
const { COLORS, FONTS, SIZES, STYLED_FONTS } = appTheme;

interface CommentItemProps {
  _id: string;
  schedule_mongo_id: string;
  writer_id: string;
  description: string;
  created_at: string;
  member: {
    id: string;
    username: string;
    profile_img?: Maybe<string>;
    follower_count: number;
  };
}

const CommentItem: React.FC<CommentItemProps> = ({
  _id,
  created_at,
  description,
  member: { id, username, profile_img, follower_count },
}) => {
  const navigation = useNavigation();
  const screenMode = useReactiveVar(screenModeVar);

  const differenceTwoDates = (dateLeft: Date, dateRight: Date): string => {
    if (dateLeft < dateRight) return `Err`;

    // 1분 미만으로 차이나는경우 : 방금
    const differenceMin = differenceInMinutes(dateLeft, dateRight);
    if (differenceMin === 0) return `방금`;

    // 1분이상 1시간 미만으로 차이나는 경우 : n분
    const differenceHour = differenceInHours(dateLeft, dateRight);
    if (differenceHour === 0) return `${differenceMin}분`;

    // 한시간이상 하루 미만으로 차이나는 경우 : n시간
    const differenceDay = differenceInDays(dateLeft, dateRight);
    if (differenceDay === 0) return `${differenceHour}시간`;

    // 하루이상 일주일 미만으로 차이나는 경우 : n일
    const differenceWeek = differenceInWeeks(dateLeft, dateRight);
    if (differenceWeek === 0) return `${differenceDay}일`;

    // 1주일 이상 차이나는 경우 : n주
    return `${differenceWeek}주`;
  };

  const navigateToScheduleScreen = () => navigation.navigate('Schedule', { id, username, profile_img, follower_count });

  return (
    <CommentContainer screenMode={screenMode}>
      <TouchableOpacity onPress={navigateToScheduleScreen}>
        {profile_img ? <ProfileImg source={{ uri: profile_img }} /> : <ProfileView />}
      </TouchableOpacity>

      <Right>
        <CommentContent>
          <TouchableOpacity onPress={navigateToScheduleScreen}>
            <UsernameText screenMode={screenMode}>{username}</UsernameText>
          </TouchableOpacity>

          <CreateAtText>• {differenceTwoDates(new Date(), fixNewDateError(seoulToLocalTime(created_at)))}</CreateAtText>
        </CommentContent>

        <CommentText screenMode={screenMode}>{description}</CommentText>
      </Right>
    </CommentContainer>
  );
};

export default CommentItem;

const CommentContainer = styled.View<ScreenMode>`
  width: 100%;
  min-height: 64px;

  border-color: ${({ screenMode }) => (screenMode === 'dark' ? '#3D3C3F' : COLORS.black)};

  flex-direction: row;

  padding: ${SIZES.paddingHorizontal}px;
  /* padding-horizontal: ${SIZES.paddingHorizontal}px;
  padding-top: ${SIZES.paddingHorizontal}px; */
`;

const ProfileView = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background-color: #a6b1e0;
  margin-right: 8px;
`;
const ProfileImg = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background-color: #a6b1e0;
  margin-right: 8px;
`;

const Right = styled.View`
  width: ${SIZES.windowWidth - 32 - 32 - 8}px;
  margin-top: -2px;
  /* border-width: 1px; */
`;

const CommentContent = styled.View`
  flex-direction: row;
  align-items: center;

  flex-wrap: wrap;
  width: 100%;
`;

const UsernameText = styled(TextMode)`
  font-weight: ${Platform.OS !== 'ios' ? 700 : 600};
`;

const CreateAtText = styled(TextMode)`
  margin-left: 6px;

  color: #8f8f8f;
`;

const CommentText = styled(TextMode)`
  margin-top: 4px;
`;
