import { addDays, format, getDate, startOfMonth, startOfWeek, getDaysInMonth, endOfMonth } from 'date-fns';
import { Sun, Mon, Tue, Wed, Thu, Fri, Sat, DayOfTheWeekType } from './dayOfTheWeek';

export type Day = {
  formatted: string;
  date: Date;
  day: number;
};

export const getWeekDays = (date: Date): Day[] => {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // 0: Sunday
  const final = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    final.push({
      formatted: format(date, 'EEE'),
      date,
      day: getDate(date),
    });
  }

  return final;
};

export const getMonthDays = (date: Date): Day[] => {
  const start = startOfMonth(date);
  const num = getDaysInMonth(date);

  const final = [];

  for (let i = 0; i < num; i++) {
    const date = addDays(start, i);
    final.push({
      formatted: format(date, 'EEE'),
      date,
      day: getDate(date),
    });
  }

  return final;
};

export const getWeekArrays = (month: Day[], weekStartsOn: number = 0) => {
  let divide: string = getDayOfTheWeek(weekStartsOn);

  let final: (Day | null)[][] = [];
  let tempWeek: Day[] = [];

  for (let i = 0; i < month.length; i++) {
    if (month[i].formatted === divide && tempWeek.length !== 0) {
      final.push(tempWeek);
      tempWeek = [];
    }

    tempWeek.push(month[i]);
  }

  if (tempWeek.length !== 0) {
    final.push(tempWeek);
    tempWeek = [];
  }

  let finalFirstWeek: Day | null[] = [];
  const firstWeek = final[0];

  for (let i = 0; i < 7 - firstWeek.length; i++) {
    finalFirstWeek.push(null);
  }

  final[0] = [...finalFirstWeek, ...firstWeek];

  ////////

  let finalLastWeek: Day | null[] = [];
  const lastWeek = final[final.length - 1];

  for (let i = 0; i < 7 - lastWeek.length; i++) {
    finalLastWeek.push(null);
  }

  final[final.length - 1] = [...lastWeek, ...finalLastWeek];

  return final;
};

export const getDayOfTheWeekArray = (num: number): DayOfTheWeekType[] => {
  let dayOfTheWeekArray: DayOfTheWeekType[] = [Sun, Mon, Tue, Wed, Thu, Fri, Sat];

  let front = dayOfTheWeekArray.splice(-num);

  return [...front, ...dayOfTheWeekArray];
};

export const getDayOfTheWeek = (weekStartsOn: number): DayOfTheWeekType => {
  switch (weekStartsOn) {
    case 0:
      return Sun;

    case 1:
      return Mon;

    case 2:
      return Tue;

    case 3:
      return Wed;

    case 4:
      return Thu;

    case 5:
      return Fri;

    case 6:
      return Sat;

    default:
      return Sun;
  }
};
