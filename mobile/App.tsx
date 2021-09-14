import React from 'react';

import Navigator from './components/Navigator';
import { NativeBaseProvider } from 'native-base';

export default function App() {
  return (
    <NativeBaseProvider>
      <Navigator />
    </NativeBaseProvider>
  );
}
