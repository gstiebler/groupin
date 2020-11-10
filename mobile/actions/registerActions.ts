import * as server from '../lib/server';
import { userLoggedIn } from './loginActions';
import { Alert } from 'react-native';

export const register = ({navigation, name}) => async (dispatch, getState) => {
  const { phoneNumber } = getState().login;
  try {
    const { errorMessage, id } = await server.register({
      name, 
      phoneNumber,
    });
    if (errorMessage) {
      Alert.alert(
        'Erro',
        errorMessage,
        [
          {text: 'OK'},
        ],
        {cancelable: false},
      );
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    await userLoggedIn({ 
      dispatch, 
      navigate: (route) => navigation.navigate(route), 
      userId: id,
    });
  } catch (error) {
    console.error(error);
  }
}