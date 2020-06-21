import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Components/Home'
import AddKey from '../Components/AddKey'
const Stack = createStackNavigator();

const MainNav = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Add" component={AddKey} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default MainNav
