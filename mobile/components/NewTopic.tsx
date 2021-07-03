import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Form, Item, Input, Button, Text } from 'native-base';

const styles = StyleSheet.create({
  basic: {
    padding: 20,
  },
});

export type NewTopicProps = {
  onCreate: (name: string) => void;
};

const NewTopicComponent: React.FC<NewTopicProps> = ({ onCreate }) => {
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
        <Button block success onPress={() => onCreate(name)} >
          <Text>Criar tópico</Text>
        </Button>
      </Content>
    </Container>
  );
}

export default NewTopicComponent;
