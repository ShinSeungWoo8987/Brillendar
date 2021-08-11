import { useReactiveVar } from '@apollo/client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';

import {
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  KeyboardEvent,
  Platform,
} from 'react-native';
import { Snackbar, Switch } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from './DatePicker';
import { useFocusEffect } from '@react-navigation/native';
import { addMinutes, addMonths, compareDesc, getDate, getMonth, getYear, startOfMonth } from 'date-fns';
import { MainNavProps } from '../../../navigator/Main/MainParamList';
import {
  CombinedSchedule,
  ReadMonthScheduleDocument,
  ReadMonthScheduleQuery,
  useCreateScheduleMutation,
} from '../../../../generated/graphql';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { screenModeVar, changeDrawerEnable, changeScheduleModal } from '../../../../stores';
import {
  Container,
  darkModeToWhite,
  HeaderView,
  Highlight,
  TagItem,
  TagListView,
  TagText,
  TextMode,
} from '../../../../styles/styled';
import produce from 'immer';
import {
  differenceFromSeoul,
  fixNewDateError,
  getKeyboardHeight,
  makeDate,
  syncServerRequestTime,
} from '../../../../functions';

import { MaterialIcons, MaterialCommunityIcons, Feather } from '../../../../styles/vectorIcons';
import appTheme, { paddingHorizontal, windowHeight, windowWidth } from '../../../../styles/constants';
const { COLORS, STYLED_FONTS } = appTheme;

type NewScheduleInput = {
  open: boolean;
  title: string;
  description: string;
  tags: string[];
};

const initNewSchedule: NewScheduleInput = {
  open: false,
  title: '',
  description: '',
  tags: [],
};

const initTime = { hour: '', minute: '' };

interface AddScheduleScreenProps extends MainNavProps<'AddSchedule'> {}

