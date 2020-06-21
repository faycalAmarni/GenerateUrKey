import * as React from 'react';
import { View, Text } from 'react-native';
import {Icon} from "react-native-elements"
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Components/Home'
import AddKey from '../Components/AddKey'
import UpdateKey from '../Components/UpdateKey'
import SearchKey from '../Components/SearchKey'
const Stack = createStackNavigator();

const MainNav = ({navigation}) => {

    return (
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
          <Stack.Screen name="Home" component={Home}

                    />
          <Stack.Screen name="Add" component={AddKey} options={{ title: 'Add a key' }}/>
          <Stack.Screen name="update" component={UpdateKey}
                      options={{ title: 'Update the key'  }}/>
          <Stack.Screen name="Search" component={SearchKey} options={{ title: 'Rechercher' }}/>
        </Stack.Navigator>
    );
}

export default MainNav
