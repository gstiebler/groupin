import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../components/Navigator';
import SettingsComponent from '../components/Settings';
import { loginStore } from '../stores/storesFactory';

export type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type ContainerProp = { navigation: SettingsScreenNavigationProp };
const SettingsContainer = ({ navigation }: ContainerProp) => SettingsComponent({
  onLogout: () => loginStore.logout(navigation)
});
export default SettingsContainer;
