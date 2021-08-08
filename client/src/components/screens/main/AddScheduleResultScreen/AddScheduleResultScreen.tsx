import { useApolloClient, useReactiveVar } from '@apollo/client';
import React, { useCallback, useState } from 'react';
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Snackbar } from 'react-native-paper';
import styled from 'styled-components/native';

import {
  Container,
  TextMode,
  HeaderView,
  darkModeToWhite,
  CenterTouchableOpacity,
  shadow,
} from '../../../../styles/styled';

import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  readScheduleVariablesVar,
  scheduleModalVar,
  changeScheduleModal,
  screenModeVar,
  changeDrawerEnable,
} from '../../../../stores';
import { AddScheduleResultNavProps } from '../../../navigator/AddScheduleResult/AddScheduleResultParamList';
import { uploadResult } from '../../../../functions';
import { ReadMonthScheduleDocument, ReadMonthScheduleQuery } from '../../../../generated/graphql';

import produce from 'immer';

import { MaterialIcons, MaterialCommunityIcons, Feather } from '../../../../styles/vectorIcons';
import appTheme, { paddingHorizontal, windowWidth } from '../../../../styles/constants';

const { COLORS, STYLED_FONTS } = appTheme;

type NewScheduleResultInput = {
  result_description: string;
  result_img: string[];
};

const initNewScheduleResult: NewScheduleResultInput = {
  result_description: '',
  result_img: [],
};

interface AddScheduleResultScreenProps extends AddScheduleResultNavProps<'AddScheduleResult'> {}

