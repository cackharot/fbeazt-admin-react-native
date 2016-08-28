import React from 'react';
import Config from 'react-native-config';

import {BaseService} from './baseservice';

export class ReportService extends BaseService {
  fetchOrderReports() {
    let url = Config.BASE_URL + '/api/reports/orders';
    console.log('fetching', url);
    return fetch(url,
      {
        headers: this.headers
      })
      .then((response) => response.json());
  }
}
