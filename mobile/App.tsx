import React from 'react';
import Navigator from './components/Navigator';
import { extendTheme, NativeBaseProvider } from 'native-base';

const newColorTheme = {
  primary: {
    500: '#c084fc', // button
    600: '#9333ea', // radiogroup
  },
};
const theme = extendTheme({ colors: newColorTheme });

export default function App() {
  return (
    <NativeBaseProvider theme={theme} >
      <Navigator />
    </NativeBaseProvider>
  );
}
