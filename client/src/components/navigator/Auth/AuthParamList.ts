import { Dispatch, SetStateAction } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type AuthNavProps<T extends keyof AuthParamList> = {
  navigation: StackNavigationProp<AuthParamList, T>;
  route: RouteProp<AuthParamList, T>;
};

export type AuthParamList = {
  Login: { setAccessToken: Dispatch<SetStateAction<string | null>> };
  Register: undefined;
};
