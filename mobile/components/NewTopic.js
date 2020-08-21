import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Form, Item, Input, Button, Text } from 'native-base';

const styles = StyleSheet.create({
  basic: {
    padding: 20,
  },
});

const NewTopicComponent = ({ 
  navigation,
  route,
  onCreate,
}) => {
  const [name, setName] = useState('');

  return (
    <Container style={styles.basic} >
      <Content>
        <Form>
          <Item>
            <Input 
              placeholder="Nome do novo tópico" 
              value={name} 
              onChangeText={setName} 
              style={{paddingBottom: 20}}
            />
          </Item>
        </Form>
        <Button block success onPress={() => onCreate(navigation, route, name)} >
          <Text>Criar tópico</Text>
        </Button>
      </Content>
    </Container>
  );
}

export default NewTopicComponent;
