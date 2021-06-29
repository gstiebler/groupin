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
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Navigator';

const styles = StyleSheet.create({
  button: {
    margin: 20,
  },
});

export type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export type SettingsProps = {
  onLogout: () => void;
};

const SettingsComponent: React.FC<SettingsProps> = ({ onLogout }) => {
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
      <Button onPress={onLogout} style={styles.button} >
        <Text>Sair</Text>
      </Button>
    </Container>
  );
}

export default SettingsComponent;
