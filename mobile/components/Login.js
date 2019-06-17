import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import styles from '../Style';

const LoginComponent = ({ 
    navigation,
    password, 
    username,
    changeUsername, 
    changePassword,
    onLogin,
    onShowRegister,
    willFocus,
  }) => {
  navigation.addListener('willFocus', () => willFocus(navigation));
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={ styles.title1 }>Login</Text>
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        placeholder="E-mail"
        onChangeText={changeUsername}
        value={username}
      />
      <TextInput
        secureTextEntry
        style={styles.textInput}
        autoCapitalize="none"
        placeholder="Senha"
        onChangeText={changePassword}
        value={password}
      />
      <Button title="Login" color={ styles.title1.color } onPress={() => onLogin(navigation)} />
      <View>
      <Text> Não possui uma conta? 
        <Text onPress={() => onShowRegister(navigation)} style={ styles.title2 }> Fazer cadastro </Text>
      </Text>
      </View>
    </SafeAreaView>
  );
}

export default LoginComponent;
