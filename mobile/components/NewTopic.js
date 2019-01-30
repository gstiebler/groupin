import React from 'react';
import { SafeAreaView } from 'react-native';
import { StyleSheet } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements'

const styles = StyleSheet.create({
  basic: {
    margin: 20,
  },
});

const RegisterComponent = ({ 
    navigation,
    name, 
    changeName, 
    onCreate,
    willFocus,
  }) => {
  navigation.addListener('willFocus', willFocus);

  return (
    <SafeAreaView>
      <FormLabel>Nome do tópico</FormLabel>
      <FormInput 
        value={name} 
        onChangeText={changeName} 
      />
      <Button title="Criar tópico" onPress={() => onCreate(navigation)} />
    </SafeAreaView>
  );
}

export default RegisterComponent;
