import React, { useState } from 'react';
import { 
  SafeAreaView, 
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
import styles from '../Style';

const RegisterComponent = ({ 
  navigation,
  onRegister,
  onBack,
}) => {

  const [name, changeName] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <Container>
        <Content padder contentContainerStyle={styles.registerContainer}>
          <Text style={ styles.title1 }>Registro</Text>
          <Form style={{ marginTop: 20, marginBottom: 20 }}>
            <Item>
              <Input 
                placeholder="Nome"
                onChangeText={changeName} 
                style={{paddingBottom: 20}}
              />
            </Item>
          </Form>
          <Button primary full 
              onPress={() => onRegister({navigation, name})}
              style={{ marginBottom: 20}} >
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
