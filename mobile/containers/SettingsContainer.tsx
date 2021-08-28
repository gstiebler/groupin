import SettingsComponent, { SettingsProps } from '../components/Settings';
import { loginStore } from '../rn_lib/storesFactory';

const SettingsContainer: React.FC<void> = () => {
  const props: SettingsProps = {
    onLogout: () => loginStore.logout()
  };
  return <SettingsComponent {...props} />;
};
export default SettingsContainer;
