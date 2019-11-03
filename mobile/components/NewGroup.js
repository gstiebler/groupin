import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Container, Content, Form, Item, Input, Button, Text, Picker } from 'native-base';

const styles = StyleSheet.create({
  basic: {
    padding: 20,
  },
});

const NewGroupComponent = ({ navigation, onCreate }) => {

  const [name, setName] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');

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
              style={{height: 50, width: 100}}
              onValueChange={setVisibility}>
              <Picker.Item label="Público" value="PUBLIC" />
              <Picker.Item label="Secreto" value="SECRET" />
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
