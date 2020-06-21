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
        <Stack.Navigator  screenOptions = {{

                headerStyle : {
                  backgroundColor : "#009387"
                },
                headerTintColor : "#fff",
                headerTitleStyle : {
                  fontWeight : 'bold',
                  fontStyle : 'italic'
                }

              }} >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Add" component={AddKey} options={{ title: 'Add a key' }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default MainNav
