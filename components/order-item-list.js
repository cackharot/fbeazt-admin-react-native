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
  , Divider
  , Card
  , COLOR
  , TYPO
} from 'react-native-material-design';

import { List } from './List';

export class OrderItemList extends Component {
  static propTypes = {
    order: React.PropTypes.object.isRequired,
  };

  render() {
    let {order} = this.props;
    if (!order || !order.items || order.items.length == 0) {
      return false;
    }
    return (
      <View>
        <Subheader text="Items"/>
        {order.items.map((dish, i) => (
          <TouchableOpacity key={i}>
            <List
              primaryText={dish.name}
              secondaryText={dish.store.name}
              captionText={'Rs.' + (dish.price_detail ? dish.price_detail.price : dish.price).toFixed(2).toString() }
              captionStyle={[TYPO.paperFontSubhead, COLOR.paperBlueGrey900]}
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
}

const pstyles = StyleSheet.create({
  compact: {
    height: 30
  }
});
