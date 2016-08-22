import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator,
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

import {OrderService} from '../services/orderservice';

import {OrderDetailsView} from './order-details';

import * as _ from 'lodash';

export class OrderList extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    // onForward: React.PropTypes.func.isRequired,
    // onBack: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id.$oid !== r2._id.$oid });
    this.state = {
      orders: this.ds.cloneWithRows([]),
      isLoading: false
    };
    this.service = new OrderService();
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    this.service.getOrders().then(x => {
      // console.log(x);
      var data = this.ds.cloneWithRows(x.items);
      this.setState({
        isLoading: false,
        _orders: x.items,
        orders: data,
        total: x.total,
        page_size: x.page_size,
        page_no: x.page_no,
        next: x.next,
        previous: x.previous,
        order_status: x.order_status,
        filter_text: x.filter_text
      })
    });
  }

  rowPressed(order_id) {
    var selectedOrder = this.state._orders.filter(x => x._id.$oid === order_id.$oid)[0];
    this.props.navigator.push({
      id: 'orderdetails',
      title: '#' + selectedOrder.order_no + ' Details',
      passProps: { order_id: selectedOrder._id.$oid }
    });
  }

  renderRow(order, sectionID, rowID) {
    var totalItemQty = order.items.reduce((i, x) => i + x.quantity, 0);
    return (
      <TouchableHighlight onPress={() => this.rowPressed(order._id) }
        underlayColor='#dddddd'>
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
      </TouchableHighlight>
    );
  }

  render() {
    var spinner = this.state.isLoading ?
      (<ActivityIndicator
        animating={this.state.isLoading}
        style={[styles.centering, { height: 80 }]}
        size="large"
        />) : (<View/>);
    return (
      <ScrollView>
        <ToolbarAndroid style={styles.toolbar}
          title={this.props.title}
          titleColor={'#FFFFFF'}/>
        {spinner}
        <ListView
          dataSource={this.state.orders}
          renderRow={this.renderRow.bind(this) }
          />
      </ScrollView>
    )
  }
}

// <View>
//   <Text>Current Scene: { this.props.title }</Text>
//   <TouchableHighlight onPress={this.props.onForward}>
//     <Text>Tap me to load the next scene</Text>
//   </TouchableHighlight>
//   <TouchableHighlight onPress={this.props.onBack}>
//     <Text>Tap me to go back</Text>
//   </TouchableHighlight>
// </View>

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
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
