import SettingsComponent from '../components/Settings';
import { loginStore } from '../stores/storesFactory';

const SettingsContainer: React.FC<void> = () => SettingsComponent({
  onLogout: () => loginStore.logout()
});
export default SettingsContainer;
