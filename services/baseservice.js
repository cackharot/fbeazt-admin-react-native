import React from 'react';
import Config from 'react-native-config';

import {GoogleSignin} from 'react-native-google-signin';

export class BaseService {
  constructor() {
    var user = GoogleSignin.currentUser();
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

  toQueryString(obj) {
    return obj ? Object.keys(obj).sort().map(function (key) {
      var val = obj[key];

      if (Array.isArray(val)) {
        return val.sort().map(function (val2) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
        }).join('&');
      }

      return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
  }
}
