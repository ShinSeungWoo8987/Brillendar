import dotenv from 'dotenv';
dotenv.config();

type Mode = 'PRODUCTION' | 'DEVELOPMENT';

const mode = process.env.MODE as Mode;

export default mode === 'DEVELOPMENT' ? process.env.DEVELOPMENT_URL : process.env.PRODUCTION_URL;
