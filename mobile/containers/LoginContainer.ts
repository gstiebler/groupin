import LoginComponent, { LoginProps, LoginScreenNavigationProp } from '../components/Login';
import { loginStore } from '../stores/storesFactory';

const onLogin: LoginProps['onLogin'] = (navigation, phoneNumber) => loginStore.login(navigation, phoneNumber);

type ContainerProp = { navigation: LoginScreenNavigationProp };
const LoginContainer = ({ navigation }: ContainerProp) => LoginComponent({ navigation, onLogin });
export default LoginContainer;
