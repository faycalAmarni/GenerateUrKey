import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import Toast from 'react-native-simple-toast';
import { TouchableOpacity,  Text,  View,  StyleSheet } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient'
import { TextInput } from 'react-native-paper';


class UpdateKey extends React.Component  {

  constructor(props){
    super(props)
    const key = this.props.route.params
    this.state = {
        name : key.nom,
    }
  }

  updateKey = (name, e) => {
     let that = this
     let url = 'https://api-test-key-generator.herokuapp.com/api/Keys/'+e.id+'/'
     axios.put(url, {
       nom: name,
       key:e.key,
     })
     .then(function (response) {
         Toast.show('Key updated successfully !');
         that.setState({name:""})
         const action = {type:'UPDATE_KEY', value:response.data}
         that.props.dispatch(action)
     })
     .catch(function (error) {
       console.log("Erreurrr",error);
     });
     setTimeout(function(){
       that.props.navigation.navigate("Home")
     }, 2000)

  }


  render(){
  const key = this.props.route.params
  return (

    <View style={styles.container}>
        <TextInput
          label='Name'
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
        />
        <View   style={{margin:25, marginLeft:110, width:115}}>
            <TouchableOpacity style={styles.signIn} onPress={() => {this.updateKey(this.state.name, key)}} >
                <LinearGradient   colors={['#08d4c4', '#01ab9d']}   style={styles.signIn}  >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Modify</Text>
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

export default connect(mapStateToProps)(UpdateKey)
