import { connect } from "react-redux";
import RegisterComponent from '../components/Register';
import { register } from '../actions/registerActions';

const mapStateToProps = () => {
  return { 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRegister: ({navigation, name}) => dispatch(register({navigation, name})),
    onBack: (navigation) => navigation.navigate('Login'),
  };
};


const Register = connect(mapStateToProps, mapDispatchToProps)(RegisterComponent);
export default Register;
