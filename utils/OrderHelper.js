import {
  TYPO,
  COLOR
} from 'react-native-material-design';

export class Orderstatus {
  static PENDING = 'PENDING';
  static PREPARING = 'PREPARING';
  static PROGRESS = 'PROGRESS';
  static DELIVERED = 'DELIVERED';
  static CANCELLED = 'CANCELLED';
}

export class OrderHelper {
  static getStatusIcon(status) {
    let st = status.toLowerCase();
    switch (status) {
      case Orderstatus.PENDING:
        return { statusIcon: 'shopping-cart', statusColor: COLOR.paperGrey600.color };
      case Orderstatus.PREPARING:
        return { statusIcon: 'schedule', statusColor: COLOR.paperIndigo400.color };
      case Orderstatus.PROGRESS:
        return { statusIcon: 'motorcycle', statusColor: COLOR.paperPurple400.color };
      case Orderstatus.DELIVERED:
        return { statusIcon: 'check-circle', statusColor: COLOR.paperBlue400.color };
      case Orderstatus.CANCELLED:
        return { statusIcon: 'highlight-off', statusColor: COLOR.paperDeepOrange700.color };
      default:
        return { statusIcon: 'stars', statusColor: COLOR.paperGrey700.color };
    }
  }

  static formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
  }
}
