import ConfirmationCodeComponent from '../components/ConfirmationCode';
import { Navigation } from '../components/Navigator.types';
import { loginStore } from '../stores/storesFactory';

const ConfirmationCodeContainer = ({ navigation }: { navigation: Navigation }) => ConfirmationCodeComponent({
  onChangeNumber: () => navigation.navigate('Login'),
  onConfirm: (confirmationCode) => loginStore.confirmationCodeReceived({ navigation, confirmationCode})
});
export default ConfirmationCodeContainer;
