import React from 'react';
import Config from 'react-native-config';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

export class OrderService {
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

  getOrders() {
    return fetch(Config.BASE_URL + '/api/orders?page_size=10&page_no=1',
      {
        headers: this.headers
      })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
  }

  getOrderDetail(order_id) {
    return fetch(Config.BASE_URL + '/api/order/' + order_id,
      {
        headers: this.headers
      })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
  }
}
