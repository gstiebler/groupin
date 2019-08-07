import React from 'react';
import { 
  Container, 
  Header,
  Body, 
  Right, 
  Title, 
} from 'native-base';

const SettingsComponent = ({ 
  navigation,
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
    </Container>
  );
}

export default SettingsComponent;
