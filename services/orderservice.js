import React from 'react';
import Config from 'react-native-config';

import {GoogleSignin} from 'react-native-google-signin';

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

  getOrders(nextUrl, searchModel) {
    let sm = Object.assign({}, searchModel);
    if(sm.order_status && sm.order_status.length > 0){
      sm.order_status = sm.order_status.join(',');
    }
    var url = '/api/orders/?' + this.toQueryString(sm);
    if (nextUrl && nextUrl.length > 0) {
      url = nextUrl;
    }
    console.log('fetching', url);
    return fetch(Config.BASE_URL + url,
      {
        headers: this.headers
      })
      .then((response) => response.json());
  }

  getOrderDetail(order_id) {
    return fetch(Config.BASE_URL + '/api/order/' + order_id,
      {
        headers: this.headers
      })
      .then((response) => response.json());
  }

  updateStatus(order_id, toStatus) {
    return fetch(Config.BASE_URL + '/api/order_status/' + order_id,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          status: toStatus
        })
      })
      .then(response => response.json());
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
