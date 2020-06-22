import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import Toast from 'react-native-simple-toast';
import { TouchableOpacity,  Text,  View,  StyleSheet } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient'
import { TextInput } from 'react-native-paper';
import {insertKey} from '../utils'

class AddKey extends React.Component  {

  constructor(props){
    super(props)
    this.state = {
        name : "",
    }
  }

  insertKey = (name, key) => {
    //Insert a new key in data base
     let that = this //Avoiding data binding
     axios.post('https://api-test-key-generator.herokuapp.com/api/Keys/', {
       nom: name,
       key: key,
     })
     .then(function (response) {
         Toast.show('Key added successfully !');
         //Reset textInput value
         that.setState({name:""})
         //Add the new key to the redux variable
         const action = {type:'ADD_KEY', value:response.data}
         that.props.dispatch(action)
     })
     .catch(function (error) {
       console.log("Erreurrr",error);
     });
  }

  getRandomInt = ( min, max ) => {
          return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
     }

  generateProductKey = () => {
    //Generate a random product Key
     var tokens = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
       chars = 5,
       segments = 4,
       keyString = "";

     for( var i = 0; i < segments; i++ ) {
       var segment = "";

       for( var j = 0; j < chars; j++ ) {
           var k = this.getRandomInt( 0, 35 );
         segment += tokens[ k ];
       }

       keyString += segment;

       if( i < ( segments - 1 ) ) {
         keyString += "-";
       }
     }

     return keyString;
   }

  render(){

  return (

    <View style={styles.container}>
        <TextInput
          label='Name'
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
        />
        <View   style={{margin:25, marginLeft:110, width:115}}>
            <TouchableOpacity style={styles.signIn} onPress={() => {this.insertKey(this.state.name, this.generateProductKey())}} >
                <LinearGradient   colors={['#08d4c4', '#01ab9d']}   style={styles.signIn}  >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Generate</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    </View>

  );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:16,
    marginTop:50
  },
  signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
  },
  textSign: {
      fontSize: 18,
      fontWeight: 'bold'
  }
})


const mapStateToProps = (state) =>  {
  return {
    reduxKeys : state.reduxKeys
  }
}

export default connect(mapStateToProps)(AddKey)
