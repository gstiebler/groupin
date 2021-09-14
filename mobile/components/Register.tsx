import React, { useState } from 'react';
import {
  Button, 
  Text,
  Input,
  VStack,
} from 'native-base';

export type RegisterProps = {
  onRegister: (name: string) => void;
  onBack: () => void;
};

const RegisterComponent = ({
  onRegister,
  onBack,
}: RegisterProps) => {
  const [name, changeName] = useState('');

  return (
    <VStack space={4} alignItems="center">
      <Text>Registro</Text>
      <Input 
        placeholder="Nome"
        onChangeText={changeName} 
        style={{paddingBottom: 20}}
      />
      <Button
          onPress={() => onRegister(name)}
          style={{ marginBottom: 20}} >
        <Text> Registrar </Text>
      </Button>
      <Button onPress={() => onBack()}>
        <Text> Editar número de telefone </Text>
      </Button>
    </VStack>
  );
}

export default RegisterComponent;
