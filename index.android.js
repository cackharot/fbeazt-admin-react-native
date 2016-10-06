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
  StatusBar,
  ToastAndroid
} from 'react-native';

import {Actions, Scene, Modal, Router, ActionConst} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {Avatar, Drawer, Divider, COLOR, TYPO, Ripple} from 'react-native-material-design';

import {styles} from './app.styles';
import {AppDrawer} from './AppDrawer';

import {LoginView} from './components/Login';
let SignOutView = require('./components/signout').default;
let OrderListView = require('./components/order-list').default;
let OrderDetailsView = require('./components/order-details').default;
let StoreListView = require('./components/store-list').default;
let StoreDetailsView = require('./components/store-details').default;

import {Toolbar} from './components/Toolbar';

import {PushNotificationService} from './services/pushservice';

let DEVICE_TOKEN_KEY = 'deviceToken';

var PushNotification = require('react-native-push-notification');

class FbeaztAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icons: null
    }
  }
  componentWillMount() {
    this.preloadImages();
  }

  async preloadImages() {
    const images = await Promise.all([
      // Icon.getImageSource('md-arrow-back', 20, 'white'),
      Icon.getImageSource('ios-arrow-back-outline', 20, 'white'),
      Icon.getImageSource('ios-menu-outline', 15, 'white'),
      Icon.getImageSource('ios-cart-outline', 20, 'white')
    ]);
    this.setState({
      icons: {
        backIcon: images[0],
        burgerIcon: images[1],
        cart: images[2]
      }
    });
  }

  renderMenuButton() {
    return (
      <TouchableOpacity style={{ paddingLeft: 15, flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} onPress={() => { Actions.get('drawer').ref.toggle() } }>
        <Icon name="ios-menu-outline" size={30} color="white"/>
      </TouchableOpacity>
    );
  };

  render() {
    let {icons} = this.state;
    if (!icons) {
      return null;
    }

    const scenes = Actions.create(
      <Scene key="modal" component={Modal}>
        <Scene key="root"
          hideNavBar hideTabBar type={ActionConst.RESET}>
          <Scene key="login" component={LoginView}
            onSuccess={this._configurePushNotification.bind(this) }
            title="Foodbeazt Admin"  hideNavBar hideTabBar initial type={ActionConst.RESET}/>
          <Scene key="logout" component={SignOutView}
            title="Sign Out"  hideNavBar hideTabBar type={ActionConst.RESET}/>
          <Scene key="drawer" component={AppDrawer} hideNavBar={false} hideTabBar={false}>
            <Scene key="main" type={ActionConst.RESET}>
              <Scene key="orderList"
                title="Orders" component={OrderListView} type={ActionConst.RESET}/>
              <Scene key="orderDetails" title="Orders details" component={OrderDetailsView}/>
              <Scene key="storeList" title="Restaurants" component={StoreListView}  type={ActionConst.RESET}/>
              <Scene key="storeDetails" title="Store Details" component={StoreDetailsView} />
            </Scene>
          </Scene>
        </Scene>
      </Scene>
    );
    // </Scene>

    return (
      <Router scenes={scenes} title="Foodbeazt"
        leftButton={this.renderMenuButton}
        backButtonImage={icons.backIcon}
        navigationBarStyle={{ backgroundColor: COLOR.paperPink400.color }}
        titleStyle={[COLOR.paperGrey50]}
        sceneStyle={{ flex: 1, backgroundColor: '#F7F7F7' }}>
      </Router>
    );
  }

  async _configurePushNotification() {
    let that = this;
    console.log('Configuring PUSH notification');
    let prevToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
    console.log('prevToken', prevToken);

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('GCM TOKEN:', token);
        if (token['token'] !== prevToken) {
          InteractionManager.runAfterInteractions(() => {
            let service = new PushNotificationService();
            service.register(token)
              .catch((e) => {
                console.error(e);
              });
            AsyncStorage.setItem(DEVICE_TOKEN_KEY, token['token']);
          });
        }
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('RECEIVED NOTIFICATION:', notification);
        if (notification.foreground === true && notification.userInteraction === false && notification['google.message_id']) {
          that._showLocalNotification(notification);
        }
        if (notification.userInteraction === true) {
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
    console.log('**********Navigating*********', notification.order_id, notification.order_no);
    if (notification.order_id && notification.order_no.length > 0) {
      const { order_no, order_id } = notification;
      let name = '#' + order_no + ' Details';
      Actions.orderDetails({ title: name, order_id: order_id });
    }
  }

  _showLocalNotification(notification) {
    let msg = notification.message;
    let title = notification.title;
    PushNotification.localNotification(Object.assign({
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
      number: 1,
      collapse_key: null
    }, notification));
  }
}

AppRegistry.registerComponent('fbeaztadmin', () => FbeaztAdmin);
