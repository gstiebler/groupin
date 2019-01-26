import React from 'react';
import { connect } from "react-redux";
import { getTopicsOfGroup } from '../actions/rootActions';
import { SafeAreaView } from 'react-native';
// import { Text, FlatList } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

const mapStateToProps = state => {
  return { ownGroups: state.ownGroups };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

const RegisterComponent = ({navigation}) => {
  return (
    <SafeAreaView>
      <FormLabel>Nome</FormLabel>
      <FormInput />
      <FormLabel>Usuário</FormLabel>
      <FormInput />
      <FormLabel>Senha</FormLabel>
      <FormInput />
    </SafeAreaView>
  );
}


const Register = connect(mapStateToProps, mapDispatchToProps)(RegisterComponent);
export default Register;
