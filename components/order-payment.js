import React, {Component} from 'react';
import {
  StyleSheet,
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
    if (!order.payment_status) {
      order.payment_status = 'unknown';
    }
    return (
      <View>
        <Subheader text="Payment"/>
        <List
          primaryText={'Mode'}
          captionText={order.payment_type.toUpperCase() }
          // style={pstyles.compact}
          />
        <List
          primaryText={'Status'}
          captionText={order.payment_status.toUpperCase() }
          // style={pstyles.compact}
          />
        <Divider />
      </View>
    );
  }
}

const pstyles = StyleSheet.create({
  compact: {
    height: 30
  }
});
