import React from 'react';
import LoginComponent from '../components/Login';
import { Navigation } from '../components/Navigator.types';
import { loginStore } from '../stores/storesFactory';

const LoginContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => LoginComponent({
  onLogin: (phoneNumber) => { return; } //loginStore.login(navigation, phoneNumber)
});
export default LoginContainer;
