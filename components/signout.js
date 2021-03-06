import React, {Component, PropTypes} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  InteractionManager,
  BackAndroid,
  ActivityIndicator
} from 'react-native';

import {
  Avatar
  , Subheader
  , Divider
  , Card
  , COLOR
  , TYPO
} from 'react-native-material-design';

import {GoogleSignin} from 'react-native-google-signin';
import {PushNotificationService} from '../services/pushservice';
import {styles} from '../app.styles';

let DEVICE_TOKEN_KEY = 'deviceToken';

export default class SignOutView extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {this._signOut();}, 3000);
  }

  _signOut() {
    GoogleSignin.revokeAccess()
      .then(() => GoogleSignin.signOut())
      .then(() => {
        console.log("Google revoke access done!")
        AsyncStorage.getItem(DEVICE_TOKEN_KEY)
          .then((token) => {
            if (token) {
              InteractionManager.runAfterInteractions(() => {
                let service = new PushNotificationService();
                service.unregister(token)
                  .catch((e) => {
                    console.error(e);
                  });
              });
            }
            AsyncStorage.removeItem(DEVICE_TOKEN_KEY);
          })
          .catch((e) => {
            console.error(e);
          })
          .done(() => {
            BackAndroid.exitApp();
          });
      })
      .done();
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          color={COLOR.paperDeepOrange500.color}
          style={[styles.centering, { height: 80 }]}
          size="large"
          />
        <Text style={[TYPO.paperFontBody1]}>
          Signing out...Please wait...
        </Text>
      </View>
    );
  }
}
