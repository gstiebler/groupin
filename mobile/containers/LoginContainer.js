import { connect } from "react-redux";
import LoginComponent from '../components/Login';
import { 
  LOGIN_PHONE_NUMBER,
} from "../constants/action-types";
import { login, willFocus } from '../actions/loginActions';

const mapStateToProps = state => {
  return { 
    username: state.login.username,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changePhoneNumber: phoneNumber => dispatch({ type: LOGIN_PHONE_NUMBER, payload: { phoneNumber } }),
    onLogin: (navigation) => dispatch(login(navigation)),
    willFocus: (navigation) => dispatch(willFocus(navigation)),
  };
};


const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
export default LoginContainer;
