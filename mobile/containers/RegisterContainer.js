import { connect } from "react-redux";
import RegisterComponent from '../components/Register';
import { 
  REGISTER_NAME,
  REGISTER_USERNAME,
  REGISTER_PASSWORD,
} from "../constants/action-types";
import { register } from '../actions/registerActions';

const mapStateToProps = state => {
  return { 
    name: state.register.name,
    username: state.register.username,
    password: state.register.password,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeName: name => dispatch({ type: REGISTER_NAME, payload: { name } }),
    changeUsername: username => dispatch({ type: REGISTER_USERNAME, payload: { username } }),
    changePassword: password => dispatch({ type: REGISTER_PASSWORD, payload: { password } }),
    onRegister: () => dispatch(register()),
    onShowLogin: () => redirect(),
  };
};


const Register = connect(mapStateToProps, mapDispatchToProps)(RegisterComponent);
export default Register;
