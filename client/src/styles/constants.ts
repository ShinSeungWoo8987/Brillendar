import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const paddingHorizontal = 16;
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

const COLORS = {
  // base colors
  primary: '#F96D41',
  secondary: '#25282F',

  // colors
  black: '#1E1B26',
  // white: '#FFFFFF',
  white: '#F4F4F8',
  lightGray: '#64676D',
  lightGray2: '#EFEFF0',
  lightGray3: '#D4D5D6',
  lightGray4: '#7D7E84',
  gray: '#2D3038',
  gray1: '#282C35',
  darkRed: '#31262F',
  lightRed: '#C5505E',
  darkBlue: '#22273B',
  lightBlue: '#424BAF',
  darkGreen: '#213432',
  lightGreen: '#31Ad66',
  alertBlue: '#4394f5',
};

const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  padding2: 36,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,

  // app dimensions
  windowWidth,
  windowHeight,

  // padding side
  paddingHorizontal,
};

const FONTS = {
  //   Chewy-Regular
  // Kalam-Bold
  // Kalam-Regular
  logoFont: {
    fontFamily: 'Chewy-Regular',
    fontSize: SIZES.h1,
  },

  largeTitle: { fontFamily: 'Roboto-Regular', fontSize: SIZES.largeTitle, lineHeight: 50 },
  h1: { fontFamily: 'Roboto-Black', fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: 'Roboto-Bold', fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: 'Roboto-Bold', fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: 'Roboto-Bold', fontSize: SIZES.h4, lineHeight: 22 },
  body1: { fontFamily: 'Roboto-Regular', fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontFamily: 'Roboto-Regular', fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontFamily: 'Roboto-Regular', fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontFamily: 'Roboto-Regular', fontSize: SIZES.body4, lineHeight: 22 },
};

const STYLED_FONTS = {
  logoFont: `
    font-family: ${FONTS.logoFont.fontFamily};
    font-size: ${FONTS.logoFont.fontSize}px;
  `,
  largeTitle: `
    font-family: ${FONTS.largeTitle.fontFamily};
    font-size: ${FONTS.largeTitle.fontSize}px;
    line-height: ${FONTS.largeTitle.lineHeight}px;
  `,
  h1: `
    font-family: ${FONTS.h1.fontFamily};
    font-size: ${FONTS.h1.fontSize}px;
    line-height: ${FONTS.h1.lineHeight}px;
  `,
  h2: `
    font-family: ${FONTS.h2.fontFamily};
    font-size: ${FONTS.h2.fontSize}px;
    line-height: ${FONTS.h2.lineHeight}px;
  `,
  h3: `
    font-family: ${FONTS.h3.fontFamily};
    font-size: ${FONTS.h3.fontSize}px;
    line-height: ${FONTS.h3.lineHeight}px;
  `,
  h4: `
    font-family: ${FONTS.h4.fontFamily};
    font-size: ${FONTS.h4.fontSize}px;
    line-height: ${FONTS.h4.lineHeight}px;
  `,
  body1: `
    font-family: ${FONTS.body1.fontFamily};
    font-size: ${FONTS.body1.fontSize}px;
    line-height: ${FONTS.body1.lineHeight}px;
  `,
  body2: `
    font-family: ${FONTS.body2.fontFamily};
    font-size: ${FONTS.body2.fontSize}px;
    line-height: ${FONTS.body2.lineHeight}px;
  `,
  body3: `
    font-family: ${FONTS.body3.fontFamily};
    font-size: ${FONTS.body3.fontSize}px;
    line-height: ${FONTS.body3.lineHeight}px;
  `,
  body4: `
    font-family: ${FONTS.body4.fontFamily};
    font-size: ${FONTS.body4.fontSize}px;
    line-height: ${FONTS.body4.lineHeight}px;
  `,
};

const appTheme = { COLORS, SIZES, FONTS, STYLED_FONTS };

export default appTheme;
