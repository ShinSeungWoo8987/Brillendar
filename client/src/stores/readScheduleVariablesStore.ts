import { makeVar } from '@apollo/client';

type ScheduleRequestState = {
  id?: string;
  month_start?: number;
  month_end?: number;
};

const initState: ScheduleRequestState = {};

const readScheduleVariablesVar = makeVar<ScheduleRequestState>(initState);

export const changeReadScheduleVariablesVar = (state?: ScheduleRequestState) => {
  if (state) readScheduleVariablesVar(state);
  else readScheduleVariablesVar(initState);
};

export default readScheduleVariablesVar;

// type 1: 스케줄 결과 추가 / 스케줄 삭제
// type 2: 스케줄 결과 삭제 / 스케줄 삭제
