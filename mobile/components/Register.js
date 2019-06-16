import React from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput,
  View,
  Button, 
  TouchableOpacity,
} from 'react-native';
import styles from '../Style';

const RegisterComponent = ({ 
    navigation,
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
    <SafeAreaView style={styles.container}>
      <Text style={ styles.title1 }>Registro</Text>
        <TextInput
          placeholder="Nome"
          autoCapitalize="words"
          style={styles.textInput}
          onChangeText={changeName}
          value={name}
        />
        <TextInput
          placeholder="E-mail"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={changeUsername}
          value={username}
        />
        <TextInput
          secureTextEntry
          placeholder="Senha"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={changePassword}
          value={password}
        />
        <Button title="Registrar" color={ styles.title1.color } onPress={this.handleSignUp}/>
        <View>
        <Text> Já possui uma conta? 
          <Text onPress={onShowLogin.bind(null, navigation)} style={ styles.title2 }> Login </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default RegisterComponent;
