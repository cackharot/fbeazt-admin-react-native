import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {
  Avatar
  , Subheader
  , Divider
  , Card
  , COLOR
  , TYPO
} from 'react-native-material-design';

import { List } from './List';

export class OrderPayment extends Component {
  static propTypes = {
    order: React.PropTypes.object.isRequired,
  };

  render() {
    let {order} = this.props;
    if (!order) {
      return false;
    }
    if(!order.payment_type){
      order.payment_type = 'cod';
      order.payment_status = 'paid';
    }
    return (
      <Card>
        <Card.Body>
          <List
            primaryText={'Sub Total'}
            captionText={'Rs.' + (order.total - order.delivery_charges)}
            />
          <List
            primaryText={'Delivery charges'}
            captionText={'Rs.' + order.delivery_charges}
            />
          <List
            primaryText={'Total'}
            captionText={'Rs.' + order.total}
            />
          <Divider />
          <Subheader text="Payment"/>
          <List
            primaryText={'Mode'}
            captionText={order.payment_type.toUpperCase()}
            />
          <List
            primaryText={'Status'}
            captionText={order.payment_status.toUpperCase()}
            />
          <Divider />
        </Card.Body>
      </Card>
    );
  }
}
