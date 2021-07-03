import React from 'react';
import { SafeAreaView } from 'react-native';
import { 
  Container,
  Text,
  Content,
} from 'native-base';
import styles from '../Style';

const SplashScreenComponent = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} >
      <Container>
        <Content contentContainerStyle={styles.container}>
          <Text>GroupIn</Text>
        </Content>
      </Container>
    </SafeAreaView>
  );
}

export default SplashScreenComponent;
