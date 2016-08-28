import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
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

export class OrderItemList extends Component {
  static propTypes = {
    order: React.PropTypes.object.isRequired,
  };

  getStores(items) {
    let stores = this.getUnique(items.filter(x => x.store && x.store.name).map(x => x.store));
    return stores;
  }

  getUnique(data: any[]) {
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
            style={[pstyles.viewPager, { height: (this.getMaxItemCount(order.items, stores) * 80) + 70 }]}
            indicator={this._renderTitleIndicator(order.items, stores) }>
            {stores.map((store, i) => (
              <View key={i} style={pstyles.pageStyle}>
                {this.getItems(order.items, store._id.$oid).map((dish, i) => (
                  <TouchableOpacity key={i}>
                    <List
                      style={{}}
                      primaryText={dish.name}
                      secondaryText={(dish.price_detail && dish.price_detail.description ? dish.price_detail.description + ' - ' : '') + dish.category}
                      captionText={'Rs.' + this.getItemPrice(dish).toString() }
                      captionStyle={[TYPO.paperFontSubhead, COLOR.paperBlueGrey900]}
                      rightIcon={<Text>Qty: {dish.quantity.toString() }</Text>}
                      />
                    <Divider />
                  </TouchableOpacity>
                )) }
                <List
                  primaryText={'Item Count/Quantity'}
                  captionText={this.getItems(order.items, store._id.$oid).length + '/' + this.getItems(order.items, store._id.$oid).reduce((i, x) => i + x.quantity, 0) }
                  style={pstyles.compact}
                  captionStyle={[TYPO.paperFontSubhead, COLOR.paperTeal800]}
                  />
                <List
                  primaryText={'Store Total'}
                  captionText={'Rs.' + (this.getItems(order.items, store._id.$oid).reduce((i, x) => i + this.getItemPrice(x), 0)) }
                  style={pstyles.compact}
                  captionStyle={[TYPO.paperFontSubhead, COLOR.paperCyan800]}
                  />
                <Divider />
              </View>
            )) }
          </IndicatorViewPager>
        }
        {stores.length <= 1 &&
          order.items.map((dish, i) => (
            <TouchableOpacity key={i}>
              <List
                style={{}}
                primaryText={dish.name}
                secondaryText={(dish.price_detail && dish.price_detail.description ? dish.price_detail.description + ' - ' : '') + dish.category}
                captionText={'Rs.' + this.getItemPrice(dish).toString() }
                captionStyle={[TYPO.paperFontSubhead, COLOR.paperBlueGrey900]}
                rightIcon={<Text>Qty: {dish.quantity.toString() }</Text>}
                />
              <Divider />
            </TouchableOpacity>
          )) }
        <List
          primaryText={'Sub Total'}
          captionText={'Rs.' + (order.total - order.delivery_charges) }
          style={pstyles.compact}
          captionStyle={[TYPO.paperFontSubhead, COLOR.paperDeepOrange900]}
          />
        <List
          primaryText={'Delivery charges'}
          captionText={'Rs.' + order.delivery_charges}
          style={pstyles.compact}
          captionStyle={[TYPO.paperFontSubhead, COLOR.paperBlueGrey700]}
          />
        <List
          primaryText={'Total'}
          captionText={'Rs.' + order.total}
          style={pstyles.compact}
          captionStyle={[TYPO.paperFontTitle, COLOR.paperPink500]}
          />
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
