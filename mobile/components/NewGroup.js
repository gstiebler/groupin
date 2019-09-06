import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Container, Content, Form, Item, Input, Button, Text } from 'native-base';

const styles = StyleSheet.create({
  basic: {
    padding: 20,
  },
});

const NewGroupComponent = ({ navigation, onCreate }) => {

  const [name, setName] = useState(0);

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
        </Form>
        <Button block success onPress={() => onCreate(navigation, name)} >
          <Text>Criar grupo</Text>
        </Button>
      </Content>
    </Container>
  );
}

export default NewGroupComponent;
