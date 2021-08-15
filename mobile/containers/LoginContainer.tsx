import React from 'react';
import LoginComponent from '../components/Login';
import { loginStore } from '../rn_lib/storesFactory';
import { observer } from "mobx-react-lite"

const LoginComponentObserver = observer(LoginComponent);
const LoginContainer: React.FC<void> = () => <LoginComponentObserver loginStore={loginStore}/>;
export default LoginContainer;
