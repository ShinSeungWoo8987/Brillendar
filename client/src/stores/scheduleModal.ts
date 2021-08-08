import { makeVar } from '@apollo/client';

type ModalState = {
  mongo_id?: string;
  modalType: number;
  open: boolean;
};

const initState: ModalState = {
  modalType: 1,
  open: false,
};

const scheduleModalVar = makeVar<ModalState>(initState);

export const changeScheduleModal = (state?: ModalState) => {
  if (state) scheduleModalVar(state);
  else scheduleModalVar(initState);
};

export default scheduleModalVar;

// type 1: 스케줄 결과 추가 / 스케줄 삭제
// type 2: 스케줄 결과 삭제 / 스케줄 삭제
