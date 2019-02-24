import { connect } from "react-redux";
import LoginComponent from '../components/Login';
import { 
  LOGIN_USERNAME,
  LOGIN_PASSWORD,
} from "../constants/action-types";
import { login, willFocus } from '../actions/loginActions';

const mapStateToProps = state => {
  return { 
    username: state.login.username,
    password: state.login.password,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeUsername: username => dispatch({ type: LOGIN_USERNAME, payload: { username } }),
    changePassword: password => dispatch({ type: LOGIN_PASSWORD, payload: { password } }),
    onLogin: (navigation) => dispatch(login(navigation)),
    onShowRegister: (navigation) => navigation.navigate('Register'),
    willFocus: (navigation) => dispatch(willFocus(navigation)),
  };
};


const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
export default LoginContainer;
