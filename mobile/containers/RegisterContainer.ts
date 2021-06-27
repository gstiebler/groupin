import RegisterComponent, { RegisterProps, RegisterScreenNavigationProp } from '../components/Register';
import { loginStore } from '../stores/storesFactory';

const onRegister: RegisterProps['onRegister'] = (navigation, name) => loginStore.register({navigation, name});
const onBack: RegisterProps['onBack'] = (navigation) => navigation.navigate('Login');

type ContainerProp = { navigation: RegisterScreenNavigationProp };
const Register = ({ navigation }: ContainerProp) => RegisterComponent({ navigation, onRegister, onBack });
export default Register;
