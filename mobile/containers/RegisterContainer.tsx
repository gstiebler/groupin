import React from 'react';
import { Navigation, RootStackParamList } from '../rn_lib/Navigator.types';
import RegisterComponent, { RegisterProps } from '../components/Register';
import { loginStore } from '../rn_lib/storesFactory';
import { RouteProp } from '@react-navigation/native';

export type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;
const RegisterContainer: React.FC<{ navigation: Navigation, route: RegisterScreenRouteProp }> = ({ navigation, route }) => {
  const props: RegisterProps = {
    onRegister: (name) => loginStore.register(name, route.params.externalUserToken),
    onBack: () => navigation.navigate('Login'),
  };
  return <RegisterComponent {...props} />;
};
export default RegisterContainer;
