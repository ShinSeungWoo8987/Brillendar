import { useReactiveVar } from '@apollo/client';
import { BlurView } from 'expo-blur';
import React from 'react';
import { TouchableWithoutFeedback, Platform } from 'react-native';
import styled from 'styled-components/native';

import { TextMode, AndroidBlurView } from '../../../../styles/styled';
import { useNavigation } from '@react-navigation/native';
import { MainNavProps } from '../../../navigator/Main/MainParamList';
import {
  ReadMonthScheduleDocument,
  ReadMonthScheduleQuery,
  useDeleteScheduleMutation,
  useDeleteScheduleResultMutation,
} from '../../../../generated/graphql';
import { readScheduleVariablesVar, scheduleModalVar, changeScheduleModal } from '../../../../stores';
import produce from 'immer';
import { Feather } from '../../../../styles/vectorIcons';
import appTheme from '../../../../styles/constants';

const { STYLED_FONTS } = appTheme;

interface BlurModalProps extends MainNavProps<'Schedule'> {}

const BlurModal: React.FC<BlurModalProps> = ({ navigation, route }) => {
  const { mongo_id, modalType } = useReactiveVar(scheduleModalVar);
  const readScheduleVariables = useReactiveVar(readScheduleVariablesVar);

  const [deleteScheduleResult, {}] = useDeleteScheduleResultMutation();
  const [deleteSchedule, {}] = useDeleteScheduleMutation();

  const onDeleteSchedule = () =>
    deleteSchedule({
      variables: { mongo_id: mongo_id! },
      update: (store, { data }) => {
        if (data?.deleteSchedule) {
          const readMonthScheduleOptions = {
            query: ReadMonthScheduleDocument,
            variables: { scheduleRequest: readScheduleVariables },
          };

          const readMonthScheduleCache = store.readQuery<ReadMonthScheduleQuery>(readMonthScheduleOptions);

          if (readMonthScheduleCache?.readMonthSchedule) {
            store.writeQuery<ReadMonthScheduleQuery>({
              ...readMonthScheduleOptions,
              data: produce(readMonthScheduleCache, (a) => {
                if (a['readMonthSchedule']['Schedules']) {
                  let temp = [...a['readMonthSchedule']['Schedules']];
                  const updatedArray = produce(temp, (draft) => {
                    const index = draft.findIndex((m) => m.mongo_id === mongo_id);
                    if (index !== -1) draft.splice(index, 1);
                  });
                  a['readMonthSchedule']['Schedules'] = updatedArray;
                }
              }),
            });
          }

          changeScheduleModal();
        }
      },
    });

  const onDeleteScheduleResult = () =>
    deleteScheduleResult({
      variables: { mongo_id: mongo_id! },
      update: (store, { data }) => {
        if (data?.deleteScheduleResult) {
          const readMonthScheduleOptions = {
            query: ReadMonthScheduleDocument,
            variables: { scheduleRequest: readScheduleVariables },
          };

          const readMonthScheduleCache = store.readQuery<ReadMonthScheduleQuery>(readMonthScheduleOptions);

          if (readMonthScheduleCache?.readMonthSchedule) {
            store.writeQuery<ReadMonthScheduleQuery>({
              ...readMonthScheduleOptions,
              data: produce(readMonthScheduleCache, (a) => {
                if (a['readMonthSchedule']['Schedules']) {
                  let temp = [...a['readMonthSchedule']['Schedules']];
                  const updatedArray = produce(temp, (draft) => {
                    const index = draft.findIndex((m) => m.mongo_id === mongo_id);
                    if (index !== -1) draft[index] = { ...draft[index], result_description: '', result_img: [] };
                  });
                  a['readMonthSchedule']['Schedules'] = updatedArray;
                }
              }),
            });
          }

          changeScheduleModal();
        }
      },
    });

  return (
    <TouchableWithoutFeedback onPress={() => changeScheduleModal()}>
      <ModalContainer intensity={100}>
        {modalType === 1 ? (
          <SelectBox onPress={() => navigation.navigate('AddScheduleResult')}>
            <SelectBoxText>결과 추가</SelectBoxText>
          </SelectBox>
        ) : (
          <SelectBox onPress={onDeleteScheduleResult}>
            <SelectBoxText>결과 삭제</SelectBoxText>
          </SelectBox>
        )}

        <SelectBox onPress={onDeleteSchedule} style={{ marginTop: 14 }}>
          <SelectBoxText>삭제</SelectBoxText>
        </SelectBox>

        <Bottom>
          <CloseBtn onPress={() => changeScheduleModal()}>
            <Feather name="x" size={24} color="#FD8686" />
          </CloseBtn>
        </Bottom>
      </ModalContainer>
    </TouchableWithoutFeedback>
  );
};

export default BlurModal;

const ModalContainer = styled(Platform.OS !== 'ios' ? AndroidBlurView : BlurView)`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  top: 0;
  align-items: center;
  justify-content: center;
`;
const SelectBox = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 74px;
  background-color: rgba(1, 1, 1, 0.5);
  border-radius: 38px;
`;

const SelectBoxText = styled(TextMode)`
  color: white;
  font-weight: 500;
  ${STYLED_FONTS.body3}
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
