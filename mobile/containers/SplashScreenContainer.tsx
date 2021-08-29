import React, { useEffect } from 'react';
import SplashScreenComponent from '../components/SplashScreen';
import { Navigation } from '../rn_lib/Navigator.types';
import appInit from '../appInit';
import { loginStore } from '../rn_lib/storesFactory';

const SplashScreenContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => {
  const willFocus = async () => {
    await appInit(navigation);
    if (await loginStore.isUserLoggedIn()) {
      navigation.navigate('TabNavigator');
    } else {
      navigation.navigate('Login');
    }
  };
  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);

  return <SplashScreenComponent />;
}
export default SplashScreenContainer;
