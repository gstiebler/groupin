import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Form, Item, Input, Button, Text } from 'native-base';
import {Picker} from '@react-native-community/picker';
import { groupVisibility } from '../constants/domainConstants';

const styles = StyleSheet.create({
  basic: {
    padding: 20,
  },
});

const NewGroupComponent = ({ navigation, onCreate }) => {

  const [name, setName] = useState('');
  const [visibility, setVisibility] = useState(groupVisibility[0].value);

  const visibilities = groupVisibility.map(v => <Picker.Item label={v.label} value={v.value} key={v.value}/>);

  return (
    <Container style={styles.basic} >
      <Content>
        <Form>
          <Item>
            <Input 
              placeholder="Nome do novo grupo" 
              value={name} 
              onChangeText={setName} 
              style={{paddingBottom: 20}}
            />
          </Item>
          <Item>
            <Picker
              selectedValue={visibility}
              style={{height: 50, width: 100, paddingTop: 50}}
              onValueChange={itemValue => setVisibility(itemValue as string)}>
              { visibilities }
            </Picker>
          </Item>
        </Form>
        <Button block success onPress={() => onCreate({ navigation, name, visibility })} >
          <Text>Criar grupo</Text>
        </Button>
      </Content>
    </Container>
  );
}

export default NewGroupComponent;
