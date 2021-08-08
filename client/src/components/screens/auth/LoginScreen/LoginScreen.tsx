import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import styled from 'styled-components/native';
import { setSecureStore, setupAxiosInterceptors } from '../../../../functions';
import { LoginInput, useLoginMutation } from '../../../../generated/graphql';

import { CenterTouchableOpacity, Container } from '../../../../styles/styled';
import { AuthNavProps } from '../../../navigator/Auth/AuthParamList';

import appTheme, { windowHeight } from '../../../../styles/constants';

const { COLORS, FONTS, SIZES, STYLED_FONTS } = appTheme;

interface LoginProps extends AuthNavProps<'Login'> {}
const Login: React.FC<LoginProps> = ({
  navigation,
  route: {
    params: { setAccessToken },
  },
}) => {
  const [loginInput, setLoginInput] = useState<LoginInput>({ email: '', password: '' });
  const [login, { loading, data, error }] = useLoginMutation();

  const onLogin = () => {
    if (loginInput.email && loginInput.password)
      login({ variables: { login: loginInput } }).then(({ data }) => {
        if (data?.login.accessToken) {
          // 로그인 성공

          // // // web에서 작업할때
          // setAccessToken(data?.login.accessToken!);
          // setupAxiosInterceptors(data?.login.accessToken!);

          // 정식버전
          setSecureStore('access_token', data?.login.accessToken!)
            .then(() => {
              setupAxiosInterceptors(data?.login.accessToken!);
              setAccessToken(data?.login.accessToken!);
            })
            .catch((err) => console.log(err));
        } else {
          // 로그인 실패
          Alert.alert('로그인', '잘못된 이메일 또는 비밀번호입니다.');
          return false;
        }
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <LoginContainer>
        <LogoText>Brillendar</LogoText>

        <UserTextInput
          label="Email"
          mode="outlined"
          value={loginInput.email}
          onChangeText={(email) => setLoginInput({ ...loginInput, email })}
        />
        <UserTextInput
          secureTextEntry
          label="Password"
          mode="outlined"
          value={loginInput.password}
          onChangeText={(password) => setLoginInput({ ...loginInput, password })}
        />

        <LoginBtn onPress={onLogin} disabled={loading}>
          {loading ? <ActivityIndicator size="small" /> : <LoginText>로그인</LoginText>}
        </LoginBtn>

        <Btn onPress={() => navigation.navigate(`Register`)}>
          <BtnText>회원가입</BtnText>
        </Btn>
      </LoginContainer>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const LoginContainer = styled(Container)`
  justify-content: center;
  align-items: center;
  padding-bottom: 40px;
`;

const LogoText = styled.Text`
  font-family: ${FONTS.logoFont.fontFamily};
  font-size: 44px;
  line-height: 50px;

  margin-bottom: 28px;
`;

export const UserTextInput = styled(TextInput)<{ checkBox?: boolean }>`
  width: ${({ checkBox }) => (checkBox ? '240px' : '350px')};
  height: 52px;
  margin-bottom: 8px;
`;

export const Btn = styled(CenterTouchableOpacity)`
  margin-bottom: 8px;
  width: 350px;
  height: 52px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
`;

export const BtnText = styled.Text`
  color: #5712d1;
  ${STYLED_FONTS.body3}
`;

export const LoginBtn = styled(Btn)`
  margin-top: 16px;
  background-color: #5712d1;
`;

export const LoginText = styled(BtnText)`
  color: white;
`;
