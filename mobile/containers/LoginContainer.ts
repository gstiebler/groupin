import React from 'react';
import LoginComponent from '../components/Login';
import { loginStore } from '../rn_lib/storesFactory';

const LoginContainer: React.FC<void> = () => LoginComponent(loginStore);
export default LoginContainer;
