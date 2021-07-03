import { StackNavigationProp } from '@react-navigation/stack';
import LoginComponent from '../components/Login';
import { RootStackParamList } from '../components/Navigator';
import { loginStore } from '../stores/storesFactory';

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type ContainerProp = { navigation: LoginScreenNavigationProp };
const LoginContainer = ({ navigation }: ContainerProp) => LoginComponent({
  onLogin: (phoneNumber) => loginStore.login(navigation, phoneNumber)
});
export default LoginContainer;
