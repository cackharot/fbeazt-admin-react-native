import React, {Component, PropTypes} from 'react';
import {
  Text,
  View,
  ListView,
  Image,
  TouchableHighlight,
  Navigator,
  AsyncStorage,
  InteractionManager
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

  componentDidMount() {
    this._setupGoogleSignin();
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={{ fontSize: 32, fontFamily: 'chunkfive', marginBottom: 20 }}>
            {this.props.title}
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
        this.props.onSuccess(user);
      }else{
        this.props.onFailure('Not logged in!');
      }
    }
    catch (err) {
      console.log("Play services error", err.code, err.message);
      this.props.onFailure(err.message);
    }
  }

  _signIn() {
    GoogleSignin.signIn()
      .then((user) => {
        console.log('Sigin success!');
        console.log(user);
        this.props.onSuccess(user);
      })
      .catch((err) => {
        console.log('WRONG SIGNIN', err);
        this.props.onFailure(err.message);
      })
      .done();
  }
}
