import React from 'react';
import { SafeAreaView } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements'

const RegisterComponent = ({ name, username, password, changeName, changeUsername, changePassword }) => {
  return (
    <SafeAreaView>
      <FormLabel>Nome</FormLabel>
      <FormInput 
        value={name} 
        onChangeText={changeName} 
        autoCapitalize="words"
      />
      <FormLabel>Usuário</FormLabel>
      <FormInput 
        value={username} 
        onChangeText={changeUsername} 
        autoCapitalize="none"
      />
      <FormLabel>Senha</FormLabel>
      <FormInput 
        value={password} 
        onChangeText={changePassword} 
        secureTextEntry={true}
      />
    </SafeAreaView>
  );
}

export default RegisterComponent;
