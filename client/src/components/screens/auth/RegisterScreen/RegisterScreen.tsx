import React, { useEffect, useState } from 'react';
import { TouchableWithoutFeedback, Keyboard, View, Alert, ActivityIndicator, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  RegisterInput,
  useAvailableUsernameLazyQuery,
  useCreateMemberMutation,
  useEmailValidationMutation,
  usePhoneValidationMutation,
  useVerifyEmailMutation,
  useVerifyPhoneMutation,
} from '../../../../generated/graphql';
import { CenterTouchableOpacity, Container } from '../../../../styles/styled';
import { AuthNavProps } from '../../../navigator/Auth/AuthParamList';
import { Btn, BtnText, LoginBtn, LoginText, TextInputBorder, TextInputStyle } from '../LoginScreen/LoginScreen';

import appTheme, { windowHeight, windowWidth } from '../../../../styles/constants';

const { COLORS, FONTS, SIZES, STYLED_FONTS } = appTheme;

interface UserInput extends RegisterInput {
  [index: string]: string;
}

interface RegisterProps extends AuthNavProps<'Register'> {}
const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const pattern = /[^a-z0-9_]/g;

  const [userInput, setUserInput] = useState<UserInput>({
    email: '',
    password: '',
    username: '',
    phone: '',
    code: '',
  });

  const [usernameError, setUsernameError] = useState(false);

  const [passwordConfirm, setPasswordConfirm] = useState('');
  //
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [messageSent, setMessageSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  //

  const [register, { loading }] = useCreateMemberMutation();
  const [sendEmail, sendEmailRes] = useEmailValidationMutation();
  const [sendMessage, sendMessageRes] = usePhoneValidationMutation();
  const [verifyCode, verifyCodeRes] = useVerifyPhoneMutation();
  const [verifyEmail, verifyEmailRes] = useVerifyEmailMutation();
  const [isAvailableUsername, isAvailableUsernameRes] = useAvailableUsernameLazyQuery();

  useEffect(() => {
    const { data, error } = isAvailableUsernameRes;
    if (error) setUsernameError(true);
    else if (data?.availableUsername.ok) setUsernameError(false);
    else if (data?.availableUsername.ok === false) setUsernameError(true);
  }, [isAvailableUsernameRes.data, isAvailableUsernameRes.error]);

  const onRegister = () => {
    if (!emailVerified) {
      Alert.alert('Email', '이메일 인증을 진행해주세요.');
      return false;
    }
    if (!phoneVerified) {
      Alert.alert('Phone', '핸드폰 인증을 진행해주세요.');
      return false;
    }

    let count = 0;
    const userInputKeys = Object.keys(userInput);
    userInputKeys.forEach((key) => {
      if (userInput[key].length === 0) count++;
    });

    if (count !== 0) {
      Alert.alert('Register', '빈칸을 모두 채워주세요.');
      return false;
    }

    if (userInput.password.length < 8) {
      Alert.alert('Password', '비밀번호를 8자리 이상으로 설정해주세요.');
      return false;
    }

    if (pattern.test(userInput.username)) {
      Alert.alert('NickName', '잘못된 시도입니다.');
      return false;
    }

    if (usernameError) {
      Alert.alert('Nickname', '중복된 Nickname입니다.\n 다시 입력해주세요.');
      return false;
    }

    if (userInput.password === passwordConfirm) {
      register({ variables: { register: userInput } })
        .then(({ data }) => {
          if (data?.createMember.ok) {
            navigation.goBack();
            return true;
          }

          const error = data?.createMember.error;
          if (error === { field: 'Verify', message: 'Unconfirmed phone or email.' }) {
            Alert.alert('Register', '핸드폰 또는 이메일 인증이 만료되었습니다.');
            return false;
          }
          // 정상적인 방법으로 진행하면 아래 메세지가 안떠야 정상.
          else if (error === { field: 'Register', message: 'already exist' }) {
            Alert.alert('Register', '회원가입을 다시 진행해주세요.');
            return false;
          } else if (error === { field: 'Server', message: 'Cannot insert Database.' }) {
            Alert.alert('Register', '잠시후에 다시 시도해주세요.');
            return false;
          } else {
            console.log(error);
            Alert.alert('Register', '잘못된 시도입니다.\n회원가입을 다시 진행해주세요.');
            return false;
          }
        })
        .catch((err) => Alert.alert('Server', '잠시후에 다시 시도해주세요.'));
    } else Alert.alert('Password', '비밀번호를 다시 확인해주세요.');
  };

  //////////////////////////
  const onSendMail = () => {
    if (userInput.email) {
      Keyboard.dismiss();
      sendEmail({ variables: { email: userInput.email } })
        .then(({ data }) => {
          if (data!.emailValidation.ok) {
            // 성공
            setEmailSent(true);
            Alert.alert('Email', '이메일을 확인해주세요.');
          } else {
            // 실패
            const errorMessage = data!.emailValidation.error?.message;

            if (errorMessage === 'Cannot send email.') {
              Alert.alert('Email', '이메일을 전송하지 못하였습니다.\n다시 시도해주세요.');
            } else if (errorMessage === 'Invalid email.') {
              Alert.alert('Email', '잘못된 이메일 형식입니다.\n다시 입력해주세요.');
            } else if (errorMessage === 'Email already exist.') {
              Alert.alert('Email', '이미 사용중인 이메일입니다.\n다시 입력해주세요.');
            }
          }
        })
        .catch((err) => Alert.alert('Server', '잠시후에 다시 시도해주세요.'));
    } else Alert.alert('Email', '이메일을 옳바르게 입력해주세요.');
  };

  const onVerifyEmail = () => {
    verifyEmail({ variables: { email: userInput.email } })
      .then(({ data }) => {
        if (data!.verifyEmail.ok) {
          // 성공
          setEmailVerified(true);
        } else {
          // 실패
          const errorMessage = data!.verifyEmail.error?.message;
          if (errorMessage === 'unConfirmed email.')
            Alert.alert('Email', '이메일 인증이 진행되지 않았습니다.\n이메일을 확인해주세요.');
          if (errorMessage === 'Invalid email.') Alert.alert('Email', '잘못된 이메일 형식입니다.\n다시 입력해주세요.');
        }
      })
      .catch((err) => Alert.alert('Server', '잠시후에 다시 시도해주세요.'));
  };
  //////////////////////////

  const onSendMessage = () => {
    if (userInput.phone.length === 11) {
      Keyboard.dismiss();
      sendMessage({ variables: { phone: userInput.phone } })
        .then(({ data }) => {
          if (data!.phoneValidation.ok) {
            // 성공
            setMessageSent(true);
            // 여기서 포커스 변경해주기.
          } else {
            // 실패
            const errorMessage = data!.phoneValidation.error?.message;

            if (errorMessage === 'Too Many Requests.')
              Alert.alert('Phone', '인증요청을 너무 많이 진행하였습니다.\n나중에 다시 시도해주세요.');
            else if (errorMessage === 'Invalid phone number.')
              Alert.alert('Phone', '핸드폰 번호를 옳바르게 입력해주세요.');
            else if (errorMessage === 'Phone already exist.')
              Alert.alert('Email', '이미 사용중인 핸드폰 번호입니다.\n다시 입력해주세요.');
            else Alert.alert('Phone', '다시 시도해주세요.');
          }
        })
        .catch((err) => Alert.alert('Server', '잠시후에 다시 시도해주세요.'));
    } else Alert.alert('Phone', '핸드폰 번호를 옳바르게 입력해주세요.');
  };

  const onVerifyCode = () => {
    if (userInput.phone && userInput.code) {
      Keyboard.dismiss();
      verifyCode({ variables: { phone: userInput.phone, code: userInput.code } })
        .then(({ data }) => {
          if (data!.verifyPhone.ok) {
            // 성공
            setPhoneVerified(true);
          } else {
            // 실패
            const errorMessage = data!.verifyPhone.error?.message;
            if (errorMessage === 'Wrong code.') Alert.alert('Phone', '잘못된 코드입니다.\n메세지를 다시 확인해주세요.');
            if (errorMessage === 'Expired code.')
              Alert.alert('Phone', '만료된 코드입니다.\n회원가입을 다시 진행해주세요.');
            if (errorMessage === 'Server error') Alert.alert('Phone', '잠시후에 다시 시도해주세요.');
            if (errorMessage === 'Invalid verify code.') Alert.alert('Phone', '잘못된 입력입니다.');
          }
        })
        .catch((err) => Alert.alert('Server', '잠시후에 다시 시도해주세요.'));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAwareScrollView style={{ backgroundColor: COLORS.white }}>
        <RegisterContainer windowHeight={windowHeight}>
          <LogoText>Register</LogoText>

          <View>
            <>
              <Row>
                <TextInputBorder
                  checkBox={!emailVerified}
                  label="Email"
                  mode="outlined"
                  value={userInput.email}
                  onChangeText={(email) => setUserInput({ ...userInput, email })}
                  disabled={emailSent}
                  render={(props) => <TextInput {...props} style={TextInputStyle} />}
                />
                {!emailVerified && (
                  <VerifyBtn
                    onPress={emailSent ? onVerifyEmail : onSendMail}
                    disabled={verifyEmailRes.loading || sendEmailRes.loading}
                  >
                    {verifyEmailRes.loading || sendEmailRes.loading ? (
                      <ActivityIndicator size="small" color="gray" />
                    ) : (
                      <VerifyText>{emailSent ? '인증완료' : '인증하기'}</VerifyText>
                    )}
                  </VerifyBtn>
                )}
              </Row>
            </>

            <TextInputBorder
              secureTextEntry={true}
              label="Password"
              mode="outlined"
              value={userInput.password}
              onChangeText={(password) => setUserInput({ ...userInput, password })}
              render={(props) => <TextInput {...props} style={TextInputStyle} />}
            />

            <TextInputBorder
              secureTextEntry={true}
              label="Password Confirm"
              mode="outlined"
              error={passwordConfirm !== '' && userInput.password !== passwordConfirm}
              value={passwordConfirm}
              onChangeText={(passwordConfirm) => setPasswordConfirm(passwordConfirm)}
              render={(props) => <TextInput {...props} style={TextInputStyle} />}
            />

            <TextInputBorder
              error={usernameError}
              label="Nickname"
              mode="outlined"
              value={userInput.username}
              onChangeText={(username) => {
                let filteredUsername = username.toLowerCase();
                filteredUsername = filteredUsername.replace(pattern, '');

                if (filteredUsername.length === 0) setUsernameError(false);
                else if (filteredUsername.length < 6) setUsernameError(true);
                else if (filteredUsername.length >= 6)
                  isAvailableUsername({ variables: { username: filteredUsername } });

                setUserInput({ ...userInput, username: filteredUsername });
              }}
              render={(props) => <TextInput {...props} style={TextInputStyle} />}
            />

            <>
              <Row>
                <TextInputBorder
                  checkBox={!messageSent}
                  label="Phone"
                  mode="outlined"
                  value={userInput.phone}
                  onChangeText={(phone) => setUserInput({ ...userInput, phone })}
                  keyboardType="number-pad"
                  disabled={messageSent}
                  render={(props) => <TextInput {...props} style={TextInputStyle} />}
                />

                {!messageSent && (
                  <VerifyBtn onPress={onSendMessage} disabled={sendMessageRes.loading}>
                    {sendMessageRes.loading ? (
                      <ActivityIndicator size="small" color="gray" />
                    ) : (
                      <VerifyText>인증하기</VerifyText>
                    )}
                  </VerifyBtn>
                )}
              </Row>

              {messageSent && !phoneVerified && (
                <Row>
                  <TextInputBorder
                    checkBox={true}
                    label="Code"
                    mode="outlined"
                    value={userInput.code}
                    onChangeText={(code) => {
                      setUserInput({ ...userInput, code });
                      if (code.length === 6) Keyboard.dismiss();
                    }}
                    keyboardType="number-pad"
                    render={(props) => <TextInput {...props} style={TextInputStyle} />}
                  />

                  <VerifyBtn onPress={onVerifyCode}>
                    <VerifyText>인증완료</VerifyText>
                  </VerifyBtn>
                </Row>
              )}
            </>
          </View>

          <View>
            <RegisterBtn onPress={onRegister} disabled={loading}>
              {loading ? <ActivityIndicator size="small" color="gray" /> : <LoginText>회원가입</LoginText>}
            </RegisterBtn>

            <Btn onPress={() => navigation.goBack()}>
              <BtnText>뒤로가기</BtnText>
            </Btn>
          </View>
        </RegisterContainer>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

const RegisterContainer = styled(Container)<{ windowHeight: number }>`
  height: 667px;
  margin-top: ${({ windowHeight }) => `${(windowHeight - 667) / 3}px`};

  background-color: ${COLORS.white};

  justify-content: space-between;
  align-items: center;
`;

const LogoText = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-top: 28px;

  align-self: center;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const VerifyBtn = styled(CenterTouchableOpacity)`
  margin-top: -2px;
  margin-left: 8px;
  width: 102px;
  height: 54px;

  border-radius: 4px;

  background-color: #8152d5;
`;

const VerifyText = styled.Text`
  color: ${COLORS.white};
  ${STYLED_FONTS.body3}
`;

const RegisterBtn = styled(LoginBtn)`
  margin-top: 14px;
`;