const AddScheduleResultScreen: React.FC<AddScheduleResultScreenProps> = ({ navigation, route }) => {
  const client = useApolloClient();
  const readScheduleVariables = useReactiveVar(readScheduleVariablesVar);
  const screenMode = useReactiveVar(screenModeVar);
  const scheduleModal = useReactiveVar(scheduleModalVar);

  const [snackBarvisible, setSnackBarVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [newScheduleResult, setNewScheduleResult] = useState<NewScheduleResultInput>(initNewScheduleResult);

  const [uploading, setUploading] = useState(false);

  const onDismissSnackBar = () => setSnackBarVisible(false);

  useFocusEffect(
    useCallback(() => {
      changeDrawerEnable(false);
      changeScheduleModal({ ...scheduleModal, open: false });
      return () => {
        changeDrawerEnable(true);

        setNewScheduleResult(initNewScheduleResult);
      };
    }, [])
  );

  const pushNewImage = (image: string) => {
    setNewScheduleResult({ ...newScheduleResult, result_img: [...newScheduleResult.result_img, image] });
  };

  const onSubmit = async () => {
    if (!newScheduleResult.result_description) {
      setSnackMessage('내용을 입력해주세요.');
      setSnackBarVisible(true);
    } else {
      // Submit
      const { result_description, result_img } = newScheduleResult;

      // 받아온 url로 다시 graphql업로드해서 2번 통신할 필요가없음.
      // formData에 내용도 같이 보내서 파일업로드+db업로드 한번에 처리
      setUploading(true);
      uploadResult(scheduleModal.mongo_id!, result_description, result_img)
        .then((res) => {
          // console.log(res.data.error);

          if (res.data.scheduleResult) {
            // 스케줄 결과 업데이트
            const readMonthScheduleOptions = {
              query: ReadMonthScheduleDocument,
              variables: { scheduleRequest: readScheduleVariables },
            };

            const readMonthScheduleCache = client.readQuery<ReadMonthScheduleQuery>(readMonthScheduleOptions);

            if (readMonthScheduleCache?.readMonthSchedule) {
              client.writeQuery<ReadMonthScheduleQuery>({
                ...readMonthScheduleOptions,
                data: produce(readMonthScheduleCache, (a) => {
                  if (a['readMonthSchedule']['Schedules']) {
                    let temp = [...a['readMonthSchedule']['Schedules']];
                    const updatedArray = produce(temp, (draft) => {
                      const index = draft.findIndex((m) => m.mongo_id === scheduleModal.mongo_id);
                      if (index !== -1)
                        draft[index] = {
                          ...draft[index],
                          result_description: res.data.scheduleResult.result_description,
                          result_img: res.data.scheduleResult.result_img,
                        };
                    });

                    a['readMonthSchedule']['Schedules'] = updatedArray;
                  }
                }),
              });
            }
          }
          setUploading(false);
          changeScheduleModal();
          navigation.goBack();
        })
        .catch((err) => {
          console.log(err);
          setUploading(false);
        });

      // const response = await fetch(result_img[0]);
      // const blob = await response.blob();

      // uploadFiles(files)
      //   .then((res) => console.log(res.data))
      //   .catch((err) => console.log(err));

      // 서버로 업로드 Mutation
      // setNewScheduleResult(initNewScheduleResult);
    }
  };

  const navigateCameraScreen = () => {
    if (newScheduleResult.result_img.length < 5) {
      navigation.navigate('Camera', { pushNewImage });
    } else {
      setSnackMessage('result_img < 5');
      setSnackBarVisible(true);
    }
  };

  const removeImg = (imageUrl: string) => {
    setNewScheduleResult({
      ...newScheduleResult,
      result_img: newScheduleResult.result_img.filter((url) => url !== imageUrl),
    });
  };

  return (
    <>
      <Wrapper screenMode={screenMode}>
        <Header screenMode={screenMode}>
          <BackBtn disabled={uploading} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={20} color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'} />
          </BackBtn>

          <HeaderText screenMode={screenMode}>결과 등록</HeaderText>
          <View style={{ width: 40 }} />
        </Header>

        {/* //////////////////////////// */}

        <ScrollView>
          <Section>
            <Left>
              <MaterialCommunityIcons name="table-of-contents" size={14} color={darkModeToWhite(screenMode)} />
            </Left>

            <Right screenMode={screenMode}>
              <SubjectText screenMode={screenMode}>내용</SubjectText>
              <Input
                screenMode={screenMode}
                value={newScheduleResult.result_description}
                onChangeText={(result_description) =>
                  setNewScheduleResult({ ...newScheduleResult, result_description })
                }
                placeholder="입력하세요"
                placeholderTextColor="#A5A5A5"
              />
            </Right>
          </Section>
          {/* ////////////////////////// */}
          <Section>
            <Left>
              <MaterialCommunityIcons name="tag-outline" size={14} color={darkModeToWhite(screenMode)} />
            </Left>

            <Right screenMode={screenMode} style={{ borderBottomWidth: 0 }}>
              <SubjectText screenMode={screenMode}>사진 추가</SubjectText>

              <TouchableOpacity onPress={navigateCameraScreen}>
                <RowBetween>
                  <PictureText>{newScheduleResult.result_img.length === 0 ? '(선택)' : ''}</PictureText>
                  {/* {newScheduleResult.result_img.length === 0 ? <PictureText>(선택)</PictureText> : <></>} */}

                  <Feather name="plus-circle" size={24} color={darkModeToWhite(screenMode)} />
                </RowBetween>
              </TouchableOpacity>
            </Right>
          </Section>

          {/* //////////// */}

          <Section style={{ paddingTop: 0 }}>
            <Left />
            <Right screenMode={screenMode} style={{ borderBottomWidth: 0 }}>
              {newScheduleResult.result_img.length !== 0 &&
                newScheduleResult.result_img.map((uri, idx) => (
                  <View key={idx}>
                    <ResultImage source={{ uri }} />

                    <MinusBtn onPress={() => removeImg(uri)} style={shadow}>
                      <View style={{ backgroundColor: COLORS.white, width: 10, height: 2, borderRadius: 1 }} />
                    </MinusBtn>
                  </View>
                ))}
            </Right>
          </Section>
        </ScrollView>

        <Bottom onPress={onSubmit} disabled={uploading}>
          <UploadBtn start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#F0D6C1', '#E9A7A2']}>
            {uploading ? <ActivityIndicator size="small" /> : <UploadText>업로드</UploadText>}
          </UploadBtn>
        </Bottom>
      </Wrapper>

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
    </>
  );
};

export default AddScheduleResultScreen;

const Wrapper = styled(Container)`
  padding-bottom: 54px;
`;

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

const SubjectText = styled(TextMode)`
  color: ${({ screenMode }) => darkModeToWhite(screenMode)};
  ${STYLED_FONTS.body4}
`;

const Input = styled.TextInput<ScreenMode>`
  width: 84%;
  margin-top: 2px;
  font-size: 20px;
  font-weight: 500;
  color: ${({ screenMode }) => darkModeToWhite(screenMode)};
`;

const PictureText = styled.Text`
  width: 84%;
  margin-top: 2px;
  font-size: 20px;
  font-weight: 500;
  color: #a5a5a5;
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
  color: ${COLORS.black};
  font-size: 20px;
  font-weight: 500;
`;

const RowBetween = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ResultImage = styled.Image`
  z-index: 1;
  margin-bottom: 20px;
  width: 100%;
  height: undefined;
  aspect-ratio: 1;
  border-radius: 16px;
`;

const MinusBtn = styled(CenterTouchableOpacity)`
  background-color: #de7676;
  width: 28px;
  height: 28px;
  border-radius: 14px;

  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 99;
`;
