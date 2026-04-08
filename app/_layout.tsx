import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainNavigator from '../src/navigation/MainNavigator';
import Toast from 'react-native-toast-message';

import { KeyboardProvider } from 'react-native-keyboard-controller';
import '../src/global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <MainNavigator />
        <Toast />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
