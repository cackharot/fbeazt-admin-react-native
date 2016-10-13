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

import Communications from 'react-native-communications';
import Icon from 'react-native-vector-icons/Ionicons';

import { List } from './List';
import { OrderActions } from './order-actions';

import { OrderHelper, Orderstatus } from '../utils/OrderHelper';
import { DateHelper } from '../utils/DateHelper';

export class OrderHeading extends Component {
  static propTypes = {
    order: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    let {order} = this.props;
    if (!order) {
      return false;
    }
    let orderDateStr = DateHelper.formatDate(new Date(order.created_at.$date));
    let {statusIcon, statusColor} = OrderHelper.getStatusIcon(order.status.toUpperCase());
    if(order.otp_status && order.otp_status != 'VERIFIED') {
      statusIcon = "info";
    }
    let totalItemQty = order.items.reduce((i, x) => i + x.quantity, 0);
    return (
      <Card>
        <Card.Media image={<Image source={require('../assets/images/bg2.jpg') } />}  overlay>
          <Avatar icon={statusIcon}  backgroundColor={statusColor}/>
          <Text style={[TYPO.paperFontHeadline, COLOR.paperGrey50]}>
            {order.order_no}
          </Text>
          <Text style={[TYPO.paperSubhead, COLOR.paperGrey50]}>
            <Icon name="md-calendar" /> {orderDateStr}
          </Text>
        </Card.Media>
        <Card.Body>
          <Text style={[TYPO.paperFontTitle, COLOR.paperGrey70]}>
            {order.delivery_details.name}
          </Text>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => Communications.phonecall(store.phone, true) }>
              <Text style={[TYPO.paperBody, COLOR.paperGrey70]}>
                <Icon name="md-call" />
                <Text style={{ textDecorationLine: 'underline', color: COLOR.paperLightBlueA700.color }}>
                  {order.delivery_details.phone}
                </Text>
              </Text>
            </TouchableOpacity>
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
            {'₹' + order.total}
          </Text>
          {order.otp_status != 'VERIFIED' &&
            <Text style={[COLOR.paperRed200]}>OTP not verified!</Text>
          }
        </Card.Body>
        <Card.Actions position="left">
          <OrderActions order={order} onOrderStatusChanged={(st) => {
            this.props.order.status = st;
            this.forceUpdate();
          } }/>
        </Card.Actions>
      </Card>
    );
  }
}
