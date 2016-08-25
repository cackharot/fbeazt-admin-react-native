import React, { Component, PropTypes } from 'react';
import { View, Text, Image  } from 'react-native';

import { Avatar, Drawer, Divider, COLOR, TYPO } from 'react-native-material-design';

import {GoogleSignin} from 'react-native-google-signin';

let	routes = require('../app.routes').default;

export class Navigation extends Component {
  static contextTypes = {
    drawer: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      route: null,
      user: null
    }
  }

  componentDidMount() {
    let user = GoogleSignin.currentUser();
    this.setState({user});
  }

  changeScene = (path, name) => {
    const { drawer, navigator } = this.context;
    this.setState({
      route: path
    });
    navigator.to(path, name);
    drawer.closeDrawer();
  };

  render() {
    const { route, user } = this.state;
    console.log(user);
    if(!user){
      return false;
    }
    let menus = [];
    for (const key in routes) {
      let item = routes[key];
      if(!item.menu){
        continue;
      }
      menus.push({
        icon: item.icon,
        value: item.title,
        // label: ' ',
        active: route === key,
        onPress: () => this.changeScene(key),
        onLongPress: () => this.changeScene(key)
      });
    }

    return (
        <Drawer theme='light'>
            <Drawer.Header image={<Image source={require('../assets/images/nav.jpg')} />}>
                <View style={styles.header}>
                    <Avatar size={80} image={<Image source={{ uri: user.photo  }}/>} />
                    <Text style={[styles.text, COLOR.paperGrey50, TYPO.paperFontSubhead]}>
                      {user.name}
                    </Text>
                    <Text style={[COLOR.paperGrey50, TYPO.paperFontCaption]}>
                      {user.email}
                    </Text>
                </View>
            </Drawer.Header>
            <Drawer.Section
                items={menus}
            />
            <Divider style={{ marginTop: 8 }} />
        </Drawer>
      );
  }
}
            // <Drawer.Section
            //     items={[{
            //         icon: 'home',
            //         value: 'Welcome',
            //         active: !route || route === 'welcome',
            //         onPress: () => this.changeScene('welcome'),
            //         onLongPress: () => this.changeScene('welcome')
            //     }]}
            // />
            // <Drawer.Section
            //     title="Log out"
            //     items={[{
            //         icon: 'sigin-out',
            //         value: 'Log out',
            //         label: '0',
            //         active: false,
            //         onPress: () => this.changeScene('signout'),
            //         onLongPress: () => this.changeScene('signout')
            //     }]}
            // />
const styles = {
    header: {
        paddingTop: 16
    },
    text: {
        marginTop: 10
    }
};
