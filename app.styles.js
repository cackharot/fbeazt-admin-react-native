import {
  StyleSheet,
} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  drawer_content_container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    width:300,
    padding: 20
  },
  menu_btn :{
    textAlign: 'left',
    color: '#d33682',
    padding: 10,
    borderWidth: 3,
    borderColor: '#eee',
    borderBottomWidth: 5
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
  toolbar: {
    backgroundColor: '#d33682',
    height: 56,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  total: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  customer_address: {

  },
  customer_email: {

  },
  customer_name: {
    fontSize: 20
  },
  customer_phone: {
    fontSize: 19
  },
  customer_pincode: {

  },
  order_status: {

  },
  itemcount: {

  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});
