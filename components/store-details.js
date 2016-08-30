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

import Config from 'react-native-config';
import Communications from 'react-native-communications';

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
      })
      .done(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    let spinner = this.state.isLoading ?
      (<ActivityIndicator
        color={COLOR.paperIndigo400.color}
        style={[styles.centering, { height: 80 }]}
        size="large"
        />) : (<View/>);
    let {isLoading, store, dishes} = this.state;
    return (
      <ScrollView style={{ flex: 1 }}>
        {store &&
          this.buildStoreHeading(store)
        }
        {spinner}
        {!isLoading && dishes &&
          <StoreDishesList dishes={dishes}/>
        }
      </ScrollView>
    );
  }

  getStoreImage(item) {
    let image_url = item.getImage();
    if (!image_url || image_url.length == 0) {
      return <Image source={require('../assets/images/bg4.png') }/>;
    } else {
      return <Image source={{ uri: image_url }}/>;
    }
  }

  buildStoreHeading(store) {
    let storeDateStr = DateHelper.formatDate(new Date(store.created_at.$date));
    let isNonVeg = store.food_type.indexOf('non-veg') > -1;
    return (
      <Card>
        <Card.Media image={this.getStoreImage(store) } overlay>
          <Avatar icon="restaurant"
            color={COLOR.paperGrey50.color}
            backgroundColor={isNonVeg ? COLOR.paperRed700.color : COLOR.paperGreen700.color}/>
          <Text style={[TYPO.paperFontHeadline, COLOR.paperGrey50]}>
            {store.name}
          </Text>
          <Text style={[TYPO.paperSubhead, COLOR.paperGrey50]}>
            <Icon name="md-calendar" /> {storeDateStr}
          </Text>
        </Card.Media>
        <Card.Body>
          <Text style={[TYPO.paperFontSubhead, COLOR.paperBlueGrey700]}>{store.contact_name || 'contact name'}</Text>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => Communications.phonecall(store.phone, true) }>
              <Text style={[TYPO.paperSubhead, COLOR.paperGrey90]}>
                <Icon name="md-call" />
                <Text style={{ textDecorationLine: 'underline', color: COLOR.paperLightBlueA700.color }}> {store.phone}</Text>
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[TYPO.paperBody, COLOR.paperGrey90]}>
            <Icon name="md-locate" /> {store.address}
          </Text>
          <Text style={[TYPO.paperBody, COLOR.paperGrey90]}>
            <Icon name="md-images" /> {store.holidays && store.holidays.length > 0 ? store.holidays.join(', ') : 'No holidays'}
          </Text>
          <Text style={[TYPO.paperBody, COLOR.paperGrey90]}>
            <Icon name="md-time" /> {store.open_time} AM - {store.close_time} PM {' '}
             {store.isHoliday() ? (<Text style={[COLOR.googleRed700]}>(holiday)</Text>) : ''}
             {!store.isHoliday() && (store.isOpen() ? (<Text style={[COLOR.googleGreen700]}>(Open)</Text>) : (<Text style={[COLOR.googleRed700]}>(closed)</Text>))}
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
      </Card >
    );
  }
}
