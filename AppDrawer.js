import React, {PropTypes, Component} from 'react';
import {
  InteractionManager,
  StatusBar,
} from 'react-native';

import Drawer from 'react-native-drawer';
import {Actions, DefaultRenderer} from 'react-native-router-flux';
import {Navigation} from './components/Navigation';
import {COLOR, TYPO} from 'react-native-material-design';
import Icon from 'react-native-vector-icons/Ionicons';

export class AppDrawer extends Component {
  static propTypes = {
    navigationState: PropTypes.object,
    onNavigate: PropTypes.func,
  }

  componentDidMount() {
    Actions.refresh({ key: 'drawer', ref: this.refs.navigation });
  }

  render() {
    const state = this.props.navigationState;
    const children = state.children;
    const navView = React.createElement(Navigation);
    if(!children || children.length == 0){
      console.error("invalid navigation state, no children!!");
      return;
    }
    return (
      <Drawer
        ref="navigation"
        open={state.open}
        onOpen={() => Actions.refresh({ key: state.key, open: true }) }
        onClose={() => {
          try{
            Actions.refresh({ key: state.key, open: false });
          }catch(e){
            console.log(e);
          }
        }}
        type="overlay"
        content={navView}
        tapToClose={true}
        panOpenMask={0.2}
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        negotiatePan={true}
        tweenHandler={(ratio) => ({
          main: { opacity: Math.max(0.54, 1 - ratio) }
        }) }>
        <StatusBar
          backgroundColor={COLOR.paperPink400.color}
          barStyle="light-content"
          />
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </Drawer>
    );
  }
}
