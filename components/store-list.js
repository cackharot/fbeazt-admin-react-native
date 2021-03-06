import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  ActivityIndicator,
  InteractionManager,
  RefreshControl,
  AsyncStorage,
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
  , TYPO
  , COLOR
} from 'react-native-material-design';

import * as _ from 'lodash';
import Communications from 'react-native-communications';

import InfiniteScrollView from 'react-native-infinite-scroll-view';

import { List } from './List';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../app.styles';

import {StoreService} from '../services/storeservice';
import { DateHelper } from '../utils/DateHelper';
import {Actions} from 'react-native-router-flux';

export default class StoreList extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1._id.$oid !== r2._id.$oid });
    this._stores = [];
    this.prevUrl = null;
    this.state = {
      stores: this.ds.cloneWithRows([]),
      isLoading: false,
      canLoadMoreContent: true,
      next: null,
      searchModel: {
        page_no: 1,
        page_size: 10,
        filter_text: '',
        only_open: false,
      }
    };
    this.service = new StoreService();
  }

  async componentDidMount() {
    this.setState({
      isLoading: true
    });
    let sm = await this.getSearchModel();
    if (sm) {
      console.log('stored search model', sm);
      this.setState({ searchModel: sm });
    }
    InteractionManager.runAfterInteractions(() => {
      this.loadStores();
    });
  }

  setStoreState(x, firstLoad) {
    let rows = firstLoad ? x.items : this._stores.concat(x.items);
    let data = this.ds.cloneWithRows(rows);
    this._stores = rows;
    this.prevUrl = null;
    this.setState({
      isLoading: false,
      stores: data,
      total: x.total,
      searchModel: {
        filter_text: x.filter_text,
        order_status: x.order_status,
        page_size: x.page_size,
        page_no: x.page_no,
      },
      next: x.next,
      previous: x.previous,
      canLoadMoreContent: x.next && x.next.length > 0,
    })
  }

  async loadStores() {
    if (this.prevUrl && this.prevUrl === this.state.next) {
      console.log('Duplicate request. Ignoring');
      return;
    }
    this.prevUrl = this.state.next;
    try {
      let x = await this.service.getStores(this.state.next, this.state.searchModel);
      // console.log('received items', x.items.length, x.total);
      if (!x || !x.items) {
        this.setState({
          canLoadMoreContent: false,
          next: null
        })
        return;
      }
      this.setStoreState(x, this.state.next === null);
    } catch (e) {
      console.error(e);
      this.setState({
        errorMsg: e,
        canLoadMoreContent: false
      })
    } finally {
      this.setState({ isLoading: false });
    }
  }

  rowPressed(store_id) {
    let selectedStore = this._stores.filter(x => x._id.$oid === store_id)[0];
    let name = selectedStore.name + ' Details';
    Actions.storeDetails({ title: name, store_id: selectedStore._id.$oid });
  }

  renderRow(store, sectionID, rowID) {
    var moreMsg = [
      {
        text: (<Text style={[TYPO.paperFontSubhead, COLOR.paperBlueGrey700]}>{store.contact_name || 'contact name'}</Text>)
      },
      {
        text: (
          <Text onPress={() => Communications.phonecall(store.phone, true) }>
            <Icon name="md-call" />
            <Text style={[TYPO.paperSubhead, COLOR.paperLightBlueA700, { textDecorationLine: 'underline' }]}>
              {' ' + store.phone}
            </Text>
            <Text>
              {'  '} <Icon name="md-time" /> {store.open_time} AM - {store.close_time} PM
              {store.isHoliday() ? (<Text style={[COLOR.googleRed700]}>(holiday) </Text>) : ''}
              {!store.isHoliday() && (store.isOpen() ? (<Text style={[COLOR.googleGreen700]}>(Open) </Text>) : (<Text style={[COLOR.googleRed700]}>(closed) </Text>)) }
            </Text>
          </Text>
        )
      },
      {
        text: (<Text><Icon name="md-locate" /> {store.address}</Text>)
      },
    ]
    let isNonVeg = store.food_type.indexOf('non-veg') > -1;
    return (
      <TouchableNativeFeedback key={rowID}
        onPress={() => this.rowPressed(store._id.$oid) }
        background={TouchableNativeFeedback.Ripple(COLOR.paperPink100.color, false) }>
        <View>
          <List
            primaryText={store.name}
            secondaryTextMoreLine={moreMsg}
            lines={4}
            primaryColor={'#002b36'}
            leftAvatar={this.getStoreImage(store) }
            rightIcon={<Avatar icon="restaurant"
              color={COLOR.paperGrey50.color}
              size={30}
              backgroundColor={isNonVeg ? COLOR.paperRed700.color : COLOR.paperGreen700.color}/>}
            />
          <Divider inset={false} style={{ marginTop: 0 }} />
        </View>
      </TouchableNativeFeedback>
    );
  }

  getStoreImage(item) {
    let image_url = item.getImage();
    if (!image_url || image_url.length == 0) {
      return (<Avatar size={50} borderRadius={5} image={<Image source={require('../assets/images/placeholder.png') }/>}/>);
    } else {
      return (<Avatar size={50} borderRadius={5} image={<Image source={{ uri: image_url }}/>}/>);
    }
  }

  render() {
    let {stores, isLoading} = this.state;
    return (
      <View style={{ flex: 1, marginTop: 50 }}>
        {
          this.getFilterView()
        }
        {
          <ListView
            renderScrollComponent={props => <InfiniteScrollView {...props} />}
            refreshControl={
              <RefreshControl
                colors={[COLOR.paperIndigo400.color, COLOR.paperBlue400.color, COLOR.paperPink400.color]}
                refreshing={this.state.isLoading}
                onRefresh={this.searchSubmit.bind(this) }
                />
            }
            dataSource={stores}
            enableEmptySections={true}
            renderRow={this.renderRow.bind(this) }
            canLoadMore={this.state.canLoadMoreContent}
            onLoadMoreAsync={this.loadStores.bind(this) }
            renderLoadingIndicator={() => (
              <ActivityIndicator
                color={COLOR.paperIndigo400.color}
                style={[styles.centering, { height: 80 }]}
                size="large"
                />
            ) }
            renderLoadingErrorIndicator={() => (
              <ActivityIndicator
                color={COLOR.paperRed900.color}
                style={[styles.centering, { height: 80 }]}
                size="large"
                />
            ) }
            />
        }
      </View>
    )
  }

  searchSubmit() {
    let sm = this.state.searchModel;
    sm.page_no = 1;
    this.storeSearchModel(sm);
    this.setState({ next: null, searchModel: sm, isLoading: true });
    InteractionManager.runAfterInteractions(() => {
      this.loadStores();
    });
  }

  async getSearchModel() {
    try {
      let modelStr = await AsyncStorage.getItem('__search__model');
      return JSON.parse(modelStr);
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  storeSearchModel(model) {
    AsyncStorage.setItem('__search__model', JSON.stringify(model)).done();
  }

  getFilterView() {
    return (
      <Card>
        <Card.Body>
          <View style={pstyles.searchContainer}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <TextInput style={pstyles.searchTxt}
                placeholder="Search by name, address, pincode..."
                returnKeyType="search"
                selectTextOnFocus={true}
                selectionColor={COLOR.paperPink300.color}
                placeholderTextColor={COLOR.paperBlueGrey300.color}
                value={this.state.searchModel.filter_text}
                maxLength={100}
                onSubmitEditing={this.searchSubmit.bind(this) }
                onChangeText={(text) => {
                  let sm = this.state.searchModel;
                  sm.filter_text = text.substring(0, 100).trim();
                  this.setState({ searchModel: sm });
                } }
                />
              <TouchableOpacity
                onPress={this.searchSubmit.bind(this) }
                style={pstyles.searchBtn}>
                <Icon name="md-search" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Card.Body>
        <Card.Actions position="left">
          {
            // this.buildFilterIcons()
            <View/>
          }
        </Card.Actions>
      </Card>
    );
  }

  buildFilterIcons() {
    return (
      <View style={pstyles.actionBtnContainer}>
        <TouchableOpacity
          style={[pstyles.actionBtn, true ? pstyles.activeBorder : {}]}>
          <IconToggle
            color={'paperRed'}
            badge={{
              value: 0,
              animated: true,
              backgroundColor: COLOR.paperLightBlueA400.color
            }}
            >
            <Icon name="md-home" size={22} style={{ margin: 16 }} />
          </IconToggle>
        </TouchableOpacity>
      </View>
    );
  }
}


const pstyles = StyleSheet.create({
  actionBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    marginBottom: 8
  },
  actionBtn: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeBorder: {
    backgroundColor: COLOR.paperAmber300.color,
    borderRadius: 30,
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
  searchContainer: {
    alignItems: 'stretch', justifyContent: 'flex-start'
  },
  searchTxt: {
    flex: 1,
    height: 40,
    fontSize: 20,
    padding: 3,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.paperTeal500.color,
  },
  searchBtn: {
    backgroundColor: COLOR.paperBlueGrey700.color,
    borderRadius: 3,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

