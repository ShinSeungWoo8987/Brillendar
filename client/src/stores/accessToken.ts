import { makeVar } from '@apollo/client';

const accessTokenVar = makeVar<string | undefined | null>(null);

export const changeAccessToken = (data: string | null) => accessTokenVar(data);

export default accessTokenVar;
