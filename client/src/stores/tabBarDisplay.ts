import { makeVar } from '@apollo/client';

const tabBarDisplayVar = makeVar<boolean>(true);

export const changeTabBarDisplay = (state: boolean) => tabBarDisplayVar(state);

export default tabBarDisplayVar;
