import React from 'react';
import Config from 'react-native-config';

import {BaseService} from './baseservice';

export class StoreService extends BaseService {
  getStores(nextUrl, searchModel) {
    let sm = Object.assign({}, searchModel);
    if(sm.order_status && sm.order_status.length > 0){
      sm.order_status = sm.order_status.join(',');
    }
    var url = '/api/stores?' + this.toQueryString(sm);
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

  getStoreDetail(order_id) {
    return fetch(Config.BASE_URL + '/api/store/' + order_id,
      {
        headers: this.headers
      })
      .then((response) => response.json());
  }
}
