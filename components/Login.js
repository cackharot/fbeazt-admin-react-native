import React, {Component, PropTypes} from 'react';
import {
  Text,
  View,
  ListView,
  Image,
  TouchableHighlight,
  Navigator,
  AsyncStorage,
  StatusBar,
  InteractionManager,
  ActivityIndicator,
  NetInfo
} from 'react-native';

import {
  Avatar
  , Checkbox
  , Subheader
  , Divider
  , IconToggle
  , Ripple
  , Toolbar
  , Button
  , Card
  , COLOR
  , TYPO
} from 'react-native-material-design';

import Config from 'react-native-config';

import { List } from './List';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../app.styles';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

let DEVICE_TOKEN_KEY = 'deviceToken';

export class LoginView extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    onSuccess: React.PropTypes.func.isRequired,
    onFailure: React.PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      isOnline: false,
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState({
      isOnline: false,
      isLoading: true
    });
    this._checkInternetConnectivity();
  }

  render() {
    let {isLoading, isOnline} = this.state;
    return (
      <View style={[styles.container, { backgroundColor: COLOR.paperPinkA200.color }]}>
        <StatusBar
          backgroundColor={COLOR.paperPink400.color}
          barStyle="light-content"
          />
        <View style={{ alignItems: 'center' }}>
          <View style={{
            backgroundColor: 0xFFFFFF66, alignItems: 'center',
            borderColor: 0x00000001,
            padding: 20,
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 3
          }}>
            <Icon name={'ios-restaurant'} size={60} style={{ color: 0x00000044 }}/>
          </View>
          <Text style={{ fontSize: 45, textAlign: 'center', color: 'white', fontWeight: 'bold', fontFamily: 'opensans', marginTop: 20, marginBottom: 20 }}>
            {this.props.title.toUpperCase() }
          </Text>
          <Text style={[TYPO.paperFontSubhead, { fontSize: 20, marginBottom: 40, color: 'white', fontFamily: 'roboto' }]}>
            Delivery at your doorsteps
          </Text>
        </View>
        {isLoading &&
          <ActivityIndicator
            color={COLOR.paperAmberA400.color}
            style={[styles.centering, { height: 80 }]}
            size="large"
            />
        }
        {!isLoading && isOnline &&
          <GoogleSigninButton
            style={{ width: 312, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn.bind(this) }/>
        }
        {!isLoading && isOnline &&
          <Text style={[TYPO.paperFontBody1, { marginTop: 50, color: 'white', fontFamily: 'roboto' }]}>
            You need google account to use this app!
          </Text>
        }
        {!isLoading && !isOnline &&
          <Text style={[TYPO.paperFontSubhead, {
            textAlign: 'center',
            padding: 30,
            color: 'white', fontFamily: 'opensans'
          }]}>
            You need internet connectivity to access this app!
          </Text>
        }
      </View>
    );
  }

  async _setupGoogleSignin() {
    try {
      console.info('App Config', Config);
      let gsConfig = {
        webClientId: Config.WEB_CLIENT_ID,
        offlineAccess: false
      };
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure(gsConfig);

      const user = await GoogleSignin.currentUserAsync();
      if (user) {
        console.info('Logged in user: ' + user.email);
      }
      return user;
    }
    catch (err) {
      console.log("Play services error", err.code, err.message);
    }
    return null;
  }

  _signIn() {
    this.setState({ isLoading: true });
    InteractionManager.runAfterInteractions(() => {
      GoogleSignin.signIn()
        .then((user) => {
          console.log('Sigin success!');
          console.log(user);
          this.props.onSuccess(user);
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          console.log('WRONG SIGNIN', err);
          this.props.onFailure(err.message);
        })
        .done();
    });
  }

  async _checkInternetConnectivity() {
    try {
      let isConnected = await NetInfo.isConnected.fetch();
      console.log('First, Device is ' + (isConnected ? 'online' : 'offline'));
      NetInfo.isConnected.addEventListener(
        'change',
        this._handleFirstConnectivityChange.bind(this)
      );
      this.setState({ isOnline: isConnected });
      if (isConnected) {
        let user = await this._setupGoogleSignin();
        this.setState({ isLoading: false });
        if (user) {
          this.props.onSuccess(user);
        } else {
          this.props.onFailure(null);
        }
      }
    } catch (e) {
      console.log(e);
      this.setState({ isOnline: false });
    }
  }

  async _handleFirstConnectivityChange(isConnected) {
    console.log('Then, Device is ' + (isConnected ? 'online' : 'offline'));
    NetInfo.isConnected.removeEventListener(
      'change',
      this._handleFirstConnectivityChange
    );
  }
}
