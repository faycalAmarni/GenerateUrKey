import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {LinearGradient} from 'expo-linear-gradient'
import { FAB } from 'react-native-paper';
import { connect } from 'react-redux'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator,Alert, Animated, Dimensions } from 'react-native';
import {SwipeableFlatList} from 'react-native-swipeable-flat-list';
import {Icon} from "react-native-elements"
import KeyItem from "./KeyItem"


class Home extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      keys : [],
      loading : true,
      positionLeft: new Animated.Value(Dimensions.get('window').width)
    }
  }

  getKeys = () => {
    //Récuperer les clés stockéées dans la base de données
    var self = this;  //Eviter les soucis du dataBinding
    axios.get('https://api-test-key-generator.herokuapp.com/api/Keys/')
     .then(function (response) {
       //sauvegarder les données principalement dans le state "keys"
       self.setState({keys : response.data, loading:false})
       //le chargement initial du state global "reduxKeys"
       const action = {type:'FIRST_INSERT', value:response.data}
        self.props.dispatch(action)
    })
    .catch(function (error) {
       alert("error get Keys");
    });

  }

  componentDidMount(){
    //Lancement de la procedure de recuperation des cles aprés le chargement du component
    {this.getKeys()}
    Animated.spring(
      this.state.positionLeft,
      {
        toValue: 0
      }
    ).start()
  }

  confirmDel = item => {
    //Demander à l'utilisateur de confirmer la suppression
    Alert.alert(
       "Supprimer cette key ?",
       "La suppression est irréversible",
       [
         {
           text: "ANNULER",
           onPress: () => console.log("Cancel Pressed"),
           style: "cancel"
         },
         { text: "SUPPRIMER", onPress: () => {this.deleteKey(item)} }
       ],
       { cancelable: false }
   );
  }

  deleteKey = key => {
    //Suppression de la clé selectionnée aprés la confirmation de l'utilisateur
    const url = "https://api-test-key-generator.herokuapp.com/api/Keys/"+key.id+"/"
    let that = this
    axios.delete(url)
    .then(function (response) {
      console.log("Succes");
      const action = {type:'DELETE_KEY', value:key}
      that.props.dispatch(action)
    })
    .catch(function (error) {
      console.log(error);
    });
  }


  _displayLoading() {
     if (this.state.loading) {
       return (
         <View >
           <ActivityIndicator size='large' style={styles.loading_container}/>
         </View>
       )
     }
   }

  render(){
    return (
      <View style={styles.container}>
        {this._displayLoading()}
        <SwipeableFlatList
           data={this.props.reduxKeys.sort((a,b) => b.date.localeCompare(a.date) )}
           renderItem={({ item }) => (
                 <LinearGradient   colors={['#fff', '#01ab9d']} style={styles.item}>
                   <View style= {styles.header_container}>
                     <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title_text}>{item.nom}</Text>
                   </View>
                   <View style= {styles.key_container}>
                     <Text numberOfLines={2} ellipsizeMode="tail" style={styles.key_text}>{item.key}</Text>
                   </View>
                   <View style= {styles.date_container}>
                       <Text style={styles.date_text}>
                       {moment(new Date(item.date)).format('DD/MM/YYYY')}
                       </Text>
                   </View>
                </LinearGradient>
          )}
           renderLeft={({ item }) => (
               <Text style={{ width: 40 }}>Other</Text>
           )}
           renderRight={({ item }) => (
             <View style = {styles.delete}>
               <TouchableOpacity
                 style={[styles.touchable, {backgroundColor:'red'}]}
                 onPress={() => {this.confirmDel(item)}}
               >
                 <Icon name={"delete"}  size={30} color="#fff" />
               </TouchableOpacity>
             </View>
           )}
        />
          <FAB
             style={styles.fab}
             large
             icon="plus"
             onPress={() => {this.props.navigation.navigate("Add")}}
           />

      </View>
    );
 }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10
  },
  fab: {
    backgroundColor:"#009387",
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 10,
  },
  delete: {
    width: 80,
    backgroundColor: '#fff',
    height: 80
  },
  loading_container: {

    alignItems: 'center',
    justifyContent: 'center'
  },

  item: {
    flex :1,
    height: 90,
    paddingLeft : 5,
    paddingRight : 5,
    marginTop: 4,
    backgroundColor:'#FFFAFA',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
     },
   shadowOpacity: 0.29,
   shadowRadius: 4.65,

   elevation: 7,

  },
  content_container: {
      flex : 1,
      margin : 5
  },
  header_container: {
    flex : 2,
  },
  title_text: {
      fontWeight : 'bold',
      fontSize : 23,
      paddingRight : 5,
      paddingTop: 10,
      flex : 1,
      flexWrap : 'wrap',
      fontStyle : 'italic'
  },
  key_container: {
    flex : 1
  },
  key_text : {
    fontWeight : 'bold',
    fontSize : 14,
    color: '#666666',
    textAlign : 'center',
  },
  date_container : {
    flex : 1
  },
  date_text : {
    fontWeight : 'bold',
    fontSize : 14,
    color: '#666666',
    textAlign : 'right',
  },
  touchable :{
    marginTop: 15,
    marginLeft: 15,
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:50,
    height:50,
    backgroundColor:'#fff',
    borderRadius:50,
  },

});


const mapStateToProps = (state) =>  {
  return {
    reduxKeys : state.reduxKeys
  }
}

export default connect(mapStateToProps)(Home)
