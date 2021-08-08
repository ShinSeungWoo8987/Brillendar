import { makeVar } from '@apollo/client';

const screenModeVar = makeVar<ScreenType>('light');

export const changeScreenMode = (mode: ScreenType) => screenModeVar(mode);

export default screenModeVar;
