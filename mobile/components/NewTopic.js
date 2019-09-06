import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Container, Content, Form, Item, Input, Button, Text } from 'native-base';

const styles = StyleSheet.create({
  basic: {
    margin: 20,
  },
});

const NewTopicComponent = ({ 
  navigation,
  onCreate,
}) => {
  const [name, setName] = useState(0);

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
        <Button block success onPress={() => onCreate(navigation, name)} >
          <Text>Criar tópico</Text>
        </Button>
      </Content>
    </Container>
  );
}

export default NewTopicComponent;
