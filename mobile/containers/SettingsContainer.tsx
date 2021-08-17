import SettingsComponent from '../components/Settings';
import { loginStore } from '../rn_lib/storesFactory';

const SettingsContainer: React.FC<void> = () => SettingsComponent({
  onLogout: () => loginStore.logout()
});
export default SettingsContainer;
