import { Navigation } from '../components/Navigator';
import SettingsComponent from '../components/Settings';
import { loginStore } from '../stores/storesFactory';

type ContainerProp = { navigation: Navigation };
const SettingsContainer = ({ navigation }: ContainerProp) => SettingsComponent({
  onLogout: () => loginStore.logout(navigation)
});
export default SettingsContainer;
