import React from 'react';
import { Navigation } from '../rn_lib/Navigator.types';
import RegisterComponent, { RegisterProps } from '../components/Register';
import { loginStore } from '../rn_lib/storesFactory';

const RegisterContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => {
  const props: RegisterProps = {
    onRegister: (name) => loginStore.register(name),
    onBack: () => navigation.navigate('Login'),
  };
  return <RegisterComponent {...props} />;
};
export default RegisterContainer;
