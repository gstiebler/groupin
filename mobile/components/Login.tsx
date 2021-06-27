import React, { useState } from 'react';
import { SafeAreaView, TextInput } from 'react-native';
import { 
  Container, 
  Button, 
  Text,
  Content,
} from 'native-base';
import PhoneInput from 'react-native-phone-input'
import styles from '../Style';
import { RootStackParamList } from './Navigator';
import { StackNavigationProp } from '@react-navigation/stack';

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export type LoginProps = {
  navigation: LoginScreenNavigationProp;
  onLogin: (navigation: LoginScreenNavigationProp, phoneNumber: string) => void;
};
const LoginComponent = ({ 
  navigation,
  onLogin,
}: LoginProps) => {
  const [phoneNumber, changePhoneNumber] = useState('');
  const [phoneRef, changePhoneRef] = useState<PhoneInput>(null);

  const login = () => {
    onLogin(navigation, phoneNumber);
  }
  
  return (
    <SafeAreaView style={{ flex: 1 }} >
      <Container>
        <Content contentContainerStyle={styles.container}>
          <Text style={ styles.title1 }>Login</Text>
          <PhoneInput 
            ref={(ref) => changePhoneRef(ref)}
            initialCountry='br'
            onChangePhoneNumber={changePhoneNumber}
            style={{paddingTop: 30, paddingBottom: 30}}
            cancelText='Cancelar'
            confirmText='Confirmar'
          />
          <Button primary full onPress={login}>
            <Text> Enviar </Text>
          </Button>
        </Content>
      </Container>
    </SafeAreaView>
  );
}

export default LoginComponent;
