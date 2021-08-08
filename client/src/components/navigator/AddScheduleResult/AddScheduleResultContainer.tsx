import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { MainNavProps } from '../Main/MainParamList';
import { AddScheduleResultParamList } from './AddScheduleResultParamList';

import AddScheduleResultScreen from '../../screens/main/AddScheduleResultScreen/AddScheduleResultScreen';
import CameraScreen from '../../screens/main/AddScheduleResultScreen/CameraScreen';

interface AddScheduleResultContainerProps extends MainNavProps<'AddScheduleResult'> {}

const Result = createStackNavigator<AddScheduleResultParamList>();

const AddScheduleResultContainer: React.FC<AddScheduleResultContainerProps> = () => {
  return (
    <Result.Navigator initialRouteName="ScheduleResult">
      <Result.Screen name="ScheduleResult" component={AddScheduleResultScreen} options={{ headerShown: false }} />
      <Result.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }} />
    </Result.Navigator>
  );
};

export default AddScheduleResultContainer;
