import React, { useState } from 'react';
import { 
  SafeAreaView, 
  TextInput,
} from 'react-native';
import { 
  Container, 
  Button, 
  Text,
  Content,
  Form,
  Item,
  Input,
} from 'native-base';
import CodeInput from 'react-native-confirmation-code-field';
import styles from '../Style';

const RegisterComponent = ({ 
  navigation,
  onRegister,
  onBack,
}) => {

  const [name, changeName] = useState(0);
  const [verificationCode, changeVerificationCode] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <Container>
        <Content contentContainerStyle={styles.container}>
          <Text style={ styles.title1 }>Registro</Text>
          <Form>
            <Item>
              <Input 
                placeholder="Nome"
                onChangeText={changeName} 
                style={{paddingBottom: 20}}
              />
            </Item>
          </Form>
          <CodeInput onFulfill={changeVerificationCode} />
          <Button primary full onPress={() => onRegister(navigation, name, verificationCode)}>
            <Text> Registrar </Text>
          </Button>
          <Button primary full onPress={() => onBack(navigation)}>
            <Text> Editar número de telefone </Text>
          </Button>
        </Content>
      </Container>
    </SafeAreaView>
  );
}

export default RegisterComponent;
