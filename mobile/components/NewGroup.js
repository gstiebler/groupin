import React from 'react';
import { SafeAreaView } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements'

class NewGroupComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  render() {
    const { navigation, onCreate } = this.props;
    const { name } = this.state;
    return (
      <SafeAreaView>
        <FormLabel>Nome do novo grupo</FormLabel>
        <FormInput 
          value={name} 
          onChangeText={newName => this.setState({ name: newName })} 
        />
        <Button title="Criar grupo" onPress={() => onCreate(navigation, name)} />
      </SafeAreaView>
    );
  }
}

export default NewGroupComponent;
