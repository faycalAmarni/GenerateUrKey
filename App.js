import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainNav from './Navigation/Navigation'
import {Provider} from 'react-redux'
import { NavigationContainer } from '@react-navigation/native';
import Store from './Store/configureStore'

export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <MainNav />
      </NavigationContainer>
    </Provider>
  );
}
