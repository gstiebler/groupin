import { connect } from "react-redux";
import RegisterComponent from '../components/Register';
import { 
  REGISTER_NAME,
  REGISTER_VERIFICATION_CODE,
} from "../constants/action-types";
import { register } from '../actions/registerActions';

const mapStateToProps = state => {
  return { 
    name: state.register.name,
    verificationCode: state.register.verificationCode,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeName: name => dispatch({ type: REGISTER_NAME, payload: { name } }),
    changeVerificationCode: verificationCode => dispatch({ type: REGISTER_VERIFICATION_CODE, payload: { verificationCode } }),
    onRegister: (navigation) => dispatch(register(navigation)),
    onBack: (navigation) => navigation.navigate('Login'),
  };
};


const Register = connect(mapStateToProps, mapDispatchToProps)(RegisterComponent);
export default Register;
