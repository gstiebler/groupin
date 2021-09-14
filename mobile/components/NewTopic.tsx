import React, { useState } from 'react';
import { Input, Button, Text, VStack } from 'native-base';

export type NewTopicProps = {
  onCreate: (name: string) => void;
};

const NewTopicComponent: React.FC<NewTopicProps> = ({ onCreate }) => {
  const [name, setName] = useState('');

  return (
    <VStack space={4} alignItems="center">
      <Input
        placeholder="Nome do novo tópico"
        value={name}
        onChangeText={setName}
        style={{ paddingBottom: 20 }}
      />
      <Button onPress={() => onCreate(name)} >
        <Text>Criar tópico</Text>
      </Button>
    </VStack>
  );
}

export default NewTopicComponent;
