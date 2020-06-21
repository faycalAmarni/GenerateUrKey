import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {LinearGradient} from 'expo-linear-gradient'
import { FAB } from 'react-native-paper';
import { connect } from 'react-redux'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from 'react-native';
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
    var self = this;
    axios.get('https://api-test-key-generator.herokuapp.com/api/Keys/')
     .then(function (response) {
       self.setState({keys : response.data, loading:false})
       const action = {type:'FIRST_INSERT', value:response.data}
        self.props.dispatch(action)
    })
    .catch(function (error) {
       alert("error get Keys");
    });

  }

  componentDidMount(){
    {this.getKeys()}
    Animated.spring(
      this.state.positionLeft,
      {
        toValue: 0
      }
    ).start()
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
           data={this.props.reduxKeys}
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
              <Text style={{ width: 40 }}>Other</Text>
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
