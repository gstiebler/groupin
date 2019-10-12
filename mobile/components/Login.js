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
  const [phoneNumber, changePhoneNumber] = useState(0);
  
  return (
    <SafeAreaView style={{ flex: 1 }} >
      <Container>
        <Content contentContainerStyle={styles.container}>
          <Text style={ styles.title1 }>Login</Text>
          <PhoneInput 
            initialCountry='br'
            onChangePhoneNumber={changePhoneNumber}
            autoFormat={true}
            style={{paddingTop: 30, paddingBottom: 30}}
            cancelText='Cancelar'
            confirmText='Confirmar'
          />
          <Button primary full onPress={() => onLogin(navigation, phoneNumber)}>
            <Text> Enviar </Text>
          </Button>
        </Content>
      </Container>
    </SafeAreaView>
  );
}

export default LoginComponent;
