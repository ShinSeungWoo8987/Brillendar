import React, { useEffect, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { MainNavProps } from '../../../navigator/Main/MainParamList';
import { Container, darkModeToWhite, TextMode } from '../../../../styles/styled';

import CalendarView from './CalendarView';
import ScheduleView from './ScheduleView';
import BlurModal from './BlurModal';

import Header from './Header';

import { startOfMonth, getDate, getDaysInMonth, getYear, getMonth } from 'date-fns';
import { CombinedSchedule, useReadMonthScheduleLazyQuery } from '../../../../generated/graphql';
import { addMonths } from 'date-fns/esm';
import DatePicker from '../AddScheduleScreen/DatePicker';
import { seoulToLocalTime, syncServerRequestTime, makeDate, fixNewDateError } from '../../../../functions';
import { screenModeVar, scheduleModalVar, changeReadScheduleVariablesVar } from '../../../../stores';
import styled from 'styled-components/native';

import { Ionicons } from '../../../../styles/vectorIcons';
import appTheme from '../../../../styles/constants';
const { COLORS, STYLED_FONTS } = appTheme;
interface ScheduleScreenProps extends MainNavProps<'Schedule'> {}

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation, route }) => {
  const { id, username, profile_img, follower_count } = route.params;
  const screenMode = useReactiveVar(screenModeVar);
  const scheduleModal = useReactiveVar(scheduleModalVar);

  const [datepickerOpen, setDatepickerOpen] = useState(false);

  const exactDate = () => makeDate(getYear(new Date()), getMonth(new Date()), getDate(new Date()), 0, 0);
  const [selectedDate, setSelectedDate] = useState(exactDate);

  const [readMonthSchedule, { data, loading, error }] = useReadMonthScheduleLazyQuery({ fetchPolicy: 'cache-first' });

  useEffect(() => {
    // new Date()는 현재 시간을 지정하므로, 아이디만 바뀌더라도 selectedDate가 바뀌게된다. (시간이 계속 흐르기 때문에)
    setSelectedDate(exactDate);
  }, [id]);

  useEffect(() => {
    // 따라서 여기서 쿼리를 실행시키면된다.
    const readMonthSchedulevariables = {
      id,
      month_start: Number(fixNewDateError(syncServerRequestTime(startOfMonth(selectedDate)))),
      month_end: Number(fixNewDateError(syncServerRequestTime(startOfMonth(addMonths(selectedDate, 1))))),
    };

    readMonthSchedule({ variables: { scheduleRequest: readMonthSchedulevariables } });

    changeReadScheduleVariablesVar(readMonthSchedulevariables);
  }, [selectedDate]);

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

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
  if (scheduleTemp) {
    for (let i = 0; i < scheduleTemp.length; i++) {
      if (scheduleTemp[i]) schedules[scheduleTemp[i].start_at.getDate() - 1].push(scheduleTemp[i] as CombinedSchedule);
    }
  }
  /////////////////////////////////////////////////////////////////////////////

  scheduleCount = schedules.map((s) => s.length);

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
        <ScrollView style={{ flex: 1 }}>
          <CalendarView selectedDate={selectedDate} setSelectedDate={setSelectedDate} scheduleCount={scheduleCount} />
          <ScheduleView
            selectedDate={selectedDate}
            setDatepickerOpen={setDatepickerOpen}
            schedules={schedules[getDate(selectedDate) - 1]}
          />
        </ScrollView>
      ) : (
        <Center>
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
