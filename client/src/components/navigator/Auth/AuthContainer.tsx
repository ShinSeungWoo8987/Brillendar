import React, { Dispatch, SetStateAction } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthParamList } from './AuthParamList';

import LoginScreen from '../../screens/auth/LoginScreen/LoginScreen';
import RegisterScreen from '../../screens/auth/RegisterScreen/RegisterScreen';

interface AuthContainerProps {
  setAccessToken: Dispatch<SetStateAction<string | null>>;
}

const Stack = createStackNavigator<AuthParamList>();

const AuthContainer: React.FC<AuthContainerProps> = ({ setAccessToken }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
          initialParams={{ setAccessToken }}
        />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthContainer;
