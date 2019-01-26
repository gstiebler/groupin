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
    name, 
    username, 
    password, 
    changeName, 
    changeUsername, 
    changePassword,
    onRegister,
    onShowLogin,
  }) => {
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
      <Button 
        title='Registrar' 
        style={styles.basic}
        onPress={onRegister}
      />
      <Button 
        title='Já sou cadastrado' 
        style={styles.basic}
        onPress={onShowLogin}
      />
    </SafeAreaView>
  );
}

export default RegisterComponent;
