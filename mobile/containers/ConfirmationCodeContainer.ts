import ConfirmationCodeComponent, { ConfirmationCodeProps, ConfirmationCodeScreenNavigationProp } from '../components/ConfirmationCode';
import { loginStore } from '../stores/storesFactory';

const onChangeNumber: ConfirmationCodeProps['onChangeNumber'] = (navigation) => navigation.navigate('Login');
const onConfirm: ConfirmationCodeProps['onConfirm'] = (navigation, confirmationCode) =>
  loginStore.confirmationCodeReceived({ navigation, confirmationCode});

type ContainerProp = { navigation: ConfirmationCodeScreenNavigationProp };
const ConfirmationCodeContainer = ({ navigation }: ContainerProp) => ConfirmationCodeComponent({ navigation, onChangeNumber, onConfirm });
export default ConfirmationCodeContainer;
