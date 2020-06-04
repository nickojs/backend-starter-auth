const moment = require('moment');

const expirationDates = (expiration) => {
  const startTime = moment();
  const expiresIn = moment().add(1, 'hour');
  const diff = expiration
    ? moment.duration(moment(expiration).diff(startTime))
    : moment.duration(expiresIn.diff(startTime));

  const timeDiff = {
    seconds: diff.get('seconds'),
    minutes: diff.get('minutes'),
    hours: diff.get('hours')
  };

  const timeSulfix = {
    hours: timeDiff.hours > 1 ? 'hours' : 'hour',
    minutes: timeDiff.minutes > 1 ? 'minutes' : 'minute',
    seconds: timeDiff.seconds > 1 ? 'seconds' : 'second'
  };

  const dateLimits = {
    init: startTime.toDate(),
    expiration: expiresIn.toDate()
  };

  return [dateLimits, timeDiff, timeSulfix];
};

const expirationMessage = (diff, sulfix) => {
  let hours = '';
  if (diff.hours > 0) {
    hours = `${diff.hours} ${sulfix.hours}, `;
  }

  return `Your token expires in ${hours
  }${diff.minutes} ${sulfix.minutes
  } and ${diff.seconds} ${sulfix.seconds}.`;
};

const isExpired = (expiration) => moment() > moment(expiration);

module.exports = {
  expirationDates,
  expirationMessage,
  isExpired
};
