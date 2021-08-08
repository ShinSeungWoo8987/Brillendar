import { BlurView } from 'expo-blur';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TouchableWithoutFeedback, Button, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

import { DayOfTheWeekType } from './calendar/dayOfTheWeek';
import { Day, getDayOfTheWeekArray, getMonthDays, getWeekArrays } from './calendar/functions';
import { addMonths, getMonth, getYear } from 'date-fns';
import { changeTabBarDisplay } from '../../../../stores';

import isSameDay from 'date-fns/isSameDay';

import { MaterialIcons, Feather } from '../../../../styles/vectorIcons';
import { CenterTouchableOpacity, CenterView } from '../../../../styles/styled';
import appTheme from '../../../../styles/constants';
const { STYLED_FONTS, COLORS } = appTheme;
interface DatePickerProps {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  setDatepickerOpen: Dispatch<SetStateAction<boolean>>;
}

const DatePicker: React.FC<DatePickerProps> = ({ date, setDate, setDatepickerOpen }) => {
  const [tempDate, setTempDate] = useState(date);

  const [month, setMonth] = useState<(Day | null)[][]>([]);
  const [dayOfTheWeekArray, setDayOfTheWeekArray] = useState<DayOfTheWeekType[]>([]);

  //   const [week, setWeek] = useState<Day[]>([]);

  const weekStartsOn = 0;

  useEffect(() => {
    // const weekDays = getWeekDays(date);
    // setWeek(weekDays);
    setDayOfTheWeekArray(getDayOfTheWeekArray(weekStartsOn));

    const monthDays = getMonthDays(tempDate);
    const monthWeeks = getWeekArrays(monthDays, weekStartsOn);
    setMonth(monthWeeks);
  }, [tempDate]);

  const pressDate = (date: Date) => {
    setDate(date);
    changeTabBarDisplay(true);
    setDatepickerOpen(false);
  };

  const closeModal = () => {
    changeTabBarDisplay(true);
    setDatepickerOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={() => closeModal()}>
      <ModalContainer intensity={100} style={{ borderWidth: 1 }}>
        <SelectBox>
          <CalendarNav>
            <PlusMonthBtn onPress={() => setTempDate(addMonths(tempDate, -1))}>
              <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.white} />
            </PlusMonthBtn>

            <DateText>
              {getYear(tempDate)}. {getMonth(tempDate) + 1 < 10 ? `0${getMonth(tempDate) + 1}` : getMonth(tempDate) + 1}
            </DateText>

            <MinusMonthBtn onPress={() => setTempDate(addMonths(tempDate, 1))}>
              <MaterialIcons
                name="arrow-forward-ios"
                size={20}
                color={COLORS.white}
                style={{ marginRight: -5, paddingLeft: 5 }}
              />
            </MinusMonthBtn>
          </CalendarNav>

          <Row>
            {dayOfTheWeekArray.map((d) => (
              <DayOfTheWeek key={d}>
                {d === 'Sun' ? (
                  <SundayText>{d}</SundayText>
                ) : d === 'Sat' ? (
                  <SaturdayText>{d}</SaturdayText>
                ) : (
                  <DaysOfWeekText>{d}</DaysOfWeekText>
                )}
              </DayOfTheWeek>
            ))}
          </Row>

          {month.map((week, idx) => (
            <Row key={idx}>
              {week.map((day, idx) =>
                day ? (
                  <DayItem key={idx} onPress={() => pressDate(day.date)}>
                    {isSameDay(day.date, new Date()) ? (
                      <View
                        style={{
                          backgroundColor: '#84B44C',
                          borderRadius: 20,
                          width: 30,
                          height: 30,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <WhiteText>{day.day}</WhiteText>
                      </View>
                    ) : (
                      <WhiteText>{day.day}</WhiteText>
                    )}
                  </DayItem>
                ) : (
                  <DayItemView key={idx} />
                )
              )}
            </Row>
          ))}
        </SelectBox>

        <Bottom>
          <CloseBtn onPress={() => closeModal()}>
            <Feather name="x" size={24} color="#FD8686" />
          </CloseBtn>
        </Bottom>
      </ModalContainer>
    </TouchableWithoutFeedback>
  );
};

export default DatePicker;

const Row = styled.View`
  flex-direction: row;

  justify-content: space-between;
  margin-bottom: 4px;
`;

const DayItem = styled(CenterTouchableOpacity)`
  justify-content: center;
  align-items: center;

  width: 40px;
  height: 40px;
`;

const DayItemView = styled.View`
  width: 40px;
  height: 40px;
`;

const DayOfTheWeek = styled(CenterView)`
  justify-content: center;
  align-items: center;
  width: 40px;
`;

///////////

const ModalContainer = styled(BlurView)`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  top: 0;
  align-items: center;
  justify-content: center;
`;
const SelectBox = styled.View`
  align-items: center;

  width: 300px;
  height: 370px;
  background-color: rgba(1, 1, 1, 0.5);
  border-radius: 38px;
`;

const CalendarNav = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  /* height: 74px; */
  padding: 20px;
  /* padding-horizontal: 20px; */
`;

const Bottom = styled.View`
  position: absolute;
  bottom: 50px;

  width: 100%;
  height: 40px;

  align-items: center;
  justify-content: center;
`;

const CloseBtn = styled.TouchableOpacity`
  background-color: rgba(1, 1, 1, 0.5);
  width: 60px;
  height: 60px;
  border-radius: 30px;

  align-items: center;
  justify-content: center;
`;

const WhiteText = styled.Text`
  color: ${COLORS.white};
  ${STYLED_FONTS.body3}
`;

const DateText = styled(WhiteText)`
  font-weight: 500;
  ${STYLED_FONTS.body2}
`;

const DaysOfWeekText = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: ${COLORS.white};
`;

const SundayText = styled(DaysOfWeekText)`
  color: #fd8686;
`;
const SaturdayText = styled(DaysOfWeekText)`
  color: #99a6ff;
`;

const PlusMonthBtn = styled.TouchableOpacity`
  padding-right: 16px;
  padding-vertical: 2px;
`;

const MinusMonthBtn = styled.TouchableOpacity`
  padding-left: 16px;
  padding-vertical: 2px;
`;
