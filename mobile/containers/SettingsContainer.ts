import { Navigation } from '../components/Navigator.types';
import SettingsComponent from '../components/Settings';
import { loginStore } from '../stores/storesFactory';

const SettingsContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => SettingsComponent({
  onLogout: () => loginStore.logout(navigation)
});
export default SettingsContainer;
