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
  , Button
  , COLOR
  , TYPO
} from 'react-native-material-design';

import Icon from 'react-native-vector-icons/Ionicons';

import { List } from './List';

export class OrderHeading extends Component {
  static propTypes = {
    order: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    Icon.getImageSource('stars', 20, 'red')
      .then((source) => {
        this.setState({ cardIcon: source });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    let {order} = this.props;
    let {cardIcon} = this.state;
    if (!order || !cardIcon) {
      return false;
    }
    let {statusIcon, statusColor} = this.getStatusIcon(order.status.toUpperCase());
    let totalItemQty = order.items.reduce((i, x) => i + x.quantity, 0);
    let defaultStatusColor = '#6c71c4';
    return (
      <Card>
        <Card.Media image={<Image source={cardIcon} />}  overlay>
          <Avatar icon={statusIcon} />
          <Text style={[TYPO.paperFontHeadline, COLOR.paperGrey50]}>
            {order.order_no}
          </Text>
          <Text style={[TYPO.paperSubhead, COLOR.paperGrey50]}>
            <Icon name="md-calendar" /> {this.formatDate(new Date(order.created_at.$date)) }
          </Text>
        </Card.Media>
        <Card.Body>
          <Text style={[TYPO.paperFontTitle, COLOR.paperGrey70]}>
            {order.delivery_details.name}
          </Text>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={[TYPO.paperBody, COLOR.paperGrey70]}>
              <Icon name="md-call" /> {order.delivery_details.phone}
            </Text>
            <Text style={[TYPO.paperBody, COLOR.paperGrey70, { marginLeft: 15 }]}>
              <Icon name="md-mail" /> {order.delivery_details.email}
            </Text>
          </View>
          <Text style={[TYPO.paperBody, COLOR.paperGrey90]}>
            <Icon name="md-locate" /> {order.delivery_details.address}
          </Text>
          <Text style={[TYPO.paperBody, COLOR.paperGrey90]}>
            <Icon name="md-compass" /> {order.delivery_details.landmark} - {order.delivery_details.pincode}
          </Text>
          <Text style={[TYPO.paperFontDisplay1, COLOR.paperTeal500]}>
            {'Rs.' + order.total}
          </Text>
        </Card.Body>
        <Card.Actions position="left">
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch' }}>
            <TouchableOpacity>
              <Icon name="md-cart" size={40} style={[{ backgroundColor: "#fdf6e3", padding: 15, paddingLeft: 40, paddingRight: 40 }, { color: statusColor }]}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="md-cafe" size={40}  style={{ backgroundColor: "#fdf6e3", color: '#6c71c4', padding: 15, paddingLeft: 40, paddingRight: 40 }}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="md-bicycle" size={40}  style={{ backgroundColor: "#fdf6e3", color: '#6c71c4', padding: 15, paddingLeft: 40, paddingRight: 40 }}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="md-checkmark-circle-outline" size={40}  style={{ backgroundColor: "#fdf6e3", color: '#6c71c4', padding: 15, paddingLeft: 40, paddingRight: 40 }}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="md-close-circle" size={40}  style={{ backgroundColor: "#fdf6e3", color: '#6c71c4', padding: 15, paddingLeft: 40 }}/>
            </TouchableOpacity>
          </View>
        </Card.Actions>
      </Card>
    );
  }
  // <Button primary={'paperPink'} text="GO TO GITHUB" onPress={() => false} />

  getStatusIcon(status) {
    switch (status) {
      case 'PENDING':
        return { statusIcon: 'shopping-cart', statusColor: '#859900' };
      case 'PREPARING':
        return { statusIcon: 'schedule', statusColor: '#6c71c4' };
      case 'PROGRESS':
        return { statusIcon: 'motorcycle', statusColor: '#6c71c4' };
      case 'DELIVERED':
        return { statusIcon: 'check-circle', statusColor: '#6c71c4' };
      case 'CANCELLED':
        return { statusIcon: 'highlight-off', statusColor: '#6c71c4' };
      default:
        return { statusIcon: 'stars', statusColor: '#6c71c4' };
    }
  }

  formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
  }
}
