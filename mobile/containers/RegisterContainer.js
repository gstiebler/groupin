import RegisterComponent from '../components/Register';
import { loginStore } from '../stores/storesFactory';

const onRegister = ({navigation, name}) => loginStore.register({navigation, name});
const onBack = (navigation) => navigation.navigate('Login');

const Register = ({ navigation }) => RegisterComponent({ navigation, onRegister, onBack });
export default Register;
