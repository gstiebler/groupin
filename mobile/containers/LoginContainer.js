import { connect } from "react-redux";
import LoginComponent from '../components/Login';
import { login } from '../actions/loginActions';

const mapStateToProps = state => {
  return { 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (navigation, phoneNumber) => dispatch(login(navigation, phoneNumber)),
  };
};


const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
export default LoginContainer;
