import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Container, Content, Button, Text, Input, Form, Item } from 'native-base';
import styles from '../Style';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Navigator';

export type ConfirmationCodeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ConfirmationCode'>;
export type ConfirmationCodeProps = {
  navigation: ConfirmationCodeScreenNavigationProp;
  onChangeNumber: (navigation: ConfirmationCodeScreenNavigationProp) => void;
  onConfirm: (navigation: ConfirmationCodeScreenNavigationProp, confirmationCode: string) => void;
};

const ConfirmationCode = ({ navigation, onChangeNumber, onConfirm }: ConfirmationCodeProps) => {
  const [confirmationCode, changeConfirmationCode] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <Container>
        <Content padder contentContainerStyle={styles.registerContainer}>
          <Text style={ styles.title1 }>Insira o código de confirmação</Text>

          <Form style={{ marginTop: 20, marginBottom: 20 }}>

            <Item style={{ marginTop: 20, marginBottom: 20 }} >
              <Input 
                placeholder="Confirmação"
                onChangeText={changeConfirmationCode} 
                style={{paddingBottom: 20}}
              />
            </Item>
          </Form>
          <Button block success onPress={() => onConfirm(navigation, confirmationCode)} >
            <Text>Confirmar</Text>
          </Button>
          <Button block success 
              style={{ marginTop: 20, marginBottom: 20 }}
              onPress={() => onChangeNumber(navigation)} >
            <Text>Editar número</Text>
          </Button>
        </Content>
      </Container>
    </SafeAreaView>
  );
}

export default ConfirmationCode;
