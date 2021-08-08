import React from 'react';
import { useFonts, loadAsync } from 'expo-font';
import LoadingScreen from './LoadingScreen';

interface LoadFontProps {}

const LoadFont: React.FC<LoadFontProps> = ({ children }) => {
  const [fontLoaded, error] = useFonts({
    'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'ZenTokyoZoo-Regular': require('./assets/fonts/ZenTokyoZoo-Regular.ttf'),
    'ShadowsIntoLight-Regular': require('./assets/fonts/ShadowsIntoLight-Regular.ttf'),
    'Chewy-Regular': require('./assets/fonts/Chewy-Regular.ttf'),
    'Kalam-Bold': require('./assets/fonts/Kalam-Bold.ttf'),
    'Kalam-Regular': require('./assets/fonts/Kalam-Regular.ttf'),
  });

  if (!fontLoaded) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default LoadFont;
