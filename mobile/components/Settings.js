import React from 'react';
import { StyleSheet } from 'react-native';
import { 
  Container, 
  Header,
  Body, 
  Right, 
  Title, 
  Text,
  Button,
} from 'native-base';

const styles = StyleSheet.create({
  button: {
    margin: 20,
  },
});


const SettingsComponent = ({ 
  navigation,
  logout,
}) => {  
  // navigation.addListener('willFocus', willFocus);

  const header = (
    <Header>
      <Body>
        <Title>Configurações</Title>
      </Body>
      <Right />
    </Header>
  );

  return (
    <Container>
      { header }
      <Button onPress={() => logout(navigation)} style={styles.button} >
        <Text>Sair</Text>
      </Button>
    </Container>
  );
}

export default SettingsComponent;
