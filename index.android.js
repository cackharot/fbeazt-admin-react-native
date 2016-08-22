import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  DeviceEventEmitter,
  TouchableOpacity,
  TouchableHighlight,
  Navigator
} from 'react-native';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import { Avatar, Button, Card } from 'react-native-material-design';

import {OrderList} from './components/order-list';
import {OrderDetailsView} from './components/order-details';

class FbeaztAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }
  componentDidMount() {
    this._setupGoogleSignin();
  }

  render() {
    if (!this.state.user) {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 20 }}>
            Foodbeazt Admin App
          </Text>
          <Text style={{ marginBottom: 30 }}>
            SignIn to start!
          </Text>
          <GoogleSigninButton
            style={{ width: 312, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn.bind(this) }/>
        </View>
      );
    }
    if (this.state.user) {
      return (
        <Navigator
          initialRoute={{ id: 'home' }}
          renderScene={this.navigatorRenderScene}
          />
      );
    }
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'home':
        return (<OrderList
          title='Orders'
          navigator={navigator}
          />);
      case 'orderdetails':
        return (<OrderDetailsView
          navigator={navigator}
          {...route.passProps}
          title={route.title} />);
      case 'back':
        _navigator.pop();
    }
  }
  // <View style={styles.container}>
  //         <Avatar image={<Image source={{ uri: this.state.user.photo }} />} />
  //         <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
  //           Welcome {this.state.user.name}
  //         </Text>
  //         <Text>Your email is: {this.state.user.email}</Text>

  //         <TouchableOpacity onPress={() => { this._signOut(); } }>
  //           <View style={{ marginTop: 50 }}>
  //             <Text>Log out</Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        // scopes: ['https://www.googleapis.com/auth/calendar'],
        webClientId: '280436316587-pc2v79112kdqu0jiruu56m92s8nr4s42.apps.googleusercontent.com',
        offlineAccess: false
      });

      const user = await GoogleSignin.currentUserAsync();
      if (user) {
        console.log(user.email);
      }
      this.setState({ user });
    }
    catch (err) {
      console.log("Play services error", err.code, err.message);
    }
  }

  _signIn() {
    GoogleSignin.signIn()
      .then((user) => {
        console.log(user);
        this.setState({ user: user });
      })
      .catch((err) => {
        console.log('WRONG SIGNIN', err);
      })
      .done();
  }

  _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.setState({ user: null });
    })
      .done();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('fbeaztAdmin', () => FbeaztAdmin);
