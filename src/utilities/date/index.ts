import moment from 'moment';

export * from './get-date-colors';

export const getDateFromTimestamp = (timestamp: number) => {
  return new Date((timestamp ?? 0) * 1000).getMilliseconds();
};

export const getDateStringFromTimestamp = (
  timestamp?: number,
  format?: string
) => {
  if (!format) {
    format = 'MM/DD HH:mm';
  }
  return moment((timestamp ?? 0) * 1000).format(format);
};
