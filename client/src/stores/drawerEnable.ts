import { makeVar } from '@apollo/client';

const drawerEnableVar = makeVar<Boolean>(true);

export const changeDrawerEnable = (mode: Boolean) => drawerEnableVar(mode);

export default drawerEnableVar;
