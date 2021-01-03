import LoginComponent from '../components/Login';
import LoginStore from '../stores/loginStore';

const mapStateToProps = () => {
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
