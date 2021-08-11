import { useReactiveVar } from '@apollo/client';
import React, { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import { darkModeToWhite, TextMode } from '../../../../styles/styled';

import { getYear, getDate, getMonth } from 'date-fns';
import { CombinedSchedule } from '../../../../generated/graphql';
import CalendarScheduleItem from './CalendarScheduleItem';
import { screenModeVar, changeTabBarDisplay } from '../../../../stores';
import appTheme from '../../../../styles/constants';
import { MaterialCommunityIcons } from '../../../../styles/vectorIcons';
const { COLORS, FONTS, SIZES, STYLED_FONTS } = appTheme;

interface ScheduleViewProps {
  selectedDate: Date;
  setDatepickerOpen: Dispatch<SetStateAction<boolean>>;
  schedules: CombinedSchedule[];
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ selectedDate, setDatepickerOpen, schedules }) => {
  const screenMode = useReactiveVar(screenModeVar);

  return (
    <ScheduleContainer contentContainerStyle={{ paddingHorizontal: SIZES.paddingHorizontal, paddingBottom: 12 }}>
      <TouchableOpacity
        onPress={() => {
          changeTabBarDisplay(false);
          setDatepickerOpen(true);
        }}
      >
        <Row>
          <SelectedDate screenMode={screenMode}>
            {getYear(selectedDate)}. {getMonth(selectedDate) + 1}. {getDate(selectedDate)}
            {/* 📅 */}
          </SelectedDate>
          <MaterialCommunityIcons
            name="calendar-month"
            size={22}
            color={darkModeToWhite(screenMode)}
            style={{ marginTop: 2 }}
          />
        </Row>
      </TouchableOpacity>

      {schedules.map((schedule) => (
        <CalendarScheduleItem key={schedule.id} {...schedule} />
      ))}
    </ScheduleContainer>
  );
};

export default ScheduleView;

const ScheduleContainer = styled.ScrollView`
  width: 100%;
  /* padding-horizontal: ${SIZES.paddingHorizontal}px; */
  padding-bottom: 30px;
`;

const SelectedDate = styled(TextMode)`
  margin-right: 8px;
  ${STYLED_FONTS.h2}
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;
