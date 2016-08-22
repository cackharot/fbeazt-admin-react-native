import React, {Component, PropTypes} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  ScrollView,
  TouchableHighlight,
  ToolbarAndroid
} from 'react-native';

import {
  Checkbox
  , Icon
  , List
  , Ripple
  , Toolbar
  , Button
  , Card
} from 'react-native-material-design';

export class OrderDetailsView extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    order: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    var order = this.props.order;
    var totalItemQty = order.items.reduce((i, x) => i + x.quantity, 0);
    return (
      <View underlayColor='#dddddd'>
        <ToolbarAndroid style={styles.toolbar}
          title={this.props.title}
          navIcon={require('../assets/icons/ic_arrow_back_black_24dp.png') }
          onIconClicked={this.props.navigator.pop}
          titleColor={'#FFFFFF'}/>
        <View>
          <View style={styles.rowContainer}>
            <Text style={styles.order_status}>{order.status.toUpperCase() }</Text>
            <View  style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>{order.order_no}</Text>
              <Text style={styles.customer_name}>{order.delivery_details.name}</Text>
              <Text style={styles.customer_phone}>{order.delivery_details.phone}</Text>
              <Text style={styles.customer_email}>{order.delivery_details.email}</Text>
              <Text style={styles.customer_address}>{order.delivery_details.address}</Text>
              <Text style={styles.customer_pincode}>{order.delivery_details.pincode}</Text>
              <Text style={styles.total}>Rs.{order.total}</Text>
              <Text style={styles.itemcount}>Item Count/Qty: {order.items.length}/{totalItemQty}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  total: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  customer_address: {

  },
  customer_email: {

  },
  customer_name: {
    fontSize: 20
  },
  customer_phone: {
    fontSize: 19
  },
  customer_pincode: {

  },
  order_status: {

  },
  itemcount: {

  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});
