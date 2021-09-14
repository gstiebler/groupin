import React, { useState } from 'react';
import { Input, Button, Text, VStack, Radio } from 'native-base';
import { groupVisibility } from '../constants/domainConstants';

export interface NewGroupProps {
  onCreate: (params: { name: string, visibility: string }) => void;
}

const NewGroupComponent: React.FC<NewGroupProps> = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [visibility, setVisibility] = useState(groupVisibility[0].value);

  const visibilities = groupVisibility.map(v => <Radio value={v.value} key={v.value}>{ v.label }</Radio>);

  return (
    <VStack space={4} alignItems="center">
      <Input
        placeholder="Nome do novo grupo"
        value={name}
        onChangeText={setName}
        style={{ paddingBottom: 20 }}
      />
      <Radio.Group
        name="visibilities"
        value={visibility}
        style={{ height: 50, width: 100, paddingTop: 50 }}
        onChange={itemValue => setVisibility(itemValue as string)}>
        {visibilities}
      </Radio.Group>
      <Button onPress={() => onCreate({ name, visibility })} >
        <Text>Criar grupo</Text>
      </Button>
    </VStack>
  );
}

export default NewGroupComponent;
