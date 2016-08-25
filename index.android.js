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
  DrawerLayoutAndroid,
  AsyncStorage
} from 'react-native';

import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';

import Config from 'react-native-config';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import { Avatar } from 'react-native-material-design';

import { styles } from './app.styles';

import {OrderList} from './components/order-list';
import {OrderDetailsView} from './components/order-details';

import {PushNotificationService} from './services/pushservice';

let _navigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var PushNotification = require('react-native-push-notification');

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
          <Text style={{ fontSize: 32, fontFamily: 'chunkfive', marginBottom: 20 }}>
            Foodbeazt Admin App
          </Text>
          <Text style={{ marginBottom: 30, fontFamily: 'opensans' }}>
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
            configureScene={() => {
                            return Navigator.SceneConfigs.FadeAndroid;
                           }}
            renderScene={this.navigatorRenderScene}
            />
        </DrawerLayoutAndroid>
      );
    }
  }

  _renderMenuItem(item) {
    return(
      <Icon.Button name={item.icon}
        onPress={()=> this._onItemSelect(item.title)} style={styles.menu_btn}
        color="#d33682" size={22} borderWidth={0}
        backgroundColor="#F5FCFF" borderRadius={0}>
        {item.title}
      </Icon.Button>
    );
  }

  _onItemSelect(item) {
    switch(item){
      case 'Log out':
        this._signOut();
        break;
      default:
        console.log('Selected menu = ' + item);
        _navigator.push({
          id: item,
          title: item
        });
        break;
    }
  }

  openDrawer() {
    this.refs['DRAWER'].openDrawer();
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'home':
      case 'Orders':
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
        break;
      default:
        console.log('No route available for :' + route.id);
        return (
          <View underlayColor='#dddddd'>
            <Icon.ToolbarAndroid style={styles.toolbar}
              navIconName="md-arrow-back"
              title="No Found!"
              navIcon={require('./assets/icons/ic_arrow_back_black_24dp.png') }
              onIconClicked={()=>{
                _navigator.pop();
              }}
              titleColor={'#FFFFFF'}/>
            <Text>
              Route not found :(
            </Text>
          </View>
        );
    }
  }

  async _setupGoogleSignin() {
    try {
      console.info('App Config', Config);
      let gsConfig = {
        // scopes: ['https://www.googleapis.com/auth/calendar'],
        webClientId: Config.WEB_CLIENT_ID,
        offlineAccess: false
      };
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure(gsConfig);

      const user = await GoogleSignin.currentUserAsync();
      if (user) {
        console.info('Logged in user: ' + user.email);
        let that = this;
        AsyncStorage.getItem('deviceToken').then((token)=>{
          console.info('Device token: ' + token)
          if(!token){
            // that._configurePushNotification(user);
          }
        })
        .catch((e)=>{
          console.error(e);
        })
        .done();
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
        this._configurePushNotification(user);
      })
      .catch((err) => {
        console.log('WRONG SIGNIN', err);
      })
      .done();
  }

  _configurePushNotification(user){
    let that = this;
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
        let service = new PushNotificationService();
        service.register(token)
          .catch((e)=>{
            console.error(e);
          });;
        AsyncStorage.setItem('deviceToken', token['token']);
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        if(notification.foreground === true && notification.userInteraction === false && notification['google.message_id']){
          that._showLocalNotification(notification);
        }
        if(notification.userInteraction === true){
          that._tryNavigateOnNotification(notification);
        }
      },
      // ANDROID ONLY: (optional) GCM Sender ID.
      senderID: Config.GCM_SENDER_ID,
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  _tryNavigateOnNotification(notification) {
    if(notification.order_id){
      _.navigator.push({
        id: 'orderdetails',
        title: '#' + notification.order_no + ' Details',
        passProps: { order_id: notification.order_id }
      });
    }
  }

  _showLocalNotification(notification) {
    let msg = notification.message;
    let title = notification.title;
    PushNotification.localNotification({
      id: 0,
      title: title,
      autoCancel: true,
      default: true,
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: msg, // (optional) default: "message" prop
      // subText: "New Order", // (optional) default: none
      // color: "red", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      // tag: 'new_order', // (optional) add tag to message
      // group: "order", // (optional) add group to message
      /* iOS and Android properties */
      message: msg, // (required)
      playSound: true, // (optional) default: true
      number: 1 // (optional) default: none (Cannot be zero)
    });
  }

  _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut())
      .then(() => {
        this.setState({ user: null });
        AsyncStorage.getItem('deviceToken').then((token)=>{
          if(token){
            let service = new PushNotificationService();
            service.unregister(token)
              .catch((e)=>{
                console.error(e);
              });
          }
          AsyncStorage.removeItem('deviceToken');
        })
        .catch((e)=>{
          console.error(e);
        })
        .done();
      }).done();
  }
}

AppRegistry.registerComponent('fbeaztAdmin', () => FbeaztAdmin);
