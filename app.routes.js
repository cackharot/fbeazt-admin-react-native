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
    }
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
  },
  dishes: {
    title: 'Dishes',
    menu: true,
    icon: 'cake',
  },
  popular: {
    title: 'Popular Dishes',
    menu: true,
    icon: 'stars'
  },
  signout: {
    title: 'Sign Out',
    menu: true,
    icon: 'exit-to-app',
    component: require('./components/signout').default,
  }
}
