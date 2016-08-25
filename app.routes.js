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
    title: 'Stores',
    menu: true,
    icon: 'store'
  },
  Dishes: {
    title: 'Dishes',
    menu: true,
    icon: 'cake'
  },
  popular: {
    title: 'Popular Dishes',
    menu: true,
    icon: 'stars'
  },
  signout: {
    title: 'Log out',
    menu: true,
    icon: 'exit-to-app'
  }
}
