import React from 'react';
import { ActivityIndicator } from 'react-native';
import { CenterView } from './src/styles/styled';

interface LoadingScreenProps {}

const LoadingScreen: React.FC<LoadingScreenProps> = () => {
  return (
    <CenterView style={{ flex: 1 }}>
      <ActivityIndicator size="large" />
    </CenterView>
  );
};

export default LoadingScreen;
