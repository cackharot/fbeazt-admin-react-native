import Config from 'react-native-config';

export class AppConfig {
  static BASE_URL = Config.BASE_URL;
  static STORES_URL = AppConfig.BASE_URL + '/api/stores';
  static STORE_URL = AppConfig.BASE_URL + '/api/store';
  static PRODUCTS_URL = AppConfig.BASE_URL + '/api/products';
  static PRODUCT_URL = AppConfig.BASE_URL + '/api/product';
  static POPULAR_DISHES_URL = AppConfig.BASE_URL + '/api/popular_items';
  static ORDER_URL = AppConfig.BASE_URL + '/api/order';
  static TRACK_URL = AppConfig.BASE_URL + '/api/track';
  static PINCODE_URL = AppConfig.BASE_URL + '/api/pincodes';
  static MY_ORDERS_URL = AppConfig.BASE_URL + '/api/my_orders';

  static ONLINE_PAYMENT_POST_URL = AppConfig.BASE_URL + '/payment/order';

  static isLocalEnv(): boolean {
    return Config.ENV == "dev";
  }

  static getVersionName(): boolean {
    return Config.VERSION_NAME;
  }

  static getProductImage(image_url) {
    return AppConfig.BASE_URL + '/static/images/products/' + image_url;
  }

  static getRestaurantImage(image_url) {
    return AppConfig.BASE_URL + '/static/images/stores/' + image_url;
  }
}
