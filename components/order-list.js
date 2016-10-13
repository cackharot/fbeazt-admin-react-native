import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  ActivityIndicator,
  InteractionManager,
  RefreshControl,
  AsyncStorage,
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
import Communications from 'react-native-communications';

import InfiniteScrollView from 'react-native-infinite-scroll-view';

import { List } from './List';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../app.styles';

import {OrderService} from '../services/orderservice';
import {ReportService} from '../services/reportservice';
import {OrderDetailsView} from './order-details';
import { OrderHelper, Orderstatus } from '../utils/OrderHelper';
import { DateHelper } from '../utils/DateHelper';

import {Actions} from 'react-native-router-flux';

export default class OrderList extends Component {
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
        page_size: 25,
        filter_text: '',
        order_status: '',
      },
      orderStatus: {
        pending: false,
        preparing: false,
        progress: false,
        delivered: false,
        cancelled: false,
      },
      reports: {
        total: 0,
        pending: 0,
        preparing: 0,
        progress: 0,
        delivered: 0,
        cancelled: 0,
      }
    };
    this.service = new OrderService();
    this.reportService = new ReportService();
  }

  async componentDidMount() {
    this.setState({
      isLoading: true
    });
    let sm = await this.getSearchModel();
    if (sm) {
      console.log('stored search model', sm);
      this.setState({ searchModel: sm });
    }
    InteractionManager.runAfterInteractions(() => {
      this.loadOrders();
      this.loadReports();
    });
  }

  setOrdersState(x, firstLoad) {
    let rows = firstLoad ? x.items : this._orders.concat(x.items);
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
    let st = x.order_status || [];
    this.setState({
      orderStatus: {
        pending: st.indexOf(Orderstatus.PENDING) > -1,
        preparing: st.indexOf(Orderstatus.PREPARING) > -1,
        progress: st.indexOf(Orderstatus.PROGRESS) > -1,
        delivered: st.indexOf(Orderstatus.DELIVERED) > -1,
        cancelled: st.indexOf(Orderstatus.CANCELLED) > -1,
      }
    });
  }

  async loadOrders() {
    if (this.prevUrl && this.prevUrl === this.state.next) {
      console.log('Duplicate request. Ignoring');
      return;
    }
    this.prevUrl = this.state.next;
    try {
      let x = await this.service.getOrders(this.state.next, this.state.searchModel);
      console.log('received orders items', x.items.length, x.total);
      if (!x || !x.items) {
        this.setState({
          canLoadMoreContent: false,
          next: null
        })
        return;
      }
      this.setOrdersState(x, this.state.next === null);
    } catch (e) {
      console.error("error while loading orders")
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
    let selectedOrder = this._orders.filter(x => x._id.$oid === order_id.$oid)[0];
    let name = '#' + selectedOrder.order_no + ' Details';
    Actions.orderDetails({ title: name, order_id: selectedOrder._id.$oid });
  }

  renderRow(order, sectionID, rowID) {
    var totalItemQty = order.items.reduce((i, x) => i + x.quantity, 0);
    let dateStr = DateHelper.time_ago(new Date(order.created_at.$date));
    var moreMsg = [
      {
        text: (
          <Text>
            {order.delivery_details.name + '  '}
            <Icon name="md-call" />
            <Text onPress={() => Communications.phonecall(store.phone, true) }
              style={[TYPO.paperSubhead, COLOR.paperLightBlueA700, { textDecorationLine: 'underline' }]}>
              {order.delivery_details.phone}
            </Text>
          </Text>
        ),
      },
      {
        // text: (<Text><Icon name="md-mail" /> {order.delivery_details.email}</Text>)
        text: (<Text><Icon name="md-locate" /> {order.delivery_details.address}</Text>)
      },
      {
        text: (<Text>Items: {order.items.length}/{totalItemQty}, <Icon name="md-calendar" /> {dateStr}</Text>)
      }
    ]
    let {statusIcon, statusColor} = OrderHelper.getStatusIcon(order.status.toUpperCase());
    if(order.otp_status && order.otp_status != 'VERIFIED') {
      statusIcon = "info";
    }
    return (
      <TouchableNativeFeedback key={rowID}
        onPress={() => this.rowPressed(order._id) }
        background={TouchableNativeFeedback.Ripple(COLOR.paperPink100.color, false) }>
        <View>
          <List
            primaryText={order.order_no}
            secondaryTextMoreLine={moreMsg}
            captionText={'₹' + order.total}
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

  render() {
    let {orders, isLoading} = this.state;
    let spinner = isLoading ?
      (<ActivityIndicator
        color={COLOR.paperIndigo400.color}
        style={[styles.centering, { height: 80 }]}
        size="large"
        />) : (<View/>);
    return (
      <View style={{ flex: 1, marginTop: 50 }}>
        {
          this.getFilterView()
        }
        {
          <ListView
            renderScrollComponent={props => <InfiniteScrollView {...props} />}
            refreshControl={
              <RefreshControl
                colors={[COLOR.paperIndigo400.color, COLOR.paperBlue400.color, COLOR.paperPink400.color]}
                refreshing={this.state.isLoading}
                onRefresh={this.searchSubmit.bind(this) }
                />
            }
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
        }
      </View>
    )
  }

  searchSubmit() {
    let sm = this.state.searchModel;
    sm.page_no = 1;
    this.storeSearchModel(sm);
    this.setState({ next: null, searchModel: sm, isLoading: true });
    InteractionManager.runAfterInteractions(() => {
      this.loadOrders();
      this.loadReports();
    });
  }

  async getSearchModel() {
    try {
      let modelStr = await AsyncStorage.getItem('__search__model');
      return JSON.parse(modelStr);
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  storeSearchModel(model) {
    AsyncStorage.setItem('__search__model', JSON.stringify(model)).done();
  }

  getFilterView() {
    return (
      <Card>
        <Card.Body>
          <View style={pstyles.searchContainer}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <TextInput style={pstyles.searchTxt}
                placeholder="Search phone, email, order no..."
                returnKeyType="search"
                selectTextOnFocus={true}
                selectionColor={COLOR.paperPink300.color}
                placeholderTextColor={COLOR.paperBlueGrey300.color}
                value={this.state.searchModel.filter_text}
                maxLength={100}
                onSubmitEditing={this.searchSubmit.bind(this) }
                onChangeText={(text) => {
                  let sm = this.state.searchModel;
                  sm.filter_text = text.substring(0, 100).trim();
                  this.setState({ searchModel: sm });
                } }
                />
              <TouchableOpacity
                onPress={this.searchSubmit.bind(this) }
                style={pstyles.searchBtn}>
                <Icon name="md-search" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Card.Body>
        <Card.Actions position="left">
          {
            this.buildFilterIcons()
          }
        </Card.Actions>
      </Card>
    );
  }

  buildFilterIcons() {
    let {pending, preparing, progress, delivered, cancelled} = this.state.orderStatus;
    return (
      <View style={pstyles.actionBtnContainer}>
        <TouchableOpacity
          style={[pstyles.actionBtn, pending ? pstyles.activeBorder : {}]}
          onPress={this.updateFilterOrderStatus.bind(this, 'pending') }>
          <IconToggle
            onPress={this.updateFilterOrderStatus.bind(this, 'pending') }
            color={'paperRed'}
            badge={{
              value: this.state.reports.pending,
              animated: true,
              backgroundColor: COLOR.paperLightBlueA400.color
            }}
            >
            <Icon name="md-cart" size={22} style={{ margin: 16 }} />
          </IconToggle>
        </TouchableOpacity>
        <TouchableOpacity
          style={[pstyles.actionBtn, preparing ? pstyles.activeBorder : {}]}
          onPress={this.updateFilterOrderStatus.bind(this, 'preparing') }>
          <IconToggle
            onPress={this.updateFilterOrderStatus.bind(this, 'preparing') }
            color={'paperRed'}
            badge={{
              value: this.state.reports.preparing,
              animated: true,
              backgroundColor: COLOR.paperIndigoA400.color
            }}
            >
            <Icon name="md-time" size={22} style={{ margin: 16 }} />
          </IconToggle>
        </TouchableOpacity>
        <TouchableOpacity
          style={[pstyles.actionBtn, progress ? pstyles.activeBorder : {}]}
          onPress={this.updateFilterOrderStatus.bind(this, 'progress') }>
          <IconToggle
            onPress={this.updateFilterOrderStatus.bind(this, 'progress') }
            color={'paperRed'}
            badge={{
              value: this.state.reports.progress,
              animated: true,
              backgroundColor: COLOR.paperPurple400.color
            }}
            >
            <Icon name="md-bicycle" size={22} style={{ margin: 16 }} />
          </IconToggle>
        </TouchableOpacity>
        <TouchableOpacity
          style={[pstyles.actionBtn, delivered ? pstyles.activeBorder : {}]}
          onPress={this.updateFilterOrderStatus.bind(this, 'delivered') }>
          <IconToggle
            onPress={this.updateFilterOrderStatus.bind(this, 'delivered') }
            color={'paperRed'}
            badge={{
              value: this.state.reports.delivered,
              animated: true,
              backgroundColor: COLOR.paperGreenA700.color
            }}
            >
            <Icon name="md-checkmark-circle-outline" size={22} style={{ margin: 16 }} />
          </IconToggle>
        </TouchableOpacity>
        <TouchableOpacity
          style={[pstyles.actionBtn, cancelled ? pstyles.activeBorder : {}]}
          onPress={this.updateFilterOrderStatus.bind(this, 'cancelled') }>
          <IconToggle
            onPress={this.updateFilterOrderStatus.bind(this, 'cancelled') }
            color={'paperRed'}
            badge={{
              value: this.state.reports.cancelled,
              animated: true,
            }}
            >
            <Icon name="md-close-circle" size={22} style={{ margin: 16 }} />
          </IconToggle>
        </TouchableOpacity>
      </View>
    );
  }

  updateFilterOrderStatus(key) {
    let model = this.state.orderStatus;
    let sm = this.state.searchModel;
    let os = sm.order_status || [];
    let v = model[key];
    model[key] = !v;
    let idx = os.indexOf(key.toUpperCase());
    if (v === false && idx === -1) {
      os.push(key.toUpperCase());
    } else if (v === true && idx > -1) {
      os.splice(idx, 1);
    }
    sm.order_status = os;
    this.setState({
      orderStatus: model,
      searchModel: sm
    });
  }

  loadReports() {
    this.reportService.fetchOrderReports()
      .then(x => {
        this.setState({
          reports: x
        });
      })
      .catch(e => {
        console.log(e);
      });
  }
}


const pstyles = StyleSheet.create({
  actionBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    marginBottom: 8
  },
  actionBtn: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeBorder: {
    backgroundColor: COLOR.paperAmber300.color,
    borderRadius: 30,
  },
  activeColor: {
    color: COLOR.paperGrey50.color,
  },
  done: {
    color: COLOR.paperGreen700.color,
  },
  cancelled: {
    color: COLOR.paperRed700.color,
  },
  searchContainer: {
    alignItems: 'stretch', justifyContent: 'flex-start'
  },
  searchTxt: {
    flex: 1,
    height: 40,
    fontSize: 20,
    padding: 3,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.paperTeal500.color,
  },
  searchBtn: {
    backgroundColor: COLOR.paperBlueGrey700.color,
    borderRadius: 3,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

