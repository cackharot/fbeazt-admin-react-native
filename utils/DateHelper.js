import moment from 'moment';

export class DateHelper {
  static time_ago(date) {
    return moment(date).utc().calendar();
  }

  static formatDate(date) {
    return moment(date).utc().format('DD/MM/YY LT');
  }
}
