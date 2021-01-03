import LoginComponent from '../components/Login';
import { loginStore } from '../stores/storesFactory';

function onLogin(navigation, phoneNumber) {
  loginStore.login(navigation, phoneNumber);
}

const LoginContainer = LoginComponent({ onLogin });
export default LoginContainer;
