import React from 'react';

export class OrderService {
 getOrders() {
    return fetch('http://192.168.1.3:4000/api/orders?page_size=10&page_no=1')
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
  }
}
