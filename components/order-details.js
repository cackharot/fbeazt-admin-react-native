import React, {Component, PropTypes} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  ScrollView,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator
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

export class OrderDetailsView extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    order_id: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      order: null,
      isLoading: false
    };
    this.service = new OrderService();
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    this.service.getOrderDetail(this.props.order_id).then(x => {
      // console.log(x);
      this.setState({
        isLoading: false,
        order: x
      })
    });
  }

  render() {
    var spinner = this.state.isLoading ?
      (<ActivityIndicator
        animating={this.state.isLoading}
        style={[styles.centering, { height: 80 }]}
        size="large"
        />) : (<View/>);
    var order = this.state.order;
    var orderDetailView = order ?
      (<View>
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
            <Text style={styles.itemcount}>Item Count/Qty: {order.items.length}/{order.items.reduce((i, x) => i + x.quantity, 0)}</Text>
          </View>
        </View>
        <View style={styles.separator}/>
      </View>) : (<View/>);
    return (
      <View underlayColor='#dddddd'>
        <ToolbarAndroid style={styles.toolbar}
          title={this.props.title}
          navIcon={require('../assets/icons/ic_arrow_back_black_24dp.png') }
          onIconClicked={this.props.navigator.pop}
          titleColor={'#FFFFFF'}/>
        {spinner}
        {orderDetailView}
      </View>
    );
  }
}


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
