import React from 'react';
import Config from 'react-native-config';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

export class PushNotificationService {
  constructor() {
    var user = GoogleSignin.currentUser();
    this.user = user;
    this.idToken = null;
    this.headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
    if (user && user.idToken) {
      this.idToken = 'Bearer ' + user.idToken;
      this.headers.set('Authorization', this.idToken);
      this.headers.set('Cookie', null);
    }
  }

  register(deviceToken) {
    return fetch(Config.BASE_URL + '/api/push_service/register',
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          email: this.user && this.user.email ? this.user.email : '',
          device_token: deviceToken
        })
      })
      .then((response) => response.json());
  }

  unregister(deviceToken) {
    return fetch(Config.BASE_URL + '/api/push_service/unregister',
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          device_token: deviceToken
        })
      })
      .then((response) => response.json());
  }
}
