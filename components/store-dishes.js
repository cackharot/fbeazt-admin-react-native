import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {
  Avatar
  , Subheader
  , Button
  , Divider
  , Card
  , COLOR
  , TYPO
} from 'react-native-material-design';

import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/Ionicons';
import { List } from './List';
import {IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';

export class StoreDishesList extends Component {
  static propTypes = {
    dishes: React.PropTypes.array.isRequired,
  };

  getCategories(items) {
    let categories = this.getUnique(items.map(x => x.category));
    return categories;
  }

  getUnique(data) {
    let unique = {};
    let distinct = [];
    data.forEach(function (x) {
      if (!unique[x]) {
        distinct.push(x);
        unique[x] = true;
      }
    });
    return distinct;
  }

  getItems(items, category) {
    return items.filter(x => x.category === category);
  }

  getMaxItemCount(items, categories) {
    let ic = categories.map(x => this.getItems(items, x).length);
    return ic.sort().reverse()[0];
  }

  render() {
    let {dishes} = this.props;
    if (!dishes || dishes.length == 0) {
      return false;
    }
    let categories = this.getCategories(dishes);
    return (
      <View>
        <Subheader text={ 'Menu (' + dishes.length + ')'}/>
        {categories &&
          <IndicatorViewPager
            style={[pstyles.viewPager, { height: (this.getMaxItemCount(dishes, categories) * 80) + 20 }]}
            indicator={this._renderTitleIndicator(dishes, categories) }>
            {categories.map((category, i) => (
              <View key={i} style={pstyles.pageStyle}>
                {this.getItems(dishes, category).map((dish, y) => (
                  <TouchableOpacity key={y}>
                    <List
                      primaryText={dish.name}
                      secondaryText={dish.description || 'no desc'}
                      primaryColor={'#002b36'}
                      captionText={dish.getPriceList() }
                      captionStyle={[TYPO.paperFontSubhead, COLOR.paperTeal600]}
                      leftAvatar={this.getDishImage(dish) }
                      rightIcon={<Avatar icon="local-cafe"
                        color={COLOR.paperGrey50.color}
                        size={30}
                        backgroundColor={dish.isNonVeg() ? COLOR.paperRed700.color : COLOR.paperGreen700.color}/>}
                      />
                    <Divider />
                  </TouchableOpacity>
                )) }
                <Divider />
              </View>
            )) }
          </IndicatorViewPager>
        }
      </View>
    );
  }

  getDishImage(dish) {
    let image_url = dish.getImage();
    if (!image_url || image_url.length == 0) {
      return (<Avatar size={50} borderRadius={5} image={<Image source={require('../assets/images/placeholder.png') }/>}/>);
    } else {
      return (<Avatar size={50} borderRadius={5} image={<Image source={{ uri: image_url }}/>}/>);
    }
  }

  _renderTitleIndicator(dishes, categories) {
    let titles = categories.map(x => x.toUpperCase() + ' (' + this.getItems(dishes, x).length + ')');
    return <PagerTitleIndicator
      style={pstyles.indicatorContainer}
      itemTextStyle={pstyles.indicatorText}
      selectedItemTextStyle={pstyles.indicatorSelectedText}
      selectedBorderStyle={pstyles.selectedBorderStyle}
      titles={titles}
      />;
  }
}

const pstyles = StyleSheet.create({
  compact: {
    height: 30
  },
  viewPager: {
    flex: 1,
    marginTop: 0,
    height: 350
  },
  pageStyle: {
    flex: 1,
    // backgroundColor: COLOR.paperGrey200.color,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: 48,
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // backgroundColor: 0x00000020,
    // backgroundColor: COLOR.paperBlue500.color,
    height: 48
  },
  indicatorText: {
    fontSize: 14,
    // color: 0xFFFFFF99,
    color: COLOR.paperBlue500.color
  },
  indicatorSelectedText: {
    fontSize: 14,
    // color: 0xFFFFFFFF,
    color: COLOR.paperBlue500.color
  },
  selectedBorderStyle: {
    height: 3,
    // backgroundColor: 'white',
    backgroundColor: COLOR.paperBlue500.color,
  },
});
