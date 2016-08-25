import React, {Component, PropTypes} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  ScrollView,
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
} from 'react-native-material-design';

import { List } from './List';

import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from '../app.styles';

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
    var spinner = this.state.isLoading ?
      (<ActivityIndicator
        animating={this.state.isLoading}
        style={[styles.centering, { height: 80 }]}
        size="large"
        />) : (<View/>);
    var order = this.state.order;

    var orderDetailView = (<View/>);
    if(order){
      var totalItemQty = order.items.reduce((i, x) => i + x.quantity, 0);
      let orderDate = new Date(order.created_at.$date)
      let dateStr = this.formatDate(orderDate);
      var moreMsg = [
        {
          text: (<Text>{order.delivery_details.name}</Text>),
        },
        {
          text: (<Text><Icon name="md-call" />{order.delivery_details.phone} <Icon name="md-mail" /> {order.delivery_details.email}</Text>)
        },
        {
          text: (<Text><Icon name="md-locate" /> {order.delivery_details.address}</Text>)
        },
        {
          text: (<Text><Icon name="md-compass" /> {order.delivery_details.landmark} - {order.delivery_details.pincode}</Text>)
        },
        {
          text: (<Text><Icon name="md-calendar" /> {dateStr}</Text>)
        }
      ]
      let statusIcon = this.getStatusIcon(order.status.toUpperCase());
      orderDetailView = (<View>
          <List
            key={order._id.$oid}
            keyId={order._id.$oid}
            primaryText={order.order_no}
            secondaryTextMoreLine={moreMsg}
            primaryColor={'#002b36'}
            lines={6}
            captionText={'Rs.' + order.total}
            leftAvatar={<Avatar icon={statusIcon} />}
          />
        <View style={styles.separator}/>
        <View style={{paddingLeft:16}}>
          <Text style={{color:'#002b36'}}>Order status: {order.status}</Text>
          <Text style={{color:'#073642'}}>Payment mode: {(order.payment_type || 'COD').toUpperCase()}</Text>
          <Text style={{color:'#586e75'}}>Payment status: {(order.payment_status || 'PAID').toUpperCase()}</Text>
          <Text>Delivery charges: Rs. {order.delivery_charges}</Text>
        </View>
        <View style={styles.separator}/>
        <Subheader text="Item details"/>
        {order.items.map((dish, i)=> (
          <List
            key={i}
            keyId={dish.no.toString()}
            primaryText={dish.name}
            secondaryText={dish.store.name}
            captionText={'Rs.' + (dish.price_detail ? dish.price_detail.price : dish.price).toFixed(2).toString()}
          />
        ))}
        <View style={styles.separator}/>
      </View>)
    }
    return (
      <View underlayColor='#dddddd'>
        <Icon.ToolbarAndroid style={styles.toolbar}
          navIconName="md-arrow-back"
          title={this.props.title}
          navIcon={require('../assets/icons/ic_arrow_back_black_24dp.png') }
          onIconClicked={this.props.navigator.pop}
          titleColor={'#FFFFFF'}/>
        {spinner}
        {orderDetailView}
      </View>
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
}
