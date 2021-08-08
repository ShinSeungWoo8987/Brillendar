import { RouteProp } from '@react-navigation/native';

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { DrawerParamList } from '../Drawer/DrawerParamList';
import { Maybe } from '../../../generated/graphql';

export type MainNavProps<T extends keyof MainParamList> = {
  navigation: BottomTabNavigationProp<MainParamList, T>;
  route: RouteProp<MainParamList, T>;
};

export type MainParamList = DrawerParamList & {
  Feed: undefined;
  Follow: undefined;

  AddSchedule: undefined;
  AddScheduleResult: undefined;
  Search: undefined;
  Schedule: ClientMember;
  Comment: { id: string; mongo_id: string };
  Like: { id: string };

  LeaveMember: undefined;
};
