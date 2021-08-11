import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { CenterView, CenterTouchableOpacity, Container, TextMode } from '../../../../styles/styled';
import { MainNavProps } from '../../../navigator/Main/MainParamList';
import { TextInput } from 'react-native-paper';
import appTheme from '../../../../styles/constants';
import { useLeaveMemberMutation } from '../../../../generated/graphql';
import { deleteSecureStore } from '../../../../functions';
import restartApp from '../../../../functions/restartApp';
import { screenModeVar } from '../../../../stores';
import { useReactiveVar } from '@apollo/client';
const { STYLED_FONTS, COLORS } = appTheme;

interface LeaveMemberScreenProps extends MainNavProps<'LeaveMember'> {}

const LeaveMemberScreen: React.FC<LeaveMemberScreenProps> = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const screenMode = useReactiveVar(screenModeVar);

  const [leaveMember, { loading }] = useLeaveMemberMutation();

  const onLogout = () => deleteSecureStore('access_token').then(() => restartApp());

  const onLeaveMember = () => {
    leaveMember({ variables: { password } }).then(({ data }) => {
      if (data?.leaveMember) onLogout();
      else {
        Alert.alert('회원 탈퇴', '잘못된 비밀번호입니다.');
        return false;
      }
    });
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container screenMode={screenMode}>
        <LeaveConatiner>
          <LogoText screenMode={screenMode}>회원 탈퇴</LogoText>

          <TextInputBorder
            secureTextEntry
            label="Password"
            mode="outlined"
            value={password}
            placeholderTextColor={screenMode === 'dark' ? COLORS.lightGray : COLORS.lightGray4}
            onChangeText={(password) => setPassword(password)}
          />

          <Btn onPress={onLeaveMember} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="gray" />
            ) : (
              <BtnText screenMode={screenMode}>탈퇴하기</BtnText>
            )}
          </Btn>
        </LeaveConatiner>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default LeaveMemberScreen;

const LeaveConatiner = styled(CenterView)`
  justify-content: center;
  align-items: center;
  flex: 1;
  padding-bottom: 40px;
`;

const LogoText = styled(TextMode)`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 28px;
`;

export const TextInputBorder = styled(TextInput)<ScreenMode>`
  width: 350px;
  height: 52px;
  margin-bottom: 8px;
  background-color: ${({ screenMode }) => (screenMode === 'dark' ? COLORS.lightGray3 : COLORS.white)};
`;

export const Btn = styled(CenterTouchableOpacity)`
  margin-bottom: 8px;
  width: 350px;
  height: 52px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
`;

export const BtnText = styled.Text<ScreenMode>`
  color: ${({ screenMode }) => (screenMode === 'dark' ? COLORS.primary : '#5712d1')} ${STYLED_FONTS.body3};
`;
