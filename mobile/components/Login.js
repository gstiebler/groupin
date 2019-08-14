import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import styles from '../Style';

const LoginComponent = ({ 
    navigation,
    phoneNumber,
    changePhoneNumber,
    onLogin,
    willFocus,
  }) => {
  navigation.addListener('willFocus', () => willFocus(navigation));
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={ styles.title1 }>Login</Text>
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        placeholder="Número de telefone"
        onChangeText={changePhoneNumber}
        value={phoneNumber}
      />
      <Button title="Enviar" color={ styles.title1.color } onPress={() => onLogin(navigation)} />
    </SafeAreaView>
  );
}

export default LoginComponent;
