import React from 'react';
import { 
  Container, 
  Header,
  Body, 
  Right, 
  Title, 
  Text,
  Button,
} from 'native-base';

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
      <Button onPress={() => logout(navigation)}>
        <Text>Sair</Text>
      </Button>
    </Container>
  );
}

export default SettingsComponent;
