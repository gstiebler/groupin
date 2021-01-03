import SettingsComponent from '../components/Settings';
import { logout } from '../actions/loginActions';

const mapStateToProps = () => {
  return { 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: navigation => dispatch(logout(navigation)),
  };
};

const SettingsContainer = connect(mapStateToProps, mapDispatchToProps)(SettingsComponent);
export default SettingsContainer;
