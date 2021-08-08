type Mode = 'PRODUCTION' | 'DEVELOPMENT';

const mode: Mode = 'DEVELOPMENT'; // "PRODUCTION"

const PRODUCTION_URL = 'http://13.125.223.24:8000';
const DEVELOPMENT_URL = 'http://222.117.111.185:8000';

export const serverUrl = mode === 'DEVELOPMENT' ? DEVELOPMENT_URL : PRODUCTION_URL;
