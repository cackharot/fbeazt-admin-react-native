import {
  StyleSheet,
} from 'react-native';

export const styles = StyleSheet.create({
  scene: {
    flex: 1,
    marginTop: 56
  },
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
    borderWidth:0,
    borderRadius:0,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor:"#F5FCFF",
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
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  total: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#268bd2',
    fontFamily: 'roboto'
  },
  customer_address: {

  },
  customer_email: {

  },
  customer_name: {
    fontSize: 18,
    color: '#073642'
  },
  customer_phone: {
    fontSize: 16,
    color: '#586e75'
  },
  customer_pincode: {

  },
  order_status: {

  },
  itemcount: {

  },
  title: {
    fontSize: 20,
    color: '#002b36',
    fontFamily: 'roboto'
  },
  textContainer: {
    flex: 1,
  },
  orderRowContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
  columnContainer: {
    flexDirection: 'column',
    padding: 10
  },
  orderStatusContainer: {
    flexDirection: 'row'
  },
  orderStatusIcon: {
    marginRight: 10
  }
});
