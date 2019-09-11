import { connect } from "react-redux";
import RegisterComponent from '../components/Register';
import { register } from '../actions/registerActions';

const mapStateToProps = state => {
  return { 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRegister: (navigation, name, verificationCode) => dispatch(register(navigation, name, verificationCode)),
    onBack: (navigation) => navigation.navigate('Login'),
  };
};


const Register = connect(mapStateToProps, mapDispatchToProps)(RegisterComponent);
export default Register;
