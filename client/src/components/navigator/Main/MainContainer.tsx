import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { MainParamList } from './MainParamList';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FeedScreen from '../../screens/main/FeedScreen/FeedScreen';
import FollowScreen from '../../screens/main/FollowScreen/FollowScreen';
import ScheduleScreen from '../../screens/main/ScheduleScreen/ScheduleScreen';
import SearchScreen from '../../screens/main/SearchScreen/SearchScreen';
import TabBarScreen from './TabBarScreen';
import CommentScreen from '../../screens/main/CommentScreen/CommentScreen';
import AddScheduleScreen from '../../screens/main/AddScheduleScreen/AddScheduleScreen';
import AddScheduleResultScreen from '../../screens/main/AddScheduleResultScreen/AddScheduleResultScreen';
import AddScheduleResultContainer from '../AddScheduleResult/AddScheduleResultContainer';
import LikeScreen from '../../screens/main/LikeScreen/LikeScreen';
import LeaveMemberScreen from '../../screens/main/LeaveMemberScreen/LeaveMemberScreen';

interface MainContainerProps {}

const Bottom = createBottomTabNavigator<MainParamList>();

const MainContainer: React.FC<MainContainerProps> = () => {
  return (
    <Bottom.Navigator
      initialRouteName="Feed"
      tabBar={(props) => <TabBarScreen {...props} />}
      screenOptions={
        {
          // animationEnabled: false,
        }
      }
    >
      <Bottom.Screen name="Feed" component={FeedScreen} />
      <Bottom.Screen name="Follow" component={FollowScreen} />
      <Bottom.Screen name="AddSchedule" component={AddScheduleScreen} />

      <Bottom.Screen name="Search" component={SearchScreen} />
      <Bottom.Screen name="Schedule" component={ScheduleScreen} />

      <Bottom.Screen name="Comment" component={CommentScreen} />
      <Bottom.Screen name="Like" component={LikeScreen} />

      <Bottom.Screen name="AddScheduleResult" component={AddScheduleResultContainer} />
      <Bottom.Screen name="LeaveMember" component={LeaveMemberScreen} />
      {/* Schedule 여기 누르면 id값 초기화시켜줘야함. */}
    </Bottom.Navigator>
  );
};

export default MainContainer;
