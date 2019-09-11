import { connect } from "react-redux";
import LoginComponent from '../components/Login';
import { login, willFocus } from '../actions/loginActions';

const mapStateToProps = state => {
  return { 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (navigation, phoneNumber) => dispatch(login(navigation, phoneNumber)),
    willFocus: (navigation) => dispatch(willFocus(navigation)),
  };
};


const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
export default LoginContainer;
