import React, {Component, PropTypes} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  InteractionManager
} from 'react-native';

import {
  Avatar
  , Checkbox
  , Subheader
  , Divider
  , IconToggle
  , Ripple
  , Toolbar
  , Button
  , Card
  , COLOR
  , TYPO
} from 'react-native-material-design';

import { List } from './List';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../app.styles';

import {StoreService} from '../services/storeservice';
import { DateHelper } from '../utils/DateHelper';

import {StoreDishesList} from './store-dishes';

export default class StoreDetailsView extends Component {
  static propTypes = {
    store_id: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      store: null,
      dishes: null,
      isLoading: false
    };
    this.service = new StoreService();
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    InteractionManager.runAfterInteractions(() => {
      this.loadStoreDetail();
    });
  }

  loadStoreDetail() {
    this.service.getStoreDetail(this.props.store_id)
      .then(x => {
        // console.log(x);
        this.setState({
          isLoading: false,
          store: x
        })
        return x._id.$oid;
      })
      .then(this.loadDishes.bind(this));
  }

  loadDishes(store_id) {
    this.service.getDishes(store_id)
      .then(x => {
        this.setState({
          dishes: x.items
        })
      });
  }

  render() {
    let spinner = this.state.isLoading ?
      (<ActivityIndicator
        color={COLOR.paperIndigo400.color}
        style={[styles.centering, { height: 80 }]}
        size="large"
        />) : (<View/>);
    let {store, dishes} = this.state;
    return (
      <ScrollView style={{ flex: 1 }}>
        {spinner}
        {store &&
          this.buildStoreHeading(store)
        }
        {dishes &&
          <StoreDishesList dishes={dishes}/>
        }
      </ScrollView>
    );
  }

  buildStoreHeading(store) {
    let storeDateStr = DateHelper.formatDate(new Date(store.created_at.$date));
    return (
      <Card>
        <Card.Media image={<Image source={require('../assets/images/bg4.png') } />}  overlay>
          <Text style={[TYPO.paperFontHeadline, COLOR.paperGrey50]}>
            {store.name}
          </Text>
          <Text style={[TYPO.paperSubhead, COLOR.paperGrey50]}>
            <Icon name="md-calendar" /> {storeDateStr}
          </Text>
        </Card.Media>
        <Card.Body>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={[TYPO.paperSubhead, COLOR.paperGrey70]}>
              <Icon name="md-call" /> {store.phone.trim()}
            </Text>
          </View>
          <Text style={[TYPO.paperBody, COLOR.paperGrey90]}>
            <Icon name="md-locate" /> {store.address.trim()}
          </Text>
          <Text style={[TYPO.paperBody, COLOR.paperGrey90]}>
            <Icon name="md-images" /> {store.holidays.join(', ') }
          </Text>
          <Text style={[TYPO.paperBody, COLOR.paperGrey90]}>
            <Icon name="md-clock" /> {store.open_time} AM - {store.close_time} PM
          </Text>
          <View style={{ flex: 1, marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            {store.cuisines.map((cusine, i) =>
              <TouchableOpacity key={i} style={[{
                borderWidth: 1,
                borderRadius: 5,
                marginRight: 15,
                padding: 10,
                height: 40,
                borderColor: COLOR.paperBlueGrey400.color
              }]}>
                <Text style={[TYPO.paperBody2, COLOR.paperBlueGrey400, { height: 40, textAlign: 'center' }]}>
                  {cusine}
                </Text>
              </TouchableOpacity>
            ) }
          </View>
        </Card.Body>
        <Card.Actions position="left">
          <View/>
        </Card.Actions>
      </Card>
    );
  }
}
