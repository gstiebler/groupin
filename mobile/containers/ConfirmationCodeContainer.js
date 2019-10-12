import { connect } from "react-redux";
import ConfirmationCodeComponent from '../components/ConfirmationCode';
import { 
} from '../actions/loginActions';

const mapStateToProps = state => {
  return { 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeNumber: ({ state }) => dispatch(getGroupInfo(state.params.groupId)),
    onConfirm: ({ state }) => dispatch(getGroupInfo(state.params.groupId)),
  };
};


const ConfirmationCodeContainer = connect(mapStateToProps, mapDispatchToProps)(ConfirmationCodeComponent);
export default ConfirmationCodeContainer;
