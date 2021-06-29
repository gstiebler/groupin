import SettingsComponent, { SettingsScreenNavigationProp } from '../components/Settings';
import { loginStore } from '../stores/storesFactory';

type ContainerProp = { navigation: SettingsScreenNavigationProp };
const SettingsContainer = ({ navigation }: ContainerProp) => SettingsComponent({
  onLogout: () => loginStore.logout(navigation)
});
export default SettingsContainer;
