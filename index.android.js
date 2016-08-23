import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  BackAndroid,
  Text,
  View,
  ListView,
  Image,
  DeviceEventEmitter,
  TouchableOpacity,
  TouchableHighlight,
  Navigator,
  DrawerLayoutAndroid
} from 'react-native';

import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import { Avatar } from 'react-native-material-design';

import { styles } from './app.styles';

import {OrderList} from './components/order-list';
import {OrderDetailsView} from './components/order-details';

let _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var PushNotification = require('react-native-push-notification');

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  // ANDROID ONLY: (optional) GCM Sender ID.
  senderID: "280436316587",
  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true
  },
  popInitialNotification: true,
  requestPermissions: true,
});

// PushNotification.localNotification({
//     id: 0,
//     title: "New Order", // (optional)
//     ticker: "New Order", // (optional)
//     autoCancel: true,
//     default: true,
//     largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
//     smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
//     bigText: "Yay! New order from cusomter for Rs.400 (bigText)", // (optional) default: "message" prop
//     subText: "New Order", // (optional) default: none
//     color: "red", // (optional) default: system default
//     vibrate: true, // (optional) default: true
//     vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
//     tag: 'new_order', // (optional) add tag to message
//     group: "order", // (optional) add group to message
//     /* iOS and Android properties */
//     message: "Yay! New order from cusomter for Rs.400", // (required)
//     playSound: true, // (optional) default: true
//     number: 1 // (optional) default: none (Cannot be zero)
// });

class FbeaztAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      menuDataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }
  componentDidMount() {
    this.setState({
      menuDataSource: this.state.menuDataSource.cloneWithRows([
        { title: 'Orders', icon: 'md-cart'},
        { title: 'Stores', icon: 'md-albums'},
        { title: 'Dishes', icon: 'md-cafe'},
        { title: 'Popular', icon: 'md-star'},
        { title: 'Log out', icon: 'md-log-out'},
      ])
    });
    this._setupGoogleSignin();
  }

  render() {
    if (!this.state.user) {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 20 }}>
            Foodbeazt Admin App
          </Text>
          <Text style={{ marginBottom: 30 }}>
            SignIn to start!
          </Text>
          <GoogleSigninButton
            style={{ width: 312, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn.bind(this) }/>
        </View>
      );
    }
    if (this.state.user) {
      var navigationView = (
        <View style={styles.container}>
          <Avatar image={<Image source={{ uri: this.state.user.photo }} />} />
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
            Welcome {this.state.user.name}
          </Text>
          <View style={styles.drawer_content_container}>
            <ListView
                dataSource={this.state.menuDataSource}
                renderRow={(item) => this._renderMenuItem(item)}
            />
          </View>
        </View>
      );
      return (
        <DrawerLayoutAndroid
          drawerWidth={300}
          ref={'DRAWER'}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => navigationView}>
          <Navigator
            initialRoute={{ id: 'home', openDrawer: this.openDrawer.bind(this) }}
            renderScene={this.navigatorRenderScene}
            />
        </DrawerLayoutAndroid>
      );
    }
  }

  _renderMenuItem(item) {
    return(
      <Button onPress={()=> this._onItemSelect(item.title)} style={styles.menu_btn}>
        <View>
          <Icon name={item.icon}/>
          <Text>{item.title}</Text>
        </View>
      </Button>
    );
  }

  _onItemSelect(item) {
    switch(item){
      case 'Log out':
        this._signOut();
        break;
      default:
        console.log('Selected menu = ' + item);
        break;
    }
    // Add the code to push a scene in navigation stack, we’ll do it in a few
  }

  openDrawer() {
    this.refs['DRAWER'].openDrawer();
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'home':
        return (<OrderList
          title='Orders'
          navigator={navigator}
          openDrawer={()=>{
            if(this.initialRoute.openDrawer){
              this.initialRoute.openDrawer();
            }
          }}
          />);
      case 'orderdetails':
        return (<OrderDetailsView
          navigator={navigator}
          {...route.passProps}
          title={route.title} />);
      case 'back':
        _navigator.pop();
    }
  }

  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        // scopes: ['https://www.googleapis.com/auth/calendar'],
        webClientId: '280436316587-pc2v79112kdqu0jiruu56m92s8nr4s42.apps.googleusercontent.com',
        offlineAccess: false
      });

      const user = await GoogleSignin.currentUserAsync();
      if (user) {
        console.log(user.email);
      }
      this.setState({ user });
    }
    catch (err) {
      console.log("Play services error", err.code, err.message);
    }
  }

  _signIn() {
    GoogleSignin.signIn()
      .then((user) => {
        console.log(user);
        this.setState({ user: user });
      })
      .catch((err) => {
        console.log('WRONG SIGNIN', err);
      })
      .done();
  }

  _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.setState({ user: null });
    })
      .done();
  }
}

AppRegistry.registerComponent('fbeaztAdmin', () => FbeaztAdmin);
