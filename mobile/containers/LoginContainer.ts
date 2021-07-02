import LoginComponent, { LoginScreenNavigationProp } from '../components/Login';
import { loginStore } from '../stores/storesFactory';

type ContainerProp = { navigation: LoginScreenNavigationProp };
const LoginContainer = ({ navigation }: ContainerProp) => LoginComponent({
  onLogin: (phoneNumber) => loginStore.login(navigation, phoneNumber)
});
export default LoginContainer;
