import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { DrawerParamList } from './DrawerParamList';
import MainContainer from '../Main/MainContainer';

import { useGetUserDataAndFollowQuery } from '../../../generated/graphql';

import DrawerNavScreen from './DrawerNavScreen';
import { drawerEnableVar } from '../../../stores';

interface DrawerContainerProps {
  setAccessToken: Dispatch<SetStateAction<string | null>>;
}

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerContainer: React.FC<DrawerContainerProps> = ({ setAccessToken }) => {
  const { loading, data, error } = useGetUserDataAndFollowQuery({ nextFetchPolicy: 'cache-first' });

  useEffect(() => {
    if (error || data?.getUserDataAndFollow.error) setAccessToken(null);
  }, [data, error]);

  // data?.getUserDataAndFollow.error;
  // data?.getUserDataAndFollow.member?.followers;
  // data?.getUserDataAndFollow.member?.followings;

  const drawerEnable = useReactiveVar(drawerEnableVar);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{ gestureEnabled: drawerEnable ? true : false }} // 이게 왜이렇게 작동하는거지...
        // openByDefault={true}
        drawerContent={(props) => <DrawerNavScreen {...props} setAccessToken={setAccessToken} />}
      >
        <Drawer.Screen name="MainContainer" component={MainContainer} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerContainer;
