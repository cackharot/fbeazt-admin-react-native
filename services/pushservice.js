import React from 'react';
import Config from 'react-native-config';

import {BaseService} from './baseservice';

export class PushNotificationService extends BaseService {
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
