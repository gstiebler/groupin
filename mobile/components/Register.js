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
    verificationCode, 
    changeName, 
    changeVerificationCode,
    onRegister,
    onBack,
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
          placeholder="Código de verificação"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={changeVerificationCode}
          value={verificationCode}
        />
        <Button title="Registrar" color={ styles.title1.color } onPress={() => onRegister(navigation)}/>
        <View>
        <Text onPress={() => onBack(navigation)} style={ styles.title2 }> Editar número de telefone </Text>
      </View>
    </SafeAreaView>
  );
}

export default RegisterComponent;
