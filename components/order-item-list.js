import React, {Component} from 'react';
import {
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
    items: React.PropTypes.array.isRequired,
  };

  render() {
    if (!this.props.items || this.props.items.length == 0) {
      return false;
    }
    return (
      <Card>
        <Card.Body>
          <Subheader text="Items"/>
          {this.props.items.map((dish, i) => (
            <TouchableOpacity key={i}>
              <List
                primaryText={dish.name}
                secondaryText={dish.store.name}
                captionText={'Rs.' + (dish.price_detail ? dish.price_detail.price : dish.price).toFixed(2).toString() }
                />
              <Divider />
            </TouchableOpacity>
          )) }
        </Card.Body>
      </Card>
    );
  }
}
