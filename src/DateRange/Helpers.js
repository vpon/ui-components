import moment from 'moment-timezone';
import { t } from '../../utils/Helpers';

moment.tz.link('Asia/Chongqing|Asia/Beijing');

export default {
  getUnixOffset(value, tzName) {
    switch (value.rangeType) {
    case 'custom':
      const time = moment.tz(tzName).valueOf();
      return {
        start_at: value.start_at || time,
        end_at: value.end_at || time
      };
    case 'today':
      return {
        start_at: moment.tz(tzName).startOf('day').valueOf(),
        end_at: moment.tz(tzName).startOf('hour').add(1, 'hours').valueOf()
      };
    case 'yesterday':
      return {
        start_at: moment.tz(tzName).subtract(1, 'days').startOf('day').valueOf(),
        end_at: moment.tz(tzName).subtract(1, 'days').endOf('day').valueOf()
      };
    case 'this_week':
      return {
        start_at: moment.tz(tzName).startOf('week').valueOf(),
        end_at: moment.tz(tzName).startOf('hour').add(1, 'hours').valueOf()
      };
    case 'last_week':
      return {
        start_at: moment.tz(tzName).subtract(7, 'days').startOf('week').valueOf(),
        end_at: moment.tz(tzName).subtract(7, 'days').endOf('week').valueOf()
      };
    case 'last7':
      return {
        start_at: moment.tz(tzName).subtract(7, 'days').startOf('day').valueOf(),
        end_at: moment.tz(tzName).subtract(1, 'days').endOf('day').valueOf()
      };
    case 'last14':
      return {
        start_at: moment.tz(tzName).subtract(14, 'days').startOf('day').valueOf(),
        end_at: moment.tz(tzName).subtract(1, 'days').endOf('day').valueOf()
      };
    case 'this_month':
      return {
        start_at: moment.tz(tzName).startOf('month').valueOf(),
        end_at: moment.tz(tzName).startOf('hour').add(1, 'hours').valueOf()
      };
    case 'last_month':
      return {
        start_at: moment.tz(tzName).startOf('month').subtract(1, 'days').startOf('month').valueOf(),
        end_at: moment.tz(tzName).startOf('month').subtract(1, 'days').endOf('month').valueOf()
      };
    case 'all_time':
      return { start_at: undefined, end_at: undefined };
    default:
    }
  },

  humanizeDateRange(value, tzName, dateFormat) {
    let start_at;
    let end_at;
    switch (value.rangeType) {
    case 'custom':
      if (value.start_at && value.end_at) {
        start_at = moment.tz(value.start_at, tzName).format(dateFormat);
        end_at = moment.tz(value.end_at, tzName).format(dateFormat);
        return `${start_at} - ${end_at}`;
      }
      return t('common:::dateRange::Custom');
    case 'today':
      start_at = moment.tz(tzName).format(dateFormat);
      return `${t('common:::dateRange::Today')} : ${start_at}`;
    case 'yesterday':
      start_at = moment.tz(tzName).subtract(1, 'days').format(dateFormat);
      return `${t('common:::dateRange::Yesterday')} : ${start_at}`;
    case 'this_week':
      return t('common:::dateRange::This Week (Sun - Today)');
    case 'last_week':
      return t('common:::dateRange::Last Week (Sun - Sat)');
    case 'last7':
      return t('common:::dateRange::Last 7 Days');
    case 'last14':
      return t('common:::dateRange::Last 14 Days');
    case 'this_month':
      return t('common:::dateRange::This Month');
    case 'last_month':
      return t('common:::dateRange::Last Month');
    case 'all_time':
      return t('common:::dateRange::All Time');
    default:
    }
  }
};
