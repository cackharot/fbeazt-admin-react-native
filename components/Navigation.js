import React, { Component, PropTypes } from 'react';
import { View, Text, Image  } from 'react-native';
import {Actions} from 'react-native-router-flux';
import { Avatar, Drawer, Divider, COLOR, TYPO } from 'react-native-material-design';

import {GoogleSignin} from 'react-native-google-signin';

let routes = require('../app.routes').default;

export class Navigation extends Component {
  static contextTypes = { drawer: React.PropTypes.object }

  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }

  componentDidMount() {
    let user = GoogleSignin.currentUser();
    this.setState({ user });
  }

  render() {
    const { route, user } = this.state;
    if (!user) {
      return false;
    }
    let menus = [];
    for (const key in routes) {
      let item = routes[key];
      if (!item.menu) {
        continue;
      }
      menus.push({
        icon: item.icon,
        value: item.title,
        // label: ' ',
        active: route === key,
        onPress: () => {
          this.context.drawer.close();
          // console.log("Menu press", key);
          if (item.onPress) {
            item.onPress();
          }
        },
      });
    }

    return (
      <Drawer theme='light'>
        <Drawer.Header image={<Image source={require('../assets/images/bg3.jpg') } />}>
          <View style={styles.header}>
            <Avatar size={80} image={<Image source={{ uri: user.photo }}/>} />
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

const styles = {
  header: {
    paddingTop: 16
  },
  text: {
    marginTop: 10
  }
};
