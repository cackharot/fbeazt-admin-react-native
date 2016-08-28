import React from 'react';
import Config from 'react-native-config';

import {BaseService} from './baseservice';

export class OrderService extends BaseService {
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
}
