import React from 'react';
import { SafeAreaView } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import styles from '../Style';

const Confirmationcode = ({ onChangeNumber, onConfirm }) => {

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <Container padder contentContainerStyle={styles.container} >
        <Content contentContainerStyle={styles.container}>
          <Text style={ styles.title1 }>Insira o código de confirmação</Text>
          <Button block success onPress={() => onConfirm()} >
            <Text>Confirmar</Text>
          </Button>
        </Content>
      </Container>
    </SafeAreaView>
  );
}

export default Confirmationcode;
