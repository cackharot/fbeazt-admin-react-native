import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  ActivityIndicator,
  InteractionManager,
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
  , TYPO
  , COLOR
} from 'react-native-material-design';

import * as _ from 'lodash';

import InfiniteScrollView from 'react-native-infinite-scroll-view';

import { List } from './List';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../app.styles';

import {OrderService} from '../services/orderservice';
import {OrderDetailsView} from './order-details';
import { OrderHelper, Orderstatus } from '../utils/OrderHelper';

export default class OrderList extends Component {
  static contextTypes = {
    drawer: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id.$oid !== r2._id.$oid });
    this._orders = [];
    this.state = {
      orders: this.ds.cloneWithRows([]),
      isLoading: false,
      canLoadMoreContent: true,
      searchModel: {
        page_no: 1,
        page_size: 8,
        filter_text: '',
        order_status: ''
      }
    };
    this.service = new OrderService();
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    InteractionManager.runAfterInteractions(() => {
      this.loadOrders(null, this.state.searchModel);
    });
  }

  setOrdersState(x) {
    let rows = this._orders.concat(x.items);
    let data = this.ds.cloneWithRows(rows);
    this._orders = rows;
    this.prevUrl = null;
    this.setState({
      isLoading: false,
      orders: data,
      total: x.total,
      searchModel: {
        filter_text: x.filter_text,
        order_status: x.order_status,
        page_size: x.page_size,
        page_no: x.page_no,
      },
      next: x.next,
      previous: x.previous,
      canLoadMoreContent: x.next && x.next.length > 0,
    })
  }

  async loadOrders() {
    if (this.prevUrl && this.prevUrl === this.state.next) {
      console.log('Duplicate request. Ignoring');
      return;
    }
    this.prevUrl = this.state.next;
    try {
      let x = await this.service.getOrders(this.state.next, this.state.searchModel);
      // console.log('received items', x.items.length, x.total);
      if (!x || !x.items) {
        this.setState({
          canLoadMoreContent: false,
          next: null
        })
        return;
      }
      this.setOrdersState(x);
    } catch (e) {
      console.error(e);
      this.setState({
        errorMsg: e,
        canLoadMoreContent: false
      })
    } finally {
      this.setState({ isLoading: false });
    }
  }

  rowPressed(order_id) {
    const { navigator } = this.context;
    let selectedOrder = this._orders.filter(x => x._id.$oid === order_id.$oid)[0];
    let name = '#' + selectedOrder.order_no + ' Details';
    navigator.forward('orderdetails', name, { order_id: selectedOrder._id.$oid });
  }

  renderRow(order, sectionID, rowID) {
    var totalItemQty = order.items.reduce((i, x) => i + x.quantity, 0);
    let dateStr = OrderHelper.formatDate(new Date(order.created_at.$date));
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
    let {statusIcon, statusColor} = OrderHelper.getStatusIcon(order.status.toUpperCase());
    return (
      <TouchableNativeFeedback key={rowID}
        onPress={() => this.rowPressed(order._id) }
        background={TouchableNativeFeedback.Ripple(COLOR.paperPink100.color, false) }>
        <View>
          <List
            primaryText={order.order_no}
            secondaryTextMoreLine={moreMsg}
            captionText={'Rs.' + order.total}
            primaryColor={'#002b36'}
            lines={4}
            style={{}}
            leftAvatar={<Avatar icon={statusIcon} backgroundColor={statusColor}/>}
            captionStyle={[TYPO.paperFontSubhead, COLOR.paperBlueGrey700]}
            />
          <Divider inset={true} style={{ marginTop: 0 }} />
        </View>
      </TouchableNativeFeedback>
    );
  }

  // rightIcon={<Icon name="md-arrow-dropright-circle" style={{ color: COLOR.paperTeal500.color, fontSize: 32 }}/>}

  render() {
    let spinner = this.state.isLoading ?
      (<ActivityIndicator
        color={COLOR.paperIndigo400.color}
        style={[styles.centering, { height: 80 }]}
        size="large"
        />) : (<View/>);
    let {orders} = this.state;
    return (
      <View style={{ flex: 1 }}>
        {spinner}
        <ListView
          renderScrollComponent={props => <InfiniteScrollView {...props} />}
          dataSource={orders}
          enableEmptySections={true}
          renderRow={this.renderRow.bind(this) }
          canLoadMore={this.state.canLoadMoreContent}
          onLoadMoreAsync={this.loadOrders.bind(this) }
          renderLoadingIndicator={() => (
            <ActivityIndicator
              color={COLOR.paperIndigo400.color}
              style={[styles.centering, { height: 80 }]}
              size="large"
              />
          ) }
          renderLoadingErrorIndicator={() => (
            <ActivityIndicator
              color={COLOR.paperRed900.color}
              style={[styles.centering, { height: 80 }]}
              size="large"
              />
          ) }
          />
      </View>
    )
  }
}
