import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  DeviceEventEmitter,
  TouchableOpacity,
  TouchableHighlight,
  Navigator,
  DrawerLayoutAndroid,
  AsyncStorage,
  NetInfo,
  InteractionManager,
  ToastAndroid
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import Config from 'react-native-config';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {Avatar, Drawer, Divider, COLOR, TYPO, Ripple} from 'react-native-material-design';

import {styles} from './app.styles';

import {List} from './components/List';
import {LoginView} from './components/Login';

import {Toolbar} from './components/Toolbar';
import {Navigation} from './components/Navigation';
import {Navigate} from './utils/Navigate';

import {OrderList} from './components/order-list';
import {OrderDetailsView} from './components/order-details';

import {PushNotificationService} from './services/pushservice';

let DEVICE_TOKEN_KEY = 'deviceToken';

var PushNotification = require('react-native-push-notification');

class FbeaztAdmin extends Component {
  static childContextTypes = {
		drawer: React.PropTypes.object,
		navigator: React.PropTypes.object
	};

  constructor(props) {
    super(props);
    this.state = {
      isOnline: false,
      user: null,
      drawer: null,
      navigator: null,
    };
  }

  getChildContext = () => {
		return {
			drawer: this.state.drawer,
			navigator: this.state.navigator
		}
	};

  setDrawer = (drawer) => {
		this.setState({
			drawer
		});
	};

	setNavigator = (navigator) => {
		this.setState({
			navigator: new Navigate(navigator)
		});
	};

  componentDidMount() {
    this._checkInternetConnectivity();
  }

  _checkInternetConnectivity() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('First, Device is ' + (isConnected ? 'online' : 'offline'));
      this.setState({
        isOnline: isConnected
      });
    });
    NetInfo.isConnected.addEventListener(
      'change',
      this._handleFirstConnectivityChange
    );
  }

  _handleFirstConnectivityChange(isConnected) {
    console.log('Then, Device is ' + (isConnected ? 'online' : 'offline'));
    NetInfo.isConnected.removeEventListener(
      'change',
      this._handleFirstConnectivityChange
    );
  }

  getOfflineView() {
    return (
      <View>
        <Text>You need internet connectivity to access this app!</Text>
      </View>
    );
  }

  _loginSuccess(user){
    this.setState({
      user: user
    })
    ToastAndroid.show('Sigin success!', ToastAndroid.SHORT);
    let that = this;
    AsyncStorage.getItem(DEVICE_TOKEN_KEY).then((token)=>{
      console.info('Device token: ' + token)
      if(!token){
        that._configurePushNotification(user);
      }
    })
    .catch((e)=>{
      console.error(e);
    })
    .done();
  }

  _loginFailure(errorMessage){
    this.setState({
      user: null
    })
    if(errorMessage!=='Not logged in!'){
      ToastAndroid.show('Sigin Error!\n' + errorMessage, ToastAndroid.SHORT);
    }
  }

  render() {
    if(!this.state.isOnline){
      return this.getOfflineView();
    }
    if (!this.state.user) {
      return (
        <LoginView title="Foodbeazt Admin"
          onSuccess={this._loginSuccess.bind(this)}
          onFailure={this._loginFailure.bind(this)}
        />
      );
    }
    if (this.state.user) {
      const { drawer, navigator } = this.state;
      const navView = React.createElement(Navigation);
      return (
        <DrawerLayoutAndroid
          drawerWidth={300}
          ref={(drawer) => { !this.state.drawer ? this.setDrawer(drawer) : null }}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => {
            if (drawer && navigator) {
                return navView;
            }
            return null;
          }}>
          {drawer &&
            <Navigator
              initialRoute={Navigate.getInitialRoute()}
              navigationBar={<Toolbar onIconPress={drawer.openDrawer} />}
              configureScene={() => {
                              return Navigator.SceneConfigs.FadeAndroid;
                            }}
              ref={(navigator) => { !this.state.navigator ? this.setNavigator(navigator) : null }}
              renderScene={(route) => {
                        if (this.state.navigator && route.component) {
                            return (
                                <View
                                    style={styles.scene}
                                    showsVerticalScrollIndicator={false}>
                                  <route.component title={route.title} path={route.path} {...route.props} />
                                </View>
                            );
                        }
                    }}
              />
          }
        </DrawerLayoutAndroid>
      );
    }
  }

  _configurePushNotification(){
    let that = this;
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
        InteractionManager.runAfterInteractions(() => {
          let service = new PushNotificationService();
          service.register(token)
            .catch((e)=>{
              console.error(e);
            });;
          AsyncStorage.setItem(DEVICE_TOKEN_KEY, token['token']);
        });
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
      largeIcon: "ic_launcher",
      smallIcon: "ic_notification",
      bigText: msg,
      vibrate: true,
      vibration: 300,
      message: msg,
      playSound: true,
      number: 1
    });
  }

  _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut())
      .then(() => {
        this.setState({ user: null });
        AsyncStorage.getItem(DEVICE_TOKEN_KEY).then((token)=>{
          if(token){
            InteractionManager.runAfterInteractions(() => {
              let service = new PushNotificationService();
              service.unregister(token)
                .catch((e)=>{
                  console.error(e);
                });
            });
          }
          AsyncStorage.removeItem(DEVICE_TOKEN_KEY);
        })
        .catch((e)=>{
          console.error(e);
        })
        .done();
      }).done();
  }
}

AppRegistry.registerComponent('fbeaztAdmin', () => FbeaztAdmin);
