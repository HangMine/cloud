import dayjs from 'dayjs';

const date = (value: string | number | Date | dayjs.Dayjs | undefined, format = 'MM-DD-YYYY') => {
  return value ? dayjs(value).format(format) : '';
};

export default date;
