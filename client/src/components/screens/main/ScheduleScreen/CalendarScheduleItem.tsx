import { useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { addMonths, getHours, getMinutes, startOfMonth } from 'date-fns';
import produce from 'immer';
import React, { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';

import styled from 'styled-components/native';
import { thousandStr } from '../../../../functions';
import {
  CombinedSchedule,
  GetLikeMembersDocument,
  GetLikeMembersQuery,
  GetUserDataAndFollowDocument,
  GetUserDataAndFollowQuery,
  ReadMonthScheduleDocument,
  ReadMonthScheduleQuery,
  useLikeScheduleMutation,
  useUnLikeScheduleMutation,
} from '../../../../generated/graphql';
import { readScheduleVariablesVar, screenModeVar, changeScheduleModal } from '../../../../stores';

import { TextMode, TagItem, Highlight, TagText, shadow } from '../../../../styles/styled';

import { Ionicons, FontAwesome5 } from '../../../../styles/vectorIcons';
import appTheme from '../../../../styles/constants';

// @ts-ignore
import Swiper from 'react-native-swiper/src';

const { COLORS, STYLED_FONTS } = appTheme;

interface CalendarScheduleItemProps extends CombinedSchedule {}

const CalendarScheduleItem: React.FC<CalendarScheduleItemProps> = ({
  id,
  start_at,
  finish_at,
  tags,
  title,
  description,
  result_description,
  result_img,
  mongo_id,
  like_count,
  isLike,
  comment_count,
}) => {
  const screenMode = useReactiveVar(screenModeVar);
  const readScheduleVariables = useReactiveVar(readScheduleVariablesVar);

  const [open, setOpen] = useState<boolean>(false);
  const navigation = useNavigation();

  const addZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  const start = addZero(getHours(start_at)) + ':' + addZero(getMinutes(start_at));
  const finish = addZero(getHours(finish_at)) + ':' + addZero(getMinutes(finish_at));

  const [likeSchedule, likeScheduleRes] = useLikeScheduleMutation();
  const [unLikeSchedule, unLikeScheduleRes] = useUnLikeScheduleMutation();

  const readMonthScheduleOptions = {
    query: ReadMonthScheduleDocument,
    variables: { scheduleRequest: readScheduleVariables },
  };

  const getLikeMembersOptions = {
    query: GetLikeMembersDocument,
    variables: { schedule_id: id },
  };

  const updateLike = () => {
    if (isLike) {
      unLikeSchedule({
        variables: { schedule_id: id },
        update: (store, { data }) => {
          if (data?.unLikeSchedule) {
            const readMonthScheduleCache = store.readQuery<ReadMonthScheduleQuery>(readMonthScheduleOptions);

            if (readMonthScheduleCache?.readMonthSchedule) {
              store.writeQuery<ReadMonthScheduleQuery>({
                ...readMonthScheduleOptions,
                data: produce(readMonthScheduleCache, (a) => {
                  if (a['readMonthSchedule']['Schedules']) {
                    let temp = [...a['readMonthSchedule']['Schedules']];

                    const updatedArray = produce(temp, (draft) => {
                      const index = draft.findIndex((m) => m.id === id);
                      if (index !== -1)
                        draft[index] = { ...draft[index], like_count: draft[index].like_count - 1, isLike: false };
                    });

                    a['readMonthSchedule']['Schedules'] = updatedArray;
                  }
                }),
              });
            }
          }

          // 좋아요 목록을 가져온 적이 있으면 업데이트, 가져온 적이 없으면 그대로둠 다음에 좋아요 목록을 눌렀을때 이미 반영된 데이터를 가져올 것이기 때문에.
          const getLikeMembersCache = store.readQuery<GetLikeMembersQuery>(getLikeMembersOptions);

          if (getLikeMembersCache?.getLikeMembers.likes) {
            const getUserDataAndFollowCache = store.readQuery<GetUserDataAndFollowQuery>({
              query: GetUserDataAndFollowDocument,
            });

            if (getUserDataAndFollowCache && getUserDataAndFollowCache.getUserDataAndFollow.member) {
              const myUserData = getUserDataAndFollowCache.getUserDataAndFollow.member;

              store.writeQuery<GetLikeMembersQuery>({
                ...getLikeMembersOptions,
                data: produce(getLikeMembersCache, (a) => {
                  if (a['getLikeMembers']['likes']) {
                    let temp = [...a['getLikeMembers']['likes']];

                    const index = temp.findIndex(({ member }) => member.id === myUserData.id);
                    if (index !== -1) temp.splice(index, 1);

                    a['getLikeMembers']['likes'] = temp;
                  }
                }),
              });
            }
          }
        },
      });
    } else {
      likeSchedule({
        variables: { schedule_id: id },
        update: (store, { data }) => {
          if (data?.likeSchedule) {
            const readMonthScheduleCache = store.readQuery<ReadMonthScheduleQuery>(readMonthScheduleOptions);

            if (readMonthScheduleCache?.readMonthSchedule) {
              store.writeQuery<ReadMonthScheduleQuery>({
                ...readMonthScheduleOptions,
                data: produce(readMonthScheduleCache, (a) => {
                  if (a['readMonthSchedule']['Schedules']) {
                    let temp = [...a['readMonthSchedule']['Schedules']];

                    const updatedArray = produce(temp, (draft) => {
                      const index = draft.findIndex((m) => m.id === id);
                      if (index !== -1)
                        draft[index] = { ...draft[index], like_count: draft[index].like_count + 1, isLike: true };
                    });

                    a['readMonthSchedule']['Schedules'] = updatedArray;
                  }
                }),
              });
            }
          }

          // 좋아요 목록을 가져온 적이 있으면 업데이트, 가져온 적이 없으면 그대로둠 다음에 좋아요 목록을 눌렀을때 이미 반영된 데이터를 가져올 것이기 때문에.
          const getLikeMembersCache = store.readQuery<GetLikeMembersQuery>(getLikeMembersOptions);

          if (getLikeMembersCache?.getLikeMembers.likes) {
            const getUserDataAndFollowCache = store.readQuery<GetUserDataAndFollowQuery>({
              query: GetUserDataAndFollowDocument,
            });

            if (getUserDataAndFollowCache && getUserDataAndFollowCache.getUserDataAndFollow.member) {
              const myUserData = getUserDataAndFollowCache.getUserDataAndFollow.member;

              store.writeQuery<GetLikeMembersQuery>({
                ...getLikeMembersOptions,
                data: produce(getLikeMembersCache, (a) => {
                  if (a['getLikeMembers']['likes']) {
                    let temp = [...a['getLikeMembers']['likes']];

                    temp.push({
                      __typename: 'Like',
                      member: {
                        __typename: 'Member',
                        id: myUserData.id,
                        username: myUserData.username,
                        follower_count: myUserData.followers.length,
                        profile_img: myUserData.profile_img,
                      },
                    });

                    a['getLikeMembers']['likes'] = temp;
                  }
                }),
              });
            }
          }
        },
      });
    }
  };

  return (
    <Container screenMode={screenMode} style={shadow}>
      <Absolute
        onPress={() => changeScheduleModal({ modalType: result_description === '' ? 1 : 2, mongo_id, open: true })}
      >
        <Ionicons name="ios-ellipsis-vertical" size={20} color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'} />
      </Absolute>

      <FlexRow>
        <TouchableOpacity onPress={() => setOpen(!open)}>
          <ScheduleText numberOfLines={1} screenMode={screenMode}>
            {start} - {finish}
            {'  '}
            {title}
          </ScheduleText>
        </TouchableOpacity>
      </FlexRow>

      {open && (
        <>
          <TextMode screenMode={screenMode} style={{ marginTop: 10 }}>
            {description}
          </TextMode>

          <FlexRow style={{ marginTop: 10 }}>
            {tags.map(({ idx, tag }) => (
              <TagItem key={idx}>
                <Highlight screenMode={screenMode} />
                <TagText screenMode={screenMode}>{tag}</TagText>
              </TagItem>
            ))}
          </FlexRow>

          {result_img.length > 0 && (
            <SwiperView>
              <Swiper loop dot={<InactiveDot />} activeDot={<ActiveDot />} paginationStyle={{ bottom: 18 }}>
                {result_img.map((r) => (
                  <ResultImg key={r.idx} source={{ uri: r.url }} />
                ))}
              </Swiper>
            </SwiperView>
          )}

          {result_description !== '' && result_img.length === 0 && (
            <View style={{ marginTop: 20, marginBottom: 14, borderTopWidth: 1.4, borderColor: COLORS.lightGray3 }} />
          )}

          {result_description !== '' && (
            <TextMode screenMode={screenMode} style={{ marginTop: 6 }}>
              {result_description}
            </TextMode>
          )}

          <FlexRow style={{ marginTop: 20 }}>
            <TouchableOpacity onPress={updateLike}>
              <FontAwesome5
                name="laugh"
                size={20}
                color={isLike ? COLORS.alertBlue : screenMode === 'dark' ? COLORS.white : '#5f5f5f'}
                style={{ paddingRight: 8 }}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Like', { id })}>
              <ContentNum screenMode={screenMode}>{thousandStr(like_count)}</ContentNum>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => navigation.navigate('Comment', { id, mongo_id })}
            >
              <Ionicons
                name="chatbox-outline"
                size={20}
                color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'}
                style={{ marginLeft: 28, paddingRight: 8 }}
              />
              <ContentNum screenMode={screenMode}>{thousandStr(comment_count)}</ContentNum>
            </TouchableOpacity>

            {/*
            <FontAwesome5 name="laugh-squint" size={24} color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'} />
            <FontAwesome5 name="meh" size={24} color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'} />
            <FontAwesome5 name="smile" size={24} color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'} />
            <FontAwesome5 name="meh-blank" size={24} color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'} />
            <FontAwesome5 name="laugh-wink" size={24} color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'} />
            <FontAwesome5 name="smile-wink" size={24} color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'} />
            */}
          </FlexRow>
        </>
      )}
    </Container>
  );
};

export default CalendarScheduleItem;

const Container = styled.View<ScreenMode>`
  /* background-color: ${({ screenMode }) => (screenMode === 'dark' ? '#3D3C3F' : COLORS.white)}; */
  background-color: ${({ screenMode }) => (screenMode === 'dark' ? COLORS.gray : COLORS.white)};
  margin-top: 14px;
  padding-vertical: 23px;
  padding-horizontal: 23px;
  border-radius: 22px;
`;
const Absolute = styled.TouchableOpacity`
  position: absolute;
  right: 23px;
  top: 25px;
  z-index: 99;
`;

const FlexRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ScheduleText = styled(TextMode)`
  margin-top: 2px;
  ${STYLED_FONTS.body3}
  font-weight: 500;
`;

const SwiperView = styled(Swiper)`
  margin-top: 20px;
  width: 100%;
  height: undefined;
  aspect-ratio: 0.95;
  /* border-width: 1px; */
`;

const ResultImg = styled.Image`
  width: 100%;
  height: undefined;
  aspect-ratio: 1;
  border-radius: 16px;
`;

const InactiveDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  margin: 3px;
  background-color: lightgray;
`;

const ActiveDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin: 3px;
  background-color: ${COLORS.alertBlue};
`;

const ContentNum = styled(TextMode)`
  min-width: 56px;
  font-size: 14px;
`;
