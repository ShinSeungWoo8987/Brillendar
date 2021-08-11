import { Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import styled from 'styled-components/native';
import appTheme, { paddingHorizontal } from './constants';
const { COLORS, FONTS, SIZES, STYLED_FONTS } = appTheme;

export const CenterView = styled.View`
  justify-content: center;
  align-items: center;
`;

export const CenterTouchableOpacity = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

export const darkModeToWhite = (screenMode?: ScreenType) =>
  screenMode && screenMode === 'dark' ? COLORS.white : COLORS.black;
export const darkModeToBlack = (screenMode?: ScreenType) =>
  screenMode && screenMode === 'dark' ? COLORS.black : COLORS.white;

export const Container = styled.View<ScreenMode>`
  flex: 1;
  background-color: ${({ screenMode }) => {
    switch (screenMode) {
      case 'dark':
        return COLORS.black;

      default:
        return COLORS.white;
    }
  }};
  padding-top: ${getStatusBarHeight()}px;
`;

export const TextMode = styled.Text<ScreenMode>`
  flex-direction: row;

  color: ${({ screenMode }) => {
    switch (screenMode) {
      case 'dark':
        return COLORS.white;

      default:
        return COLORS.black;
    }
  }};
`;

export const HeaderView = styled.View<ScreenMode>`
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${paddingHorizontal}px;

  border-bottom-width: 1px;
  border-color: ${({ screenMode }) => (screenMode === 'dark' ? '#303030' : '#e4e4e4')};
`;

export const HeaderSection = styled.View`
  display: flex;
  flex-direction: row;
`;

export const NavItem = styled.TouchableOpacity`
  justify-content: flex-end;
  align-items: flex-end;
  // width: 30px;
  // height: 30px;
`;

export const TagListView = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const TagItem = styled.TouchableOpacity`
  margin-right: 8px;
  margin-top: 4px;
`;

export const Highlight = styled.View<ScreenMode>`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80%;

  background-color: ${({ screenMode }) => (screenMode === 'dark' ? 'rgba(100, 100, 100, 0.4)' : '#D3F6E2')}; // #D2F8FF
`;
export const TagText = styled(TextMode)`
  color: ${({ screenMode }) => (screenMode === 'dark' ? '#99a6ff' : COLORS.black)};

  font-weight: bold;
  z-index: 99;
`;

export const ChangeBtn = styled.TouchableOpacity`
  width: 42px;
  height: 22px;
  border-radius: 4px;
  background-color: ${COLORS.alertBlue};
  align-items: center;
  justify-content: center;
`;

export const ChangeBtnText = styled(TextMode)`
  font-size: 12px;
  color: white;
`;

export const AndroidBlurView = styled.View`
  background-color: ${COLORS.lightGray4};
  /* background-color: rgba(255, 255, 255, 0.4); */
`;

export const shadow = {
  ...Platform.select({
    web: {
      shadowColor: 'black',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.16,
      shadowRadius: 4,
    },
    ios: {
      shadowColor: 'black',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.16,
      shadowRadius: 4,
    },
    android: { elevation: 6 },
  }),
};
