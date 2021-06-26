import LoginComponent from '../components/Login';
import { loginStore } from '../stores/storesFactory';

const onLogin = (navigation, phoneNumber) => loginStore.login(navigation, phoneNumber);

const LoginContainer = ({ navigation }) => LoginComponent({ navigation, onLogin });
export default LoginContainer;
