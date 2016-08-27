import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  Alert,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  InteractionManager,
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

import { OrderHelper, Orderstatus } from '../utils/OrderHelper';

import {OrderService} from '../services/orderservice';

export class OrderActions extends Component {
  static propTypes = {
    order: React.PropTypes.object.isRequired,
    onOrderStatusChanged: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.service = new OrderService();
  }

  componentDidMount() {
  }

  updateOrderStatus(toStatus) {
    let {order} = this.props;
    if (!order || order.status === toStatus) {
      return false;
    }

    if (order.status === Orderstatus.DELIVERED || order.status === Orderstatus.CANCELLED) {
      Alert.alert(
        'Attentation!',
        'Cannot change status of DELIVERED/CANCELLED order!!',
        [
          {
            text: 'OK', onPress: () => { }
          },
        ]
      )
      return false;
    }

    if (toStatus === Orderstatus.DELIVERED || toStatus === Orderstatus.CANCELLED) {
      Alert.alert(
        'Attentation',
        'Do you really want to change status to ' + toStatus + '?',
        [
          {
            text: 'Cancel', onPress: () => {
              console.log('Cancel Pressed');
            }, style: 'cancel'
          },
          {
            text: 'OK', onPress: () => {
              this.doUpdateStatus(order, toStatus);
            }
          },
        ]
      )
      return true;
    }

    this.doUpdateStatus(order, toStatus);
  }

  doUpdateStatus(order, toStatus) {
    InteractionManager.runAfterInteractions(() => {
      this.service.updateStatus(order._id.$oid, toStatus)
        .then(x => {
          this.props.order.status = toStatus;
          this.props.onOrderStatusChanged(toStatus);
          ToastAndroid.show('Order status updated!', ToastAndroid.SHORT);
          this.forceUpdate();
        })
        .catch(e => {
          console.error(e);
          ToastAndroid.show('Error!' + e, ToastAndroid.SHORT);
        });
    });
  }

  render() {
    let {order} = this.props;
    if (!order) {
      return false;
    }
    let status = order.status;
    let {statusIcon} = OrderHelper.getStatusIcon(status.toUpperCase());
    return (
      <View style={styles.actionBtnContainer}>
        { status !== Orderstatus.CANCELLED &&
          <TouchableOpacity>
            <View style={[styles.actionBtn, status === Orderstatus.PENDING ? styles.activeBorder : {}]}>
              <Icon name="md-cart" size={30}  style={[this.isActiveStyle(status, Orderstatus.PENDING), this.isDoneStyle(status, Orderstatus.PENDING)]}/>
            </View>
          </TouchableOpacity>
        }
        { status !== Orderstatus.CANCELLED &&
          <TouchableOpacity onPress={this.updateOrderStatus.bind(this, Orderstatus.PREPARING) }>
            <View style={[styles.actionBtn, status === Orderstatus.PREPARING ? styles.activeBorder : {}]}>
              <Icon name="md-time" size={30} style={[this.isActiveStyle(status, Orderstatus.PREPARING), this.isDoneStyle(status, Orderstatus.PREPARING)]}/>
            </View>
          </TouchableOpacity>
        }
        { status !== Orderstatus.CANCELLED &&
          <TouchableOpacity onPress={this.updateOrderStatus.bind(this, Orderstatus.PROGRESS) }>
            <View style={[styles.actionBtn, status === Orderstatus.PROGRESS ? styles.activeBorder : {}]}>
              <Icon name="md-bicycle" size={30} style={[this.isActiveStyle(status, Orderstatus.PROGRESS), this.isDoneStyle(status, Orderstatus.PROGRESS)]}/>
            </View>
          </TouchableOpacity>
        }
        { status !== Orderstatus.CANCELLED &&
          <TouchableOpacity onPress={this.updateOrderStatus.bind(this, Orderstatus.DELIVERED) }>
            <View style={[styles.actionBtn, status === Orderstatus.DELIVERED ? styles.activeBorder : {}]}>
              <Icon name="md-checkmark-circle-outline" size={30} style={[this.isActiveStyle(status, Orderstatus.DELIVERED), this.isDoneStyle(status, Orderstatus.DELIVERED)]}/>
            </View>
          </TouchableOpacity>
        }
        { status !== Orderstatus.DELIVERED &&
          <TouchableOpacity onPress={this.updateOrderStatus.bind(this, Orderstatus.CANCELLED) }>
            <View style={[styles.actionBtn, status === Orderstatus.CANCELLED ? styles.activeBorder : {}]}>
              <Icon name="md-close-circle" size={30} style={[this.isActiveStyle(status, Orderstatus.CANCELLED)]}/>
            </View>
          </TouchableOpacity>
        }
      </View>
    );
  }

  isActiveStyle(status, value) {
    let s = [];
    if (status === value) {
      s.push(styles.activeColor);
      if (status === 'CANCELLED') {
        s.push(styles.cancelled);
      }
    }
    return s;
  }

  isDoneStyle(status, value) {
    let s = {};
    if (status === Orderstatus.PENDING) {
      if (Orderstatus.PENDING === value && status !== value) {
        s = styles.done;
      }
    } else if (status === Orderstatus.PREPARING) {
      if ([Orderstatus.PENDING].findIndex(x => x === value) > -1) {
        s = styles.done;
      }
    } else if (status === Orderstatus.PROGRESS) {
      if ([Orderstatus.PENDING, Orderstatus.PREPARING].findIndex(x => x === value) > -1) {
        s = styles.done;
      }
    } else if (status === Orderstatus.DELIVERED) {
      if ([Orderstatus.PENDING, Orderstatus.PREPARING, Orderstatus.PROGRESS].findIndex(x => x === value) > -1) {
        s = styles.done;
      }
    }
    return s;
  }
}

const styles = StyleSheet.create({
  actionBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    marginBottom: 10,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeBorder: {
    backgroundColor: COLOR.paperAmber300.color,
    borderRadius: 30
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
});
