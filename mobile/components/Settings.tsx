import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Text,
  Button,
  Center,
  VStack,
  Heading,
} from 'native-base';

const styles = StyleSheet.create({
  button: {
    margin: 20,
  },
});

export type SettingsProps = {
  onLogout: () => void;
};

const SettingsComponent: React.FC<SettingsProps> = ({ onLogout }) => {
  return (
    <Center flex={1} safeArea>
      <VStack space={4} flex={1} w="90%" mt={4}>
        <Heading>Configurações</Heading>
        <Button onPress={onLogout} style={styles.button} >
          <Text>Sair</Text>
        </Button>
      </VStack>
    </Center>
  );
}

export default SettingsComponent;
