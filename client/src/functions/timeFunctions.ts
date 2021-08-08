import { addMinutes } from 'date-fns';

export const thousandStr = (num: number) => num.toLocaleString('ko-KR');

/*
DB -> 서버
클라이언트 -> 서버

둘다 Express서버에서 UTC시간으로 바꿔버린다.
이것을 해결하기위해 아래 두 메소드를 이용한다.
*/

// 서버에서 받아온 시간은 UTC시간이다. 따라서 내 위치에 맞는 시간으로 변경해주어야 한다.
export const utcToLocalTime = (date: string) => {
  const temp = date.split('T');

  const _date = temp[0].split('-');
  const yearNum = Number(_date[0]);
  const monthNum = Number(_date[1]);
  const dateNum = Number(_date[2]);

  const _time = temp[1].split(':');
  const hourNum = Number(_time[0]);
  const minuteNum = Number(_time[1]);

  const localDate = new Date(Date.UTC(yearNum, monthNum - 1, dateNum, hourNum, minuteNum));

  return localDate;
};

// express서버에서 받은 시간을 utc시간으로 자동 변환한다.
// 따라서 변환된 시간으로 db에 요청하게되는데,
// 아래 메소드를 사용하지 않고 그냥 현재시간을 전송하면,
// 내가 요청한시간 (한국기준) -9시간으로 요청이 된다.
export const syncServerRequestTime = (date: Date) => {
  const difference = date.getTimezoneOffset() * -1;

  return addMinutes(date, difference);
};
