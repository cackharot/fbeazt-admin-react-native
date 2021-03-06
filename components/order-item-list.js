import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  SectionList,
  ScrollView,
  Modal,
  Alert,
  TouchableOpacity,
  ToastAndroid,
  InteractionManager
} from 'react-native';

import {
  Avatar
  , Subheader
  , Button
  , Divider
  , Card
  , COLOR
  , TYPO
} from 'react-native-material-design';

import Icon from 'react-native-vector-icons/Ionicons';
import { List } from './List';
import {IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
import { Orderstatus } from '../utils/OrderHelper';
import {OrderService} from '../services/orderservice';

export class OrderItemList extends Component {
  static propTypes = {
    order: React.PropTypes.object.isRequired
  };

    constructor(props) {
        super(props);
        this.service = new OrderService();
    }

  getStores(items) {
    let stores = this.getUnique(items.filter(x => x.store && x.store.name).map(x => x.store));
    return stores;
  }

  getUnique(data) {
    let unique = {};
    let distinct = [];
    data.forEach(function (x) {
      if (!unique[x._id.$oid]) {
        distinct.push(x);
        unique[x._id.$oid] = true;
      }
    });
    return distinct;
  }

  getItemPrice(item) {
    return item.quantity * (item.price_detail ? item.price_detail.price : item.price);
  }

  getItems(items, store_id) {
    return items.filter(x => x.store_id.$oid === store_id);
  }

  getMaxItemCount(items, stores) {
    let ic = stores.map(x => this.getItems(items, x._id.$oid).length);
    return ic.sort().reverse()[0];
  }

  render() {
    let {order} = this.props;
    if (!order || !order.items || order.items.length == 0) {
      return false;
    }
    let stores = this.getStores(order.items);
    return (
      <View>
        <Subheader text="Items"/>
        {stores.length > 1 &&
          <IndicatorViewPager
            style={[pstyles.viewPager, { height: (this.getMaxItemCount(order.items, stores) * 80) + 90 }]}
            indicator={this._renderTitleIndicator(order.items, stores) }>
            {stores.map((store, i) => (
              <View key={i} style={pstyles.pageStyle}>
                {this._renderItems(this.getItems(order.items, store._id.$oid)) }
                {this._renderStoreFooter(order, store) }
              </View>
            )) }
          </IndicatorViewPager>
        }
        {stores.length <= 1 && this._renderStoreTitle(stores[0]) }
        {stores.length <= 1 && this._renderItems(order.items) }
        {this._renderFooter(order)}
        {this._renderStoreDeliveryStatus(order)}
      </View>
    );
  }

    _updateStoreOrderStatus(order, store, status) {
        const {store_delivery_status} = order;
        const st = store_delivery_status[store._id.$oid].status;

        if(st === status) {
            ToastAndroid.show('Cannot update to same status - ' + status, ToastAndroid.SHORT);
            return;
        }

        Alert.alert(
            'Attentation',
            'Do you really want to change status to ' + status + '?',
            [
                {
                    text: 'Cancel', onPress: () => {
                        console.log('Cancel Pressed');
                    }, style: 'cancel'
                },
                {
                    text: 'OK', onPress: () => {
                        this.doStoreUpdateStatus(order, store, status);
                    }
                },
            ]
        );
    }

    doStoreUpdateStatus(order, store, status) {
        const {store_delivery_status} = order;
        this.service.updateStoreOrderStatus(order._id.$oid, store._id.$oid, status)
            .then(x=>{
                store_delivery_status[store._id.$oid].status = status;
                ToastAndroid.show('Store Order status updated to ' + status, ToastAndroid.SHORT);
                this.forceUpdate();
            })
            .catch(e=>{
                console.error(e);
                ToastAndroid.show('Error!' + e, ToastAndroid.SHORT);
            });
    }

    _getStoreStatusDisplayName(order, store) {
        const {store_delivery_status} = order;
        const st = store_delivery_status[store._id.$oid].status;
        const displayNames = {
            'PROGRESS': 'READY',
            'DELIVERED': 'PICKED UP'
        };
        return displayNames[st] ? displayNames[st] : st;
    }

    _renderStoreDeliveryStatus(order){
        const {store_delivery_status} = order;
        const stores = this.getStores(order.items);
        return (<View>
                <Subheader text="Store Status"/>
                {!store_delivery_status &&
                 <Text>Not available!</Text>
                }
            {store_delivery_status && stores.map((store, i)=>(
                    <List key={i} primaryText={store.name}
                secondaryText={store_delivery_status[store._id.$oid].no + ' - ' + this._getStoreStatusDisplayName(order, store)}
                captionStyle={[TYPO.paperFontSubhead, COLOR.paperBlueGrey900]}
                rightIcon={<View>
                           {store_delivery_status[store._id.$oid].status === Orderstatus.PROGRESS &&
                            <Button text={"PICKUP"} raised={true} onPress={()=>this._updateStoreOrderStatus(order, store, 'DELIVERED')}/>
                           }
                           {store_delivery_status[store._id.$oid].status === Orderstatus.PENDING &&
                            <Button text={"CANCEL"} raised={true} onPress={()=>this._updateStoreOrderStatus(order, store, 'CANCELLED')}/>
                           }
                           </View>
                          }
                    />
            ))}
        </View>);
    }

  _renderItems(items) {
    return (
      <View>
        {items &&
          items.map((dish, i) => (
            <TouchableOpacity key={i}>
              <List
                primaryText={dish.name}
                secondaryText={(dish.price_detail && dish.price_detail.description ? dish.price_detail.description + ' - ' : '') + dish.category}
                captionText={this._getCurrencySymbol() + this.getItemPrice(dish).toString() }
                captionStyle={[TYPO.paperFontSubhead, COLOR.paperBlueGrey900]}
                rightIcon={<Text>Qty: {dish.quantity.toString() }</Text>}
                />
              <Divider />
            </TouchableOpacity>
          ))
        }
      </View>
    );
  }

  _renderStoreTitle(store) {
    return (
      <View>
        <Subheader style={[TYPO.paperFontSubhead,COLOR.paperTeal800]} text={store.name} />
      </View>
    );
  }

  _renderFooter(order) {
    return (
      <View>
        <List
          primaryText={'Sub Total'}
          captionText={this._getCurrencySymbol() + (order.total - order.delivery_charges) }
          // style={pstyles.compact}
          captionStyle={[TYPO.paperFontSubhead, COLOR.paperDeepOrange900]}
          />
        <List
          primaryText={'Delivery charges'}
          captionText={this._getCurrencySymbol() + order.delivery_charges}
          // style={pstyles.compact}
          captionStyle={[TYPO.paperFontSubhead, COLOR.paperBlueGrey700]}
          />
        <List
          primaryText={'Total'}
          captionText={this._getCurrencySymbol() + order.total}
          // style={pstyles.compact}
          captionStyle={[TYPO.paperFontTitle, COLOR.paperPink500]}
          />
      </View>
    );
  }

  _renderStoreFooter(order, store) {
    let items = this.getItems(order.items, store._id.$oid);
    return (
      <View>
        <List
          primaryText={'Item Count/Quantity'}
          captionText={items.length + '/' + items.reduce((i, x) => i + x.quantity, 0) }
          // style={[pstyles.compact]}
          captionStyle={[TYPO.paperFontSubhead, COLOR.paperTeal800]}
          />
        <List
          primaryText={'Store Total'}
          captionText={this._getCurrencySymbol() + (items.reduce((i, x) => i + this.getItemPrice(x), 0)) }
          // style={[pstyles.compact]}
          captionStyle={[TYPO.paperFontSubhead, COLOR.paperCyan800]}
          />
        <Divider />
      </View>
    );
  }

  _renderTitleIndicator(items, stores) {
    let store_names = stores.map(x => x.name + ' (' + this.getItems(items, x._id.$oid).length + ')');
    return <PagerTitleIndicator
      style={pstyles.indicatorContainer}
      itemTextStyle={pstyles.indicatorText}
      selectedItemTextStyle={pstyles.indicatorSelectedText}
      selectedBorderStyle={pstyles.selectedBorderStyle}
      titles={store_names}
      />;
  }

  _getCurrencySymbol(){
    return '₹';
  }
}

const pstyles = StyleSheet.create({
  compact: {
    height: 30
  },
  viewPager: {
    flex: 1,
    marginTop: 0,
    height: 350
  },
  pageStyle: {
    flex: 1,
    // backgroundColor: COLOR.paperGrey200.color,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: 48,
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // backgroundColor: 0x00000020,
    // backgroundColor: COLOR.paperBlue500.color,
    height: 48
  },
  indicatorText: {
    fontSize: 14,
    // color: 0xFFFFFF99,
    color: COLOR.paperBlue500.color
  },
  indicatorSelectedText: {
    fontSize: 14,
    // color: 0xFFFFFFFF,
    color: COLOR.paperBlue500.color
  },
  selectedBorderStyle: {
    height: 3,
    // backgroundColor: 'white',
    backgroundColor: COLOR.paperBlue500.color,
  },
});
