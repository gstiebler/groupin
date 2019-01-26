import React from 'react';
import { SafeAreaView } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements'

const RegisterComponent = ({ name, username, password, changeName, changeUsername, changePassword }) => {
  return (
    <SafeAreaView>
      <FormLabel>Nome</FormLabel>
      <FormInput value={name} onChangeText={changeName} />
      <FormLabel>Usuário</FormLabel>
      <FormInput value={username} onChangeText={changeUsername} />
      <FormLabel>Senha</FormLabel>
      <FormInput value={password} onChangeText={changePassword} />
    </SafeAreaView>
  );
}

export default RegisterComponent;
