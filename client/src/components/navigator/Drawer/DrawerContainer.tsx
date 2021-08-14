import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { DrawerParamList } from './DrawerParamList';
import MainContainer from '../Main/MainContainer';

import { useGetUserDataAndFollowQuery } from '../../../generated/graphql';

import DrawerNavScreen from './DrawerNavScreen';
import { drawerEnableVar } from '../../../stores';
import { getSecureStoreValueByKey, setSecureStore } from '../../../functions';

interface DrawerContainerProps {
  setAccessToken: Dispatch<SetStateAction<string | null>>;
}

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerContainer: React.FC<DrawerContainerProps> = ({ setAccessToken }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { loading, data, error } = useGetUserDataAndFollowQuery({ nextFetchPolicy: 'cache-first' });

  useEffect(() => {
    if (error || data?.getUserDataAndFollow.error) setAccessToken(null);

    // Drawer Navigation이 있다는걸 알려주기 위해 어플 처음 사용시 한번만 열어준다.
    getSecureStoreValueByKey('first_login')
      .then((mode) => {
        if (mode === null) {
          setOpenDrawer(true);
          setSecureStore('first_login', 'false');
        } else {
          setOpenDrawer(false);
          setSecureStore('first_login', 'false');
        }
      })
      .catch((err) => {
        setOpenDrawer(false);
        setSecureStore('first_login', 'false');
      });
  }, [data, error]);

  const drawerEnable = useReactiveVar(drawerEnableVar);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{ gestureEnabled: drawerEnable ? true : false }} // 이게 왜이렇게 작동하는거지...
        openByDefault={openDrawer}
        drawerContent={(props) => <DrawerNavScreen {...props} setAccessToken={setAccessToken} />}
      >
        <Drawer.Screen name="MainContainer" component={MainContainer} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerContainer;
