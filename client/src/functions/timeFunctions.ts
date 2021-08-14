import { addMinutes, getYear, getMonth, getDate, getHours, getMinutes } from 'date-fns';

export const thousandStr = (num: number) => num.toLocaleString('ko-KR');

export const differenceFromSeoul = () => {
  const seoulOffset = 540;
  const clientOffset = new Date().getTimezoneOffset() * -1;
  return clientOffset - seoulOffset;
};

export const makeDate = (year: number, month: number, date: number, hour: number, minute: number) => {
  const _date = new Date(Date.UTC(year, month, date, hour, minute));

  // 서울시간으로 바꿔주기.
  const difference = differenceFromSeoul();
  return addMinutes(_date, difference);
};

// 서버에서 받아온 시간은 서울시간이다. 따라서 내 위치에 맞는 시간으로 변경해주어야 한다.
export const seoulToLocalTime = (date: string) => {
  const temp = date.split('T');

  const _date = temp[0].split('-');
  const yearNum = Number(_date[0]);
  const monthNum = Number(_date[1]);
  const dateNum = Number(_date[2]);

  const _time = temp[1].split(':');
  const hourNum = Number(_time[0]);
  const minuteNum = Number(_time[1]);

  const tempDate = new Date(yearNum, monthNum - 1, dateNum, hourNum, minuteNum);
  // const tempDate = new Date(Date.UTC(yearNum, monthNum, dateNum, hourNum, minuteNum));

  // console.log('tempDate', tempDate);
  // console.log(yearNum, monthNum - 1, dateNum, hourNum, minuteNum);

  const localDate = addMinutes(tempDate, differenceFromSeoul());

  return localDate;
};

// express서버에서 받은 시간을 utc시간으로 자동 변환한다. << 이게아니라 아이폰만 그렇게 바뀌는거고, 그냥 그게 서버로 전송된거였음
// 따라서 변환된 시간으로 db에 요청하게되는데,
// 아래 메소드를 사용하지 않고 그냥 현재시간을 전송하면,
// 내가 요청한시간 (한국기준) -9시간으로 요청이 된다.
export const syncServerRequestTime = (date: Date) => {
  // 여기서도 서울시간으로 요청해 주어야함.
  const difference = differenceFromSeoul();

  return addMinutes(date, difference);
};

export const fixNewDateError = (date: Date) =>
  new Date(Date.UTC(getYear(date), getMonth(date), getDate(date), getHours(date), getMinutes(date)));
