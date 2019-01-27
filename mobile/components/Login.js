import React from 'react';
import { SafeAreaView } from 'react-native';
import { StyleSheet } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements'

const styles = StyleSheet.create({
  basic: {
    margin: 20,
  },
});

const LoginComponent = ({ 
    navigation,
    password, 
    username,
    changeUsername, 
    changePassword,
    onLogin,
    onShowRegister,
  }) => {
  return (
    <SafeAreaView>
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
        title='Login' 
        style={styles.basic}
        onPress={onLogin.bind(null, navigation)}
      />
      <Button 
        title='Fazer cadastro' 
        style={styles.basic}
        onPress={onShowRegister.bind(null, navigation)}
      />
    </SafeAreaView>
  );
}

export default LoginComponent;
