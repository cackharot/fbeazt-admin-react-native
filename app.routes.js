import {Actions} from 'react-native-router-flux';

export default {
  welcome: {
    initialRoute: true,
    menu: true,
    title: 'Orders',
    component: require('./components/order-list').default,
    icon: 'shopping-cart',
    children: {
      orderdetails: {
        component: require('./components/order-details').default
      }
    },
    onPress: () => Actions.orderList(),
  },
  orderdetails: {
    title: 'Order details',
    menu: false,
    component: require('./components/order-details').default,
  },
  store: {
    initialRoute: false,
    title: 'Stores',
    menu: true,
    icon: 'store',
    component: require('./components/store-list').default,
    children: {
      storedetails: {
        component: require('./components/store-details').default
      }
    },
    onPress: () => Actions.storeList(),
  },
  payments: {
    title: 'Online payments',
    menu: true,
    icon: 'attach-money',
  },
  popular: {
    title: 'Popular Dishes',
    menu: true,
    icon: 'stars'
  },
  pincode: {
    title: 'Pincode',
    menu: true,
    icon: 'room'
  },
  sms: {
    title: 'SMS',
    menu: true,
    icon: 'message'
  },
  signout: {
    title: 'Sign Out',
    menu: true,
    icon: 'exit-to-app',
    component: require('./components/signout').default,
  }
}
