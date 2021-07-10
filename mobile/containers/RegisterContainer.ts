import React from 'react';
import { Navigation } from '../components/Navigator.types';
import RegisterComponent from '../components/Register';
import { loginStore } from '../stores/storesFactory';

const RegisterContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => RegisterComponent({ 
  onRegister: (name) => loginStore.register(name),
  onBack: () => navigation.navigate('Login'),
});
export default RegisterContainer;
