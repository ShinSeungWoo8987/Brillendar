import React, { useEffect, useState } from 'react';
import { useApolloClient, useReactiveVar } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
import { MainNavProps } from '../../../navigator/Main/MainParamList';
import { Container, darkModeToWhite, TextMode } from '../../../../styles/styled';

import CalendarView from './CalendarView';
import ScheduleView from './ScheduleView';
import BlurModal from './BlurModal';

import Header from './Header';

import { startOfMonth, getDate, getDaysInMonth, getYear, getMonth, isSameMonth } from 'date-fns';
import {
  CombinedSchedule,
  GetUserDataAndFollowDocument,
  GetUserDataAndFollowQuery,
  ScheduleRequest,
  useReadMonthScheduleLazyQuery,
} from '../../../../generated/graphql';
import { addMonths } from 'date-fns/esm';
import DatePicker from '../AddScheduleScreen/DatePicker';
import { seoulToLocalTime, syncServerRequestTime, makeDate, fixNewDateError } from '../../../../functions';
import { screenModeVar, scheduleModalVar, changeReadScheduleVariablesVar } from '../../../../stores';
import styled from 'styled-components/native';

import { Ionicons } from '../../../../styles/vectorIcons';
import appTheme, { windowHeight } from '../../../../styles/constants';
import produce from 'immer';
const { COLORS, STYLED_FONTS } = appTheme;
interface ScheduleScreenProps extends MainNavProps<'Schedule'> {}

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation, route }) => {
  const client = useApolloClient();
  const { id, username, profile_img, follower_count } = route.params;

  const screenMode = useReactiveVar(screenModeVar);
  const scheduleModal = useReactiveVar(scheduleModalVar);

  const [datepickerOpen, setDatepickerOpen] = useState(false);

  const exactDate = () => makeDate(getYear(new Date()), getMonth(new Date()), getDate(new Date()), 0, 0);
  const [selectedDate, setSelectedDate] = useState(exactDate);
  const [beforeDate, setBeforeDate] = useState(exactDate);

  useEffect(() => {
    // new Date()는 현재 시간을 지정하므로, 아이디만 바뀌더라도 selectedDate가 바뀌게된다. (시간이 계속 흐르기 때문에)
    setSelectedDate(exactDate);
  }, [id]);

  const readMonthSchedulevariables: ScheduleRequest = {
    id,
    month_start: Number(fixNewDateError(syncServerRequestTime(startOfMonth(selectedDate)))),
    month_end: Number(fixNewDateError(syncServerRequestTime(startOfMonth(addMonths(selectedDate, 1))))),
  };

  const [readMonthSchedule, { data, loading, error }] = useReadMonthScheduleLazyQuery({
    fetchPolicy: 'network-only',
    variables: { scheduleRequest: readMonthSchedulevariables },
  });

  useEffect(() => {
    readMonthSchedule();
  }, []);

  useEffect(() => {
    if (!isSameMonth(beforeDate, selectedDate)) {
      // 달이 바뀌었을때만 refetch해준다.
      readMonthSchedule();
    }
    setBeforeDate(selectedDate);

    changeReadScheduleVariablesVar(readMonthSchedulevariables);
  }, [selectedDate]);

  // console.log(typeof data, loading, error);

  const getUserDataAndFollowCache = client.readQuery<GetUserDataAndFollowQuery>({
    query: GetUserDataAndFollowDocument,
  });

  const checkMember = getUserDataAndFollowCache?.getUserDataAndFollow.member?.followings.filter(
    (m) => m.target.id === id
  );

  if (checkMember && checkMember.length === 1) {
    if (checkMember[0].relation === 1 && data?.readMonthSchedule.following === true) {
      // 내 팔로잉 목록에서 요청중이였는데, 새로고침했더니 팔로잉이 되어있네?
      // 그러면 상대가 팔로잉을 받아준거니까 내 팔로잉 목록에서 relation과 해당 유저 follower_count+1로 업데이트 해주기.

      // 팔로워 목록 업데이트
      if (getUserDataAndFollowCache?.getUserDataAndFollow) {
        client.writeQuery<GetUserDataAndFollowQuery>({
          query: GetUserDataAndFollowDocument,
          data: produce(getUserDataAndFollowCache, (a) => {
            if (a && a['getUserDataAndFollow']['member']) {
              let temp = [...a['getUserDataAndFollow']['member']['followings']];

              const newFollowingList = temp.map((m) => {
                if (m.target.id === id) {
                  let changedMember: typeof m = {
                    ...m,
                    relation: 2,
                    target: { ...m.target, follower_count: m.target.follower_count + 1 },
                  };

                  return changedMember;
                } else return m;
              });

              a['getUserDataAndFollow']['member']['followings'] = newFollowingList;
            }
          }),
        });
      }
    }
  }

  const scheduleTemp = data?.readMonthSchedule.Schedules?.map((s) => ({
    ...s,
    start_at: seoulToLocalTime(s.start_at),
    finish_at: seoulToLocalTime(s.finish_at),
  }));

  /////////////////////////////////////////////////////////////////////////////
  let schedules: CombinedSchedule[][] = [];
  let scheduleCount: number[] = [];

  for (let i = 0; i < getDaysInMonth(selectedDate); i++) {
    schedules.push([]);
    scheduleCount.push(0);
  }

  /////////////////////////////////////////////////////////////////////////////
  if (!loading && scheduleTemp) {
    for (let i = 0; i < scheduleTemp.length; i++) {
      if (scheduleTemp[i]) schedules[scheduleTemp[i].start_at.getDate() - 1].push(scheduleTemp[i] as CombinedSchedule);
    }

    scheduleCount = schedules.map((s) => s.length);
  }

  return (
    <Container screenMode={screenMode}>
      <StatusBar style={screenMode === 'dark' ? 'light' : 'dark'} />
      <Header id={id} username={username} profile_img={profile_img} follower_count={follower_count} />

      {loading ? (
        <Center>
          <ActivityIndicator size="large" color="gray" />
        </Center>
      ) : data === undefined || error ? (
        <></>
      ) : data && data.readMonthSchedule.readable ? (
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={readMonthSchedule} />}
        >
          <CalendarView selectedDate={selectedDate} setSelectedDate={setSelectedDate} scheduleCount={scheduleCount} />
          <ScheduleView
            selectedDate={selectedDate}
            setDatepickerOpen={setDatepickerOpen}
            schedules={schedules[getDate(selectedDate) - 1]}
          />
        </ScrollView>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={readMonthSchedule} />}
        >
          <Center style={{ height: windowHeight - 111 }}>
            <CircleBorder screenMode={screenMode}>
              <Ionicons
                name={screenMode === 'dark' ? 'ios-lock-closed-sharp' : 'ios-lock-closed-outline'}
                color={darkModeToWhite(screenMode)}
                size={36}
              />
            </CircleBorder>

            <MainText screenMode={screenMode}>비공개 계정</MainText>
            <SubText screenMode={screenMode}>팔로우하여 스케줄을 확인해보세요.</SubText>
          </Center>
        </ScrollView>
      )}

      {datepickerOpen && (
        <DatePicker date={selectedDate} setDate={setSelectedDate} setDatepickerOpen={setDatepickerOpen} />
      )}

      {scheduleModal.mongo_id && scheduleModal.open && <BlurModal navigation={navigation} route={route} />}
    </Container>
  );
};

export default ScheduleScreen;

const Center = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const CircleBorder = styled.View<ScreenMode>`
  border-color: ${({ screenMode }) => darkModeToWhite(screenMode)};
  border-width: 2px;
  width: 100px;
  height: 100px;
  border-radius: 50px;

  align-items: center;
  justify-content: center;

  margin-bottom: 12px;
`;

const MainText = styled(TextMode)`
  ${STYLED_FONTS.body3}
  font-weight: 500;
  margin-bottom: 4px;
`;

const SubText = styled(TextMode)`
  color: #a5a5a5;
  font-weight: 500;
`;
