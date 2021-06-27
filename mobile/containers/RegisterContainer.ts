import RegisterComponent, { Props } from '../components/Register';
import { loginStore } from '../stores/storesFactory';

const onRegister: Props['onRegister'] = (navigation, name) => loginStore.register({navigation, name});
const onBack: Props['onBack'] = (navigation) => navigation.navigate('Login');

const Register = ({ navigation }) => RegisterComponent({ navigation, onRegister, onBack });
export default Register;
