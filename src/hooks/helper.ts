import moment from 'moment';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

export const formatTimeAgo = (time: string) => {
    const n = moment.duration(moment().diff(moment(time)));
        let timeAgoText = "";
        if (n.asSeconds() < 60) {
          timeAgoText = 'vừa đây' // `${n.seconds()} giây trước`;
        } else if (n.asMinutes() < 60) {
          timeAgoText = `${n.minutes()} phút trước`;
        } else if (n.asHours() < 24) {
          timeAgoText = `${n.hours()} giờ trước`;
        } else if (n.asDays() < 30) {
          timeAgoText = `${n.days()} ngày trước`;
        } else if (n.asMonths() < 12) {
          timeAgoText = `${n.months()} tháng trước`;
        } else {
          timeAgoText = `${n.years()} năm trước`;
        }
        return timeAgoText;
}

export const getUserProfileLink = (username: string) => {
    return `memo.vie/${username}`;
}

