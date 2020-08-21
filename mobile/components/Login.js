import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { 
  Container, 
  Button, 
  Text,
  Content,
} from 'native-base';
import PhoneInput from 'react-native-phone-input'
import styles from '../Style';

const LoginComponent = ({ 
  navigation,
  onLogin,
}) => {
  const [phoneNumber, changePhoneNumber] = useState('');
  const [phoneRef, changePhoneRef] = useState(0);

  const login = () => {
    phoneRef.inputPhone.clear();
    onLogin(navigation, phoneNumber);
  }
  
  return (
    <SafeAreaView style={{ flex: 1 }} >
      <Container>
        <Content contentContainerStyle={styles.container}>
          <Text style={ styles.title1 }>Login</Text>
          <PhoneInput 
            ref={changePhoneRef}
            initialCountry='br'
            onChangePhoneNumber={changePhoneNumber}
            autoFormat={true}
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
