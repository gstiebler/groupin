import { connect } from "react-redux";
import ConfirmationCodeComponent from '../components/ConfirmationCode';
import { 
  confirmationCodeReceived,
} from '../actions/loginActions';

const mapStateToProps = () => {
  return { 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeNumber: (navigation) => navigation.navigate('Login'),
    onConfirm: (navigation, confirmationCode) => dispatch(confirmationCodeReceived({ navigation, confirmationCode })),
  };
};


const ConfirmationCodeContainer = connect(mapStateToProps, mapDispatchToProps)(ConfirmationCodeComponent);
export default ConfirmationCodeContainer;
