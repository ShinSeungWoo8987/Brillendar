import React from 'react';

import { BottomTabBarProps, BottomTabBarOptions } from '@react-navigation/bottom-tabs';
import styled from 'styled-components/native';
import { CenterView, Container, darkModeToBlack, darkModeToWhite, shadow } from '../../../styles/styled';

import { LinearGradient } from 'expo-linear-gradient';
import { useReactiveVar } from '@apollo/client';

import { tabBarDisplayVar, screenModeVar, scheduleModalVar } from '../../../stores';
import { useGetUserDataAndFollowQuery } from '../../../generated/graphql';

import { MaterialCommunityIcons, Ionicons, Octicons } from '../../../styles/vectorIcons';
import appTheme, { windowWidth } from '../../../styles/constants';
import { Platform } from 'react-native';
const { COLORS, FONTS, SIZES, STYLED_FONTS } = appTheme;

interface TabBarScreenProps extends BottomTabBarProps<BottomTabBarOptions> {}

const TabBarScreen: React.FC<TabBarScreenProps> = ({ state, descriptors, navigation }) => {
  const { data } = useGetUserDataAndFollowQuery();

  const id = data?.getUserDataAndFollow.member?.id;
  const username = data?.getUserDataAndFollow.member?.username;
  const profile_img = data?.getUserDataAndFollow.member?.profile_img;

  const screenMode = useReactiveVar(screenModeVar);
  const scheduleModal = useReactiveVar(scheduleModalVar);
  const tabBarDisplay = useReactiveVar(tabBarDisplayVar);

  const color = darkModeToWhite(screenMode);

  if (
    !tabBarDisplay ||
    scheduleModal.open ||
    state.index === 2 ||
    state.index === 5 ||
    state.index === 6 ||
    state.index === 7
  )
    return <></>;

  return (
    <Wrapper screenMode={screenMode}>
      {state.routes.map((route, idx) => {
        const isFocused = state.index === idx;
        const { options } = descriptors[route.key];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          // 다른 화면에서 스케줄 화면으로 이동할때 전달해주는 경우
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.name === 'Schedule' ? { id, username, profile_img } : {});
          }
          // 스케줄 스크린에서 다른사람 스케줄 보다가 내껄로 이동하는 경우
          if (route.name === 'Schedule' && isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, { id, username, profile_img });
          }
        };

        // Comment, Like 탭은 피드와 캘린더에서 둘 다 쓰이기 때문에 탭 네비게이션에 넣지만, 하단에 보일 필요는 없다.
        if (route.name === 'Comment') return null;
        if (route.name === 'Like') return null;
        if (route.name === 'LeaveMember') return null;

        // 결과추가 페이지도 보여줄 필요 없음.
        if (route.name === 'AddScheduleResult') return null;

        return (
          <Touch key={idx} onPress={onPress} testID={options.tabBarTestID} accessibilityRole="button">
            {idx === 0 && (
              <BottomNavBtn key={idx}>
                {isFocused ? (
                  <MaterialCommunityIcons name="home" size={24} color={color} />
                ) : (
                  <MaterialCommunityIcons name="home-outline" size={24} color="#A7A7A7" />
                )}
              </BottomNavBtn>
            )}

            {idx === 1 && (
              <BottomNavBtn key={idx}>
                {isFocused ? (
                  <Ionicons name="ios-people-sharp" size={24} color={color} />
                ) : (
                  <Ionicons name="ios-people-outline" size={24} color="#A7A7A7" />
                )}
              </BottomNavBtn>
            )}

            {idx === 2 && (
              <Shadow key={idx} style={shadow}>
                <MiddleIcon start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#F0D6C1', '#E9A7A2']}>
                  <Octicons name="plus" size={24} color={COLORS.black} />
                </MiddleIcon>
              </Shadow>
            )}

            {idx === 3 && (
              <BottomNavBtn key={idx}>
                {isFocused ? (
                  <Ionicons name="search" size={24} color={color} />
                ) : (
                  <Ionicons name="search-outline" size={24} color="#A7A7A7" />
                )}
              </BottomNavBtn>
            )}

            {idx === 4 && (
              <BottomNavBtn key={idx}>
                {isFocused ? (
                  <MaterialCommunityIcons name="calendar-month" size={24} color={color} />
                ) : (
                  <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#A7A7A7" />
                )}
              </BottomNavBtn>
            )}
          </Touch>
        );
      })}
    </Wrapper>
  );
};

export default TabBarScreen;

const Wrapper = styled.View<ScreenMode>`
  height: 48px;
  background-color: ${({ screenMode }) => darkModeToBlack(screenMode)};
  /* background-color: ${({ screenMode }) => darkModeToBlack(screenMode)}; */
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  border-color: ${({ screenMode }) => (screenMode === 'dark' ? '#303030' : '#e4e4e4')};
  border-top-width: 1px;
`;

const Touch = styled.TouchableOpacity`
  padding: 8px;
`;

const Shadow = styled(CenterView)`
  ${Platform.OS !== 'ios'
    ? `
  bottom: 0px;
  width: 40px;
  height: 40px;
`
    : `
  bottom: 18px;
  width: 60px;
  height: 60px;
`};

  border-radius: 30px;

  justify-content: center;
  align-items: center;
`;

const MiddleIcon = styled(LinearGradient)`
  width: 100%;
  height: 100%;
  border-radius: 30px;

  justify-content: center;
  align-items: center;
`;

const BottomNavBtn = styled.View``;
