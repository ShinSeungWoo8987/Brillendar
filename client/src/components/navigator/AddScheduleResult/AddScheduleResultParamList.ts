import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainParamList } from '../Main/MainParamList';

export type AddScheduleResultNavProps<T extends keyof AddScheduleResultParamList> = {
  navigation: StackNavigationProp<AddScheduleResultParamList, T>;
  route: RouteProp<AddScheduleResultParamList, T>;
};

export type AddScheduleResultParamList = MainParamList & {
  ScheduleResult: undefined;
  Camera: { pushNewImage: (image: string) => void };
};
