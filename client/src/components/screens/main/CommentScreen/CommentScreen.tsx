import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  useColorScheme,
} from 'react-native';
import styled from 'styled-components/native';
import { Container, darkModeToWhite, HeaderView, TextMode } from '../../../../styles/styled';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { MainNavProps } from '../../../navigator/Main/MainParamList';
import { useFocusEffect } from '@react-navigation/native';
import { readScheduleVariablesVar, screenModeVar, changeDrawerEnable } from '../../../../stores';

import { useReactiveVar } from '@apollo/client';

import CommentItem from './CommentItem';
import {
  ReadCommentQuery,
  CommentRes,
  useCreateCommentMutation,
  useReadCommentLazyQuery,
  ReadMonthScheduleQuery,
  ReadMonthScheduleDocument,
  ReadCommentDocument,
  GetUserDataAndFollowQuery,
  GetUserDataAndFollowDocument,
} from '../../../../generated/graphql';
import produce from 'immer';
import { addMonths, startOfMonth } from 'date-fns';

import { MaterialIcons, AntDesign } from '../../../../styles/vectorIcons';
import appTheme from '../../../../styles/constants';
const { COLORS, FONTS, SIZES, STYLED_FONTS } = appTheme;

interface CommentScreenProps extends MainNavProps<'Comment'> {}

const CommentScreen: React.FC<CommentScreenProps> = ({
  route: {
    params: { id, mongo_id },
  },
  navigation,
}) => {
  const screenMode = useReactiveVar(screenModeVar);
  const readScheduleVariables = useReactiveVar(readScheduleVariablesVar);

  const [comment, setComment] = useState('');
  const [createComment] = useCreateCommentMutation();

  const [readComment, { data, error, loading }] = useReadCommentLazyQuery();

  useEffect(() => {
    readComment({ variables: { mongo_id } });
  }, [mongo_id]);

  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      changeDrawerEnable(false);
      scrollRef.current?.scrollToEnd({ animated: false });
      return () => {
        changeDrawerEnable(true);
      };
    }, [])
  );

  const readMonthScheduleOptions = {
    query: ReadMonthScheduleDocument,
    variables: { scheduleRequest: readScheduleVariables },
  };

  const onCommentSubmit = () => {
    createComment({
      variables: { mongo_id, description: comment },
      update: (store, { data }) => {
        if (data && data.createComment.comment) {
          // 카운트 업데이트해주기
          const readMonthScheduleCache = store.readQuery<ReadMonthScheduleQuery>(readMonthScheduleOptions);

          if (readMonthScheduleCache?.readMonthSchedule) {
            store.writeQuery<ReadMonthScheduleQuery>({
              ...readMonthScheduleOptions,
              data: produce(readMonthScheduleCache, (a) => {
                if (a['readMonthSchedule']['Schedules']) {
                  let temp = [...a['readMonthSchedule']['Schedules']];

                  const updatedArray = produce(temp, (draft) => {
                    const index = draft.findIndex((m) => m.id === id);
                    if (index !== -1) draft[index] = { ...draft[index], comment_count: draft[index].comment_count + 1 };
                  });

                  a['readMonthSchedule']['Schedules'] = updatedArray;
                }
              }),
            });
          }

          // 댓글목록에 추가해주기
          const readCommentCache = store.readQuery<ReadCommentQuery>({
            query: ReadCommentDocument,
            variables: { mongo_id },
          });

          // 내 정보 캐시 불러오기
          const getUserDataAndFollowCache = store.readQuery<GetUserDataAndFollowQuery>({
            query: GetUserDataAndFollowDocument,
          });

          if (getUserDataAndFollowCache && getUserDataAndFollowCache.getUserDataAndFollow.member) {
            const { id, username, profile_img, followers } = getUserDataAndFollowCache.getUserDataAndFollow.member;

            if (readCommentCache?.readComment) {
              store.writeQuery<ReadCommentQuery>({
                query: ReadCommentDocument,
                variables: { mongo_id },
                data: produce(readCommentCache, (a) => {
                  if (a && a['readComment']['comments']) {
                    let temp = [...a['readComment']['comments']];
                    const createdSchedule = data.createComment.comment!;

                    temp.push({
                      ...createdSchedule,
                      __typename: 'CommentRes',
                      member: { __typename: 'Member', id, username, profile_img, follower_count: followers.length },
                    });

                    a['readComment']['comments'] = temp;
                  }
                }),
              });
            }
          }

          Keyboard.dismiss();
          setComment('');
        }
      },
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <Container screenMode={screenMode}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Header screenMode={screenMode}>
            <BackBtn
              onPress={() => {
                navigation.goBack();
              }}
            >
              <MaterialIcons name="arrow-back-ios" size={20} color={screenMode === 'dark' ? COLORS.white : '#5f5f5f'} />
            </BackBtn>

            <HeaderText screenMode={screenMode}>댓글</HeaderText>
            <View style={{ width: 40 }} />
          </Header>
        </TouchableWithoutFeedback>

        <ScrollView
          ref={scrollRef}
          style={{ marginBottom: 34 + 12 + 12 + 2 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {data &&
            data.readComment.comments &&
            data.readComment.comments.map(
              ({
                _id,
                schedule_mongo_id,
                writer_id,
                description,
                created_at,
                member: { id, username, profile_img, follower_count },
              }) => {
                const commentItemProps = {
                  _id,
                  schedule_mongo_id,
                  writer_id,
                  description,
                  created_at,
                  member: { id, username, profile_img, follower_count },
                };

                return <CommentItem key={_id} {...commentItemProps} />;
              }
            )}
        </ScrollView>

        <Bottom>
          <BottomCommentView screenMode={screenMode}>
            <CommentInput
              placeholder="댓글 달기..."
              onChangeText={(search) => setComment(search)}
              value={comment}
              screenMode={screenMode}
              placeholderTextColor="#A5A5A5"
            />

            <SubmitBtn disabled={comment === ''} onPress={onCommentSubmit}>
              <AntDesign name="enter" size={20} color={COLORS.alertBlue} />
            </SubmitBtn>
          </BottomCommentView>
        </Bottom>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default CommentScreen;

const Header = styled(HeaderView)``;

const BackBtn = styled.TouchableOpacity`
  width: 40px;
  padding-vertical: 10px;
`;

const HeaderText = styled(TextMode)`
  ${STYLED_FONTS.body2}
  color: ${({ screenMode }) => darkModeToWhite(screenMode)};
`;

const Bottom = styled.View<ScreenMode>`
  position: absolute;
  bottom: 0;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top-width: 1px;
  border-color: ${({ screenMode }) => (screenMode === 'dark' ? '#303030' : '#e4e4e4')};
  width: 100%;
  padding-horizontal: 16px;
`;

const BottomCommentView = styled.View<ScreenMode>`
  flex-direction: row;
  height: 34px;
  width: 100%;

  margin-vertical: 12px;
  padding-horizontal: 12px;

  background-color: ${({ screenMode }) => (screenMode === 'dark' ? '#3D3C3F' : COLORS.white)};

  border-radius: 5px;
  border-width: 1px;
  border-color: ${({ screenMode }) => (screenMode === 'dark' ? '#303030' : '#e4e4e4')};
`;

const CommentInput = styled.TextInput<ScreenMode>`
  width: ${SIZES.windowWidth - 32 - 32 - 14}px;

  font-size: 13px;
  font-weight: 500;
  color: ${({ screenMode }) => darkModeToWhite(screenMode)};
`;

const SubmitBtn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 5px;
`;