const AddScheduleScreen: React.FC<AddScheduleScreenProps> = ({ navigation, route }) => {
  const [createSchedule, { loading, data, error }] = useCreateScheduleMutation();
  const screenMode = useReactiveVar(screenModeVar);

  const [datepickerOpen, setDatepickerOpen] = useState(false);
  const [snackBarvisible, setSnackBarVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const [newSchedule, setNewSchedule] = useState<NewScheduleInput>(initNewSchedule);
  const [date, setDate] = useState<Date>(new Date());

  const [startAt, setStartAt] = useState(initTime);
  const [finishAt, setFinishAt] = useState(initTime);

  const [tag, setTag] = useState('');

  const addTagItem = () => {
    // 태그 갯수 5개로 제한하기.
    if (newSchedule.tags.length < 5) {
      if (tag && newSchedule.tags.indexOf(tag) === -1) {
        setNewSchedule({ ...newSchedule, tags: [...newSchedule.tags, tag] });
        setTag('');
      }
    } else {
      setSnackMessage('태그는 5개까지 사용할 수 있습니다.');
      setSnackBarVisible(true);
    }
  };

  const removeTagItem = (removeStr: string) => {
    setNewSchedule({ ...newSchedule, tags: newSchedule.tags.filter((tag) => tag !== removeStr) });
  };

  // const makeDate = (year: number, month: number, date: number, hour: number, minute: number) => {
  //   return new Date(
  //     `${year}-${month + 1 < 10 ? `0${month + 1}` : month + 1}-${date < 10 ? `0${date}` : date}T${
  //       hour < 10 ? `0${hour}` : hour
  //     }:${minute < 10 ? `0${minute}` : minute}:00`
  //   );
  // };

  // new Date()를 찍으면 지멋대로 utc시간으로 변경됨. Date.now()도 마찬가지네..
  // console.log(`현재시간`, Platform.OS, new Date());
  // console.log(`현재시간`, Platform.OS, Date.now());

  // 근데 왜 이건 정상으로 찍히지.
  // console.log(`현재시간`, Platform.OS, getMonth(new Date()) + 1);
  // console.log(`현재시간`, Platform.OS, new Date().getDate());

  const onSubmit = () => {
    if (!startAt.hour || !startAt.minute) {
      setSnackMessage('스케줄 시작시간을 입력해주세요.');
      setSnackBarVisible(true);
    } else if (!finishAt.hour || !finishAt.minute) {
      setSnackMessage('스케줄 종료시간을 입력해주세요.');
      setSnackBarVisible(true);
    } else if (
      compareDesc(
        makeDate(getYear(date), getMonth(date), getDate(date), Number(startAt.hour), Number(startAt.minute)),
        makeDate(getYear(date), getMonth(date), getDate(date), Number(finishAt.hour), Number(finishAt.minute))
      ) === -1
    ) {
      setSnackMessage('시작시간은 종료시간 이전으로 설정해주세요. ');
      setSnackBarVisible(true);
    } else if (!newSchedule.title) {
      setSnackMessage('일정을 입력해주세요.');
      setSnackBarVisible(true);
    } else if (!newSchedule.description) {
      setSnackMessage('내용을 입력해주세요.');
      setSnackBarVisible(true);
    } else {
      // Submit
      const { title, description, open, tags } = newSchedule;
      const start_at = Number(
        makeDate(getYear(date), getMonth(date), getDate(date), Number(startAt.hour), Number(startAt.minute))
      );

      const finish_at = Number(
        makeDate(getYear(date), getMonth(date), getDate(date), Number(finishAt.hour), Number(finishAt.minute))
      );

      createSchedule({
        variables: {
          schedule: { open: !open, title, description, start_at, finish_at },
          tags,
        },
        update: (store, { data }) => {
          if (data?.createSchedule.Schedule) {
            // 새로운 스케줄 업데이트
            const readMonthScheduleOptions = {
              query: ReadMonthScheduleDocument,
              variables: {
                scheduleRequest: {
                  id: data.createSchedule.Schedule.writer_id,
                  // 날짜가 일치한다면, 이미 불러온적이 있다는 의미이므로, 업데이트가 될것임.
                  month_start: Number(fixNewDateError(syncServerRequestTime(startOfMonth(date)))),
                  month_end: Number(fixNewDateError(syncServerRequestTime(startOfMonth(addMonths(date, 1))))),
                },
              },
            };

            const readMonthScheduleCache = store.readQuery<ReadMonthScheduleQuery>(readMonthScheduleOptions);

            if (readMonthScheduleCache?.readMonthSchedule) {
              store.writeQuery<ReadMonthScheduleQuery>({
                ...readMonthScheduleOptions,
                data: produce(readMonthScheduleCache, (a) => {
                  if (a['readMonthSchedule']['Schedules']) {
                    const newSchedule = { ...data.createSchedule.Schedule } as CombinedSchedule;
                    let temp = [...a['readMonthSchedule']['Schedules'], newSchedule];

                    a['readMonthSchedule']['Schedules'] = temp;
                  }
                }),
              });
            }
          }
        },
      });

      setNewSchedule(initNewSchedule);
      setStartAt(initTime);
      setFinishAt(initTime);
      setDate(new Date());
      setTag('');

      changeScheduleModal();
      navigation.goBack();
    }
  };

  useFocusEffect(
    useCallback(() => {
      changeDrawerEnable(false);
      return () => {
        changeDrawerEnable(true);

        setNewSchedule(initNewSchedule);
        setStartAt(initTime);
        setFinishAt(initTime);
        setDate(new Date());
        setTag('');
      };
    }, [])
  );

  const onDismissSnackBar = () => setSnackBarVisible(false);

  return (
    <Container screenMode={screenMode}>
      <Snackbar
        style={{
          bottom: 100,
          backgroundColor: 'none',
          width: windowWidth - paddingHorizontal * 2,
          alignSelf: 'center',
        }}
        theme={{ colors: { surface: 'red' } }}
        duration={4000}
        visible={snackBarvisible}
        onDismiss={onDismissSnackBar}
      >
        {snackMessage}
      </Snackbar>

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Header screenMode={screenMode}>
          <BackBtn
            onPress={() => {
              navigation.goBack();
            }}
          >
            <MaterialIcons name="arrow-back-ios" size={20} color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'} />
          </BackBtn>

          <HeaderText screenMode={screenMode}>일정 등록</HeaderText>
          <View style={{ width: 40 }} />
        </Header>
      </TouchableWithoutFeedback>

      {/* //////////////////////////// */}

      <KeyboardAwareScrollView>
        <Section>
          <Left>
            <MaterialCommunityIcons name="check" size={14} color={darkModeToWhite(screenMode)} />
          </Left>

          <Row screenMode={screenMode}>
            <SubjectText screenMode={screenMode}>나만보기</SubjectText>

            <SwipeBtn
              value={newSchedule.open}
              onValueChange={() => setNewSchedule({ ...newSchedule, open: !newSchedule.open })}
            />
          </Row>
        </Section>

        {/* //////////////////////////// */}

        <Section>
          <Left>
            <MaterialCommunityIcons name="calendar-month-outline" size={14} color={darkModeToWhite(screenMode)} />
          </Left>

          <Right screenMode={screenMode}>
            <SubjectText screenMode={screenMode}>날짜</SubjectText>

            <DateTimePickerOpen
              onPress={() => {
                Keyboard.dismiss();
                setDatepickerOpen(true);
              }}
            >
              <ContentText screenMode={screenMode}>
                {getYear(date)}. {getMonth(date) + 1}. {getDate(date)}.
              </ContentText>

              <MaterialCommunityIcons name="calendar-month-outline" size={20} color={darkModeToWhite(screenMode)} />
            </DateTimePickerOpen>
          </Right>
        </Section>

        {/* //////////////////////////// */}

        <Section>
          <Left>
            <MaterialCommunityIcons name="clock-outline" size={14} color={darkModeToWhite(screenMode)} />
          </Left>

          <Right screenMode={screenMode}>
            <SubjectText screenMode={screenMode}>시간</SubjectText>

            <View style={{ flexDirection: 'row', marginTop: 2 }}>
              <TimeInput
                screenMode={screenMode}
                value={startAt.hour}
                placeholder="00"
                placeholderTextColor="#A5A5A5"
                keyboardType="number-pad"
                onChangeText={(hour) => {
                  if (hour.length < 3 && Number(hour) < 24) setStartAt({ ...startAt, hour });
                }}
              />

              <TimeText screenMode={screenMode}>{' : '}</TimeText>

              <TimeInput
                screenMode={screenMode}
                value={startAt.minute}
                placeholder="00"
                placeholderTextColor="#A5A5A5"
                keyboardType="number-pad"
                onChangeText={(minute) => {
                  if (minute.length < 3 && Number(minute) < 60) setStartAt({ ...startAt, minute });
                }}
              />

              <TimeText screenMode={screenMode}>{'  ~  '}</TimeText>

              <TimeInput
                screenMode={screenMode}
                value={finishAt.hour}
                placeholder="00"
                placeholderTextColor="#A5A5A5"
                keyboardType="number-pad"
                onChangeText={(hour) => {
                  if (hour.length < 3 && Number(hour) < 24) setFinishAt({ ...finishAt, hour });
                }}
              />

              <TimeText screenMode={screenMode}>{' : '}</TimeText>

              <TimeInput
                screenMode={screenMode}
                value={finishAt.minute}
                placeholder="00"
                placeholderTextColor="#A5A5A5"
                keyboardType="number-pad"
                onChangeText={(minute) => {
                  if (minute.length < 3 && Number(minute) < 60) setFinishAt({ ...finishAt, minute });
                }}
              />
            </View>
          </Right>
        </Section>

        {/* //////////////////////////// */}

        <Section>
          <Left>
            <MaterialCommunityIcons name="table-of-contents" size={14} color={darkModeToWhite(screenMode)} />
          </Left>

          <Right screenMode={screenMode}>
            <SubjectText screenMode={screenMode}>일정</SubjectText>
            <Input
              screenMode={screenMode}
              value={newSchedule.title}
              onChangeText={(title) => setNewSchedule({ ...newSchedule, title })}
              placeholder="입력하세요"
              placeholderTextColor="#A5A5A5"
            />
          </Right>
        </Section>

        <Section>
          <Left>
            <MaterialCommunityIcons name="content-paste" size={14} color={darkModeToWhite(screenMode)} />
          </Left>

          <Right screenMode={screenMode}>
            <SubjectText screenMode={screenMode}>내용</SubjectText>
            <Input
              screenMode={screenMode}
              value={newSchedule.description}
              onChangeText={(description) => setNewSchedule({ ...newSchedule, description })}
              placeholder="입력하세요"
              placeholderTextColor="#A5A5A5"
            />
          </Right>
        </Section>

        <Section>
          <Left>
            <MaterialCommunityIcons name="tag-outline" size={14} color={darkModeToWhite(screenMode)} />
          </Left>

          <Right screenMode={screenMode} style={{ borderBottomWidth: 0 }}>
            <SubjectText screenMode={screenMode}>태그</SubjectText>

            <RowBetween>
              <Input
                screenMode={screenMode}
                value={tag}
                onChangeText={(text) => {
                  if (text.slice(-1) !== ' ' && text.length < 20) setTag(text);
                }}
                maxLength={20}
                placeholder="입력하세요"
                placeholderTextColor="#A5A5A5"
              />

              <TouchableOpacity onPress={() => addTagItem()}>
                <Feather name="plus-circle" size={24} color={darkModeToWhite(screenMode)} />
              </TouchableOpacity>
            </RowBetween>
          </Right>
        </Section>

        {/* //////////// */}

        <Section style={{ paddingTop: 0, height: windowHeight - 48 - 443.5 }}>
          <Left />

          <TagList screenMode={screenMode}>
            <TagListView>
              {newSchedule.tags.map((tag, idx) => (
                <TagItem key={idx} onPress={(e) => removeTagItem(tag)}>
                  <Highlight screenMode={screenMode} />
                  <TagText screenMode={screenMode}>{tag}</TagText>
                </TagItem>
              ))}
            </TagListView>
          </TagList>
        </Section>
      </KeyboardAwareScrollView>

      <Bottom onPress={onSubmit} disabled={loading}>
        <UploadBtn start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#F0D6C1', '#E9A7A2']}>
          {loading ? <ActivityIndicator size="small" color="gray" /> : <UploadText>업로드</UploadText>}
        </UploadBtn>
      </Bottom>

      {datepickerOpen && <DatePicker date={date} setDate={setDate} setDatepickerOpen={setDatepickerOpen} />}
    </Container>
  );
};

export default AddScheduleScreen;

const Header = styled(HeaderView)``;

const BackBtn = styled.TouchableOpacity`
  width: 40px;
  padding-vertical: 10px;
`;

const HeaderText = styled(TextMode)`
  color: ${({ screenMode }) => darkModeToWhite(screenMode)};
  ${STYLED_FONTS.h3}
`;

const Section = styled.View`
  padding-top: 12px;
  flex-direction: row;
`;

const Left = styled.View`
  width: 64px;
  padding-top: 4px;
  padding-left: 28px;
`;

const Right = styled.View<ScreenMode>`
  flex: 1;
  border-bottom-width: 2px;
  border-bottom-color: ${({ screenMode }) => (screenMode === 'dark' ? '#303030' : '#e4e4e4')};

  padding-bottom: 12px;
  padding-right: 28px;
`;

const Row = styled(Right)`
  flex-direction: row;
  justify-content: space-between;
`;

const SubjectText = styled(TextMode)`
  color: ${({ screenMode }) => darkModeToWhite(screenMode)};
  ${STYLED_FONTS.body4}
`;

const ContentView = styled(TextMode)`
  border-width: 1px;

  margin-top: 2px;
  flex-direction: row;
`;

const TimeInput = styled.TextInput<ScreenMode>`
  width: 32px;
  border-width: 1px;
  border-color: ${({ screenMode }) => (screenMode === 'dark' ? '#303030' : '#a5a5a5')};
  border-radius: 4px;

  font-size: 20px;
  text-align: center;
  color: ${({ screenMode }) => darkModeToWhite(screenMode)};
`;

const TimeText = styled(TextMode)`
  font-size: 20px;
  color: ${({ screenMode }) => darkModeToWhite(screenMode)};
`;

const ContentText = styled(TextMode)`
  margin-top: 2px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ screenMode }) => darkModeToWhite(screenMode)};
`;

const Input = styled.TextInput<ScreenMode>`
  width: 84%;
  margin-top: 2px;
  font-size: 20px;
  font-weight: 500;
  color: ${({ screenMode }) => darkModeToWhite(screenMode)};
`;

const TagList = styled(Right)`
  border-bottom-width: 0;
`;

const Bottom = styled.TouchableOpacity`
  position: absolute;
  bottom: ${paddingHorizontal}px;
  width: 100%;
`;

const UploadBtn = styled(LinearGradient)`
  align-items: center;
  justify-content: center;
  height: 54px;
  margin-horizontal: ${paddingHorizontal}px;
  border-radius: 6px;
`;

const UploadText = styled.Text`
  font-size: 20px;
  font-weight: 500;
`;

const SwipeBtn = styled(Switch)`
  transform: scale(0.7, 0.7);
  position: absolute;
  top: -3px;
  right: 16px;
`;

const RowBetween = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const DateTimePickerOpen = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
`;
