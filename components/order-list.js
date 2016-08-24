import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';

import {
    Avatar
  , Checkbox
  , List
  , Ripple
  , Toolbar
  , Button
  , Card
} from 'react-native-material-design';

import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../app.styles';

import {OrderService} from '../services/orderservice';

import {OrderDetailsView} from './order-details';

import * as _ from 'lodash';

export class OrderList extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    openDrawer: React.PropTypes.func.isRequired
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
          <View style={styles.orderRowContainer}>
            <Avatar backgroundColor="#859900" color="#859900" icon="star" size={32}
              style={{alignItems: 'center', textAlign:'center', justifyContent: 'center',flex:1}} />
            <View style={{flexDirection:'column',flex:4}}>
              <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>{order.order_no}</Text>
                <Text style={styles.customer_name}>{order.delivery_details.name}</Text>
                <Text style={styles.customer_phone}>{order.delivery_details.phone}</Text>
                <Text style={styles.customer_email}>{order.delivery_details.email}</Text>
                <Text style={styles.customer_address}>{order.delivery_details.address}</Text>
                <Text style={styles.customer_pincode}>{order.delivery_details.pincode}</Text>
                <Text style={styles.total}>Rs.{order.total}</Text>
              </View>
              <View style={styles.orderStatusContainer}>
                <Icon size={32} style={styles.orderStatusIcon} color="#859900" name="md-cart"/>
                <Icon size={32} style={styles.orderStatusIcon} color="#859900" name="md-cafe"/>
                <Icon size={32} style={styles.orderStatusIcon} color="#859900" name="md-bicycle"/>
                <Icon size={32} style={styles.orderStatusIcon} color="#859900" name="md-checkbox"/>
                <Icon size={32} style={styles.orderStatusIcon} color="#859900" name="md-checkmark-circle-outline"/>
              </View>
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
      <View>
        <Icon.ToolbarAndroid style={styles.toolbar}
          navIconName="md-menu"
          title={this.props.title}
          onIconClicked={this.props.openDrawer}
          titleColor={'#FFFFFF'}/>
        {spinner}
        <ScrollView>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.orders}
            renderRow={this.renderRow.bind(this) }
            />
        </ScrollView>
      </View>
    )
  }
}
