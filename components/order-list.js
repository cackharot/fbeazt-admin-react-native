import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator,
  InteractionManager
} from 'react-native';

import {
    Avatar
  , Checkbox
  , Subheader
  , Divider
  , IconToggle
  , Ripple
  , Toolbar
  , Button
  , Card
  , COLOR
} from 'react-native-material-design';

import { List } from './List';

import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../app.styles';

import {OrderService} from '../services/orderservice';

import {OrderDetailsView} from './order-details';

import * as _ from 'lodash';

export default class OrderList extends Component {
  static contextTypes = {
    drawer: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id.$oid !== r2._id.$oid });
    this.state = {
      orders: this.ds.cloneWithRows([]),
      _orders: [],
      isLoading: false
    };
    this.service = new OrderService();
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    InteractionManager.runAfterInteractions(() => {
      this.loadOrders();
    });
  }

  loadOrders() {
    this.service.getOrders().then(x => {
      // console.log('received items', x.items.length);
      // console.log(x);
      if(!x || !x.items){
        return;
      }
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
    })
    .catch(e => {
      this.setState({
        isLoading: false,
        errorMsg: e
      })
      console.error(e);
    });
  }

  rowPressed(order_id) {
    const { navigator } = this.context;
    let selectedOrder = this.state._orders.filter(x => x._id.$oid === order_id.$oid)[0];
    let name = '#' + selectedOrder.order_no + ' Details';
    navigator.forward('orderdetails', name, { order_id: selectedOrder._id.$oid });
  }

  formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
  }

  renderRow(order, sectionID, rowID) {
    var totalItemQty = order.items.reduce((i, x) => i + x.quantity, 0);
    let orderDate = new Date(order.created_at.$date)
    let dateStr = this.formatDate(orderDate);
    var moreMsg = [
      {
        text: (<Text>{order.delivery_details.name}  <Icon name="md-call" />{order.delivery_details.phone}</Text>),
      },
      {
        // text: (<Text><Icon name="md-mail" /> {order.delivery_details.email}</Text>)
        text: (<Text><Icon name="md-locate" /> {order.delivery_details.address}</Text>)
      },
      {
        text: (<Text>Items: {order.items.length}/{totalItemQty}, On: {dateStr}</Text>)
      }
    ]
    let statusIcon = this.getStatusIcon(order.status.toUpperCase());
    return (
      <List
        keyId={order._id.$oid}
        primaryText={order.order_no}
        secondaryTextMoreLine={moreMsg}
        captionText={'Rs.' + order.total}
        primaryColor={'#002b36'}
        rightIcon={<Icon name="md-arrow-dropright-circle" style={{color:'#2aa198',fontSize:32}}/>}
        lines={3}
        leftAvatar={<Avatar icon={statusIcon} />}
        onPress={() => this.rowPressed(order._id) }
        onRightIconClicked={() => this.rowPressed(order._id) }
        onLeftIconClicked={() => this.rowPressed(order._id) }
      />
    );
  }

  getStatusIcon(status){
    switch(status){
      case 'PENDING':
        return 'shopping-cart';
      case 'PREPARING':
        return 'schedule';
      case 'PROGRESS':
        return 'motorcycle';
      case 'DELIVERED':
        return 'check-circle';
      case 'CANCELLED':
        return 'highlight-off';
      default:
        return 'stars';
    }
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
        <ScrollView>
          {spinner}
          <ListView
            enableEmptySections={true}
            dataSource={this.state.orders}
            renderRow={this.renderRow.bind(this)}
            />
        </ScrollView>
      </View>
    )
  }
}
