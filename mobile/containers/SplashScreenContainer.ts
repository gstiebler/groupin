import React, { useEffect } from 'react';
import SplashScreenComponent from '../components/SplashScreen';
import { Navigation } from '../components/Navigator.types';
import appInit from '../appInit';

const SplashScreenContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => {
  const willFocus = () => appInit(navigation);
  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);

  return SplashScreenComponent();
}
export default SplashScreenContainer;
