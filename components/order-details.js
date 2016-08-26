import React, {Component, PropTypes} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  ToolbarAndroid,
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
  , TYPO
} from 'react-native-material-design';

import { List } from './List';

import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../app.styles';

import {OrderService} from '../services/orderservice';

import {OrderHeading} from './order-heading';
import {OrderItemList} from './order-item-list';
import {OrderPayment} from './order-payment';

export default class OrderDetailsView extends Component {
  static propTypes = {
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
    InteractionManager.runAfterInteractions(() => {
      this.loadOrderDetail();
    });
  }

  loadOrderDetail() {
    this.service.getOrderDetail(this.props.order_id).then(x => {
      // console.log(x);
      this.setState({
        isLoading: false,
        order: x
      })
    });
  }

  render() {
    let spinner = this.state.isLoading ?
      (<ActivityIndicator
        animating={this.state.isLoading}
        style={[styles.centering, { height: 80 }]}
        size="large"
        />) : (<View/>);
    let order = this.state.order;
    if (!order) {
      return (<View/>);
    }
    return (
      <ScrollView underlayColor='#dddddd'>
        {spinner}
        <OrderHeading order={order} />
        <OrderItemList order={order} />
        <OrderPayment order={order} />
      </ScrollView>
    );
  }
}
