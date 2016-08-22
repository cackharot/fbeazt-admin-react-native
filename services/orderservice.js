import React from 'react';
import Config from 'react-native-config';

export class OrderService {
  getOrders() {
    // console.log(Config.BASE_URL + '/api/orders?page_size=10&page_no=1');
    return fetch(Config.BASE_URL + '/api/orders?page_size=10&page_no=1')
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
  }
}
