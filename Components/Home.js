import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {LinearGradient} from 'expo-linear-gradient'
import { FAB } from 'react-native-paper';
import { connect } from 'react-redux'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator,Alert, Animated, Dimensions } from 'react-native';
import {SwipeableFlatList} from 'react-native-swipeable-flat-list';
import {Icon} from "react-native-elements"


class Home extends React.Component {
  constructor(props){
    super(props)
    //Set the home navigation header by adding the search icon
    this.props.navigation.setOptions({
        headerRight: () => <Icon name="search" size={30} color="#fff" iconStyle={{marginRight:7}}
                            onPress={() => this.props.navigation.navigate("Search",this.state.keys)}  />
      });
    this.state = {
      keys : [],
      loading : true,
      positionLeft: new Animated.Value(Dimensions.get('window').width)
    }
  }

  getKeys = () => {
    //Recover keys stored in the DB
    var self = this;  //Eviter les soucis du dataBinding
    axios.get('https://api-test-key-generator.herokuapp.com/api/Keys/')
     .then(function (response) {
       //save server response into state "keys"
       self.setState({keys : response.data, loading:false})
       //Initial loading of global state "reduxKeys"
       const action = {type:'FIRST_INSERT', value:response.data}
        self.props.dispatch(action)
    })
    .catch(function (error) {
       alert("error get Keys");
    });

  }

  componentDidMount(){
    //Launch of the key loading procedure after loading the component
    {this.getKeys()}

  }

  confirmDel = item => {
    //Ask user to confirm delete key operation
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
    //Delete the selected key after user confirmation
    const url = "https://api-test-key-generator.herokuapp.com/api/Keys/"+key.id+"/"
    let that = this
    axios.delete(url)
    .then(function (response) {
      console.log("Succes");
      //delete key from redux variable
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
             <View style = {styles.icon}>
               <TouchableOpacity
                 style={[styles.touchable, {backgroundColor:'green'}]}
                 onPress={() => {this.props.navigation.navigate("update",item)}}
               >
                 <Icon name={"update"}  size={30} color="#fff" />
               </TouchableOpacity>
             </View>
           )}
           renderRight={({ item }) => (
             <View style = {styles.icon}>
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
  icon: {
    width: 90,
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
    fontSize : 16,
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
