import React from 'react';
import Config from 'react-native-config';

import {BaseService} from './baseservice';

import {Product} from '../model/product';
import {Restaurant} from '../model/restaurant';

export class StoreService extends BaseService {
  getStores(nextUrl, searchModel) {
    let sm = Object.assign({}, searchModel);
    if (sm.order_status && sm.order_status.length > 0) {
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
      .then((response) => response.json())
      .then((data) => {
        if (data && data.items && data.items.length > 0) {
          data.items = data.items.map(x => Restaurant.of(x));
        }
        return data;
      });
  }

  getStoreDetail(order_id) {
    let url = Config.BASE_URL + '/api/store/' + order_id;
    console.log('fetching', url);
    return fetch(url,
      {
        headers: this.headers
      })
      .then((response) => response.json())
      .then((data)=>{
        if(data && data._id){
          data = Restaurant.of(data);
        }
        return data;
      });
  }

  getDishes(store_id) {
    let url = Config.BASE_URL + '/api/products/' + store_id;
    console.log('fetching', url);
    return fetch(url,
      {
        headers: this.headers
      })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.items && data.items.length > 0) {
          data.items = data.items.map(x => Product.of(x));
        }
        return data;
      });
  }
}
