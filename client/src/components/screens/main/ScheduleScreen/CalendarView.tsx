import { useReactiveVar } from '@apollo/client';
import { getDate, isSameDay } from 'date-fns';

import React, { useRef, Dispatch, SetStateAction, useEffect } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { screenModeVar } from '../../../../stores';
import appTheme, { paddingHorizontal } from '../../../../styles/constants';
const { COLORS, FONTS, SIZES, STYLED_FONTS } = appTheme;
import { TextMode, shadow } from '../../../../styles/styled';
import { Day, getMonthDays } from '../AddScheduleScreen/calendar/functions';

interface DayItemProps extends Day {
  selected?: boolean;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
  count: number;
}

const DayItem: React.FC<DayItemProps> = ({ date, day, formatted, selected, count, setSelectedDate }) => {
  const screenMode = useReactiveVar(screenModeVar);
  // if (selected) console.log(date);

  return (
    <Item>
      {formatted === 'Sun' ? (
        <SundayText screenMode={screenMode}>{formatted}</SundayText>
      ) : formatted === 'Sat' ? (
        <SaturdayText screenMode={screenMode}>{formatted}</SaturdayText>
      ) : (
        <DaysOfWeekText screenMode={screenMode}>{formatted}</DaysOfWeekText>
      )}

      <ShadowBox screenMode={screenMode} style={selected ? {} : shadow}>
        <DayCard selected={selected} onPress={() => setSelectedDate(date)}>
          <DateText screenMode={screenMode}>{day}</DateText>
          <CountView>
            {count !== 0 && (
              <>
                <Circle />
                <ScheduleNumText screenMode={screenMode}>{count}</ScheduleNumText>
              </>
            )}
          </CountView>
        </DayCard>
      </ShadowBox>
    </Item>
  );
};

interface CalendarViewProps {
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
  scheduleCount: number[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, setSelectedDate, scheduleCount }) => {
  const monthDays = getMonthDays(selectedDate);
  const scrollRef = useRef<ScrollView>(null);

  // 날짜 변경시 스크롤
  useEffect(() => {
    const dateNum = getDate(selectedDate);

    if (dateNum > 28) {
      scrollRef.current?.scrollToEnd({ animated: true });
    } else if (dateNum < 4) {
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    } else {
      const x = paddingHorizontal + (dateNum - 4) * 45 + (dateNum - 1) * 10 - 10 * 3; // 앞에 3일은 눌러도 맨앞이기 때문에 10*3을 빼줘야함.
      scrollRef.current?.scrollTo({ x, y: 0, animated: true });
    }
  }, [selectedDate]);

  return (
    <ScrollView contentContainerStyle={ScrollViewStyle} horizontal={true} ref={scrollRef}>
      {monthDays.map((day, idx) => {
        if (isSameDay(day.date, selectedDate))
          return (
            <DayItem
              key={day.day}
              {...day}
              count={scheduleCount[idx]}
              selected={true}
              setSelectedDate={setSelectedDate}
            />
          );
        else return <DayItem key={day.day} {...day} count={scheduleCount[idx]} setSelectedDate={setSelectedDate} />;
      })}
      {/* <View style={{ width: 22 }} /> */}
    </ScrollView>
  );
};

export default CalendarView;

const CalendarContainer = styled.ScrollView`
  padding-horizontal: ${SIZES.paddingHorizontal}px;
  padding-top: 8px;
  padding-bottom: 20px;
`;

const ScrollViewStyle = {
  paddingLeft: SIZES.paddingHorizontal,
  paddingRight: 6,

  paddingTop: 8,
  paddingBottom: 20,
};

const DaysOfWeekText = styled(TextMode)`
  font-size: 12px;
  font-weight: 500;
  color: #979797;
`;

const SundayText = styled(DaysOfWeekText)`
  color: #fd8686;
`;
const SaturdayText = styled(DaysOfWeekText)`
  color: #99a6ff;
`;

const Item = styled.View`
  align-items: center;
  margin-right: 10px;
`;

const ShadowBox = styled.View<ScreenMode>`
  /* background-color: ${({ screenMode }) => (screenMode === 'dark' ? '#3D3C3F' : COLORS.white)}; */
  background-color: ${({ screenMode }) => (screenMode === 'dark' ? COLORS.gray : COLORS.white)};

  margin-top: 10px;
  border-radius: 5px;
`;

const DayCard = styled.TouchableOpacity<{ selected?: boolean }>`
  display: flex;
  width: 45px;
  height: 60px;
  align-items: center;
  justify-content: space-around;
  border-radius: 5px;

  ${({ selected }) =>
    selected &&
    `
  border-color: #A5D5B5;
  border-width: 2px;
  `};
`;

const DateText = styled(TextMode)`
  ${STYLED_FONTS.body4}
  font-weight: 500;
`;
const ScheduleNumText = styled(TextMode)<ScreenMode>`
  font-size: 10px;
  font-weight: 500;

  color: ${({ screenMode }) => (screenMode === 'dark' ? '#A0A0A0' : '#979797')};
  margin-left: 4px;
`;

const Circle = styled.View`
  width: 6px;
  height: 6px;
  background-color: #9be3b3;
  border-radius: 3px;
`;

const CountView = styled.View`
  flex-direction: row;
  align-items: center;
  height: 12px;
`;
