import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

import CryptoJS from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import redisClient from './redisClient';
import { SendMessageResponse } from '../types';

type MakeSignature = {
  method: 'GET' | 'POST' | 'DELETE';
  url: string;
  accessKey: string;
  secretKey: string;
  timestamp?: number;
};

const makeSignature = ({ method, url, accessKey, secretKey, timestamp }: MakeSignature) => {
  const space = ' ';
  const newLine = '\n';

  let baseSignature = method;
  baseSignature += space;
  baseSignature += url;
  baseSignature += newLine;
  baseSignature += timestamp ? timestamp.toString() : Date.now().toString();
  baseSignature += newLine;
  baseSignature += accessKey;

  const hmac = CryptoJS.HmacSHA256(baseSignature, secretKey);
  return Base64.stringify(hmac);
};

// //////////////////////////////////////////

export const sendMessage = async (phone: string) => {
  const accessKey = process.env.API_ACCESS_KEY_ID!;
  const secretKey = process.env.API_SECRET_KEY!;
  const serviceID = process.env.SMS_SERVICE_ID!;

  const method = 'POST';
  const timestamp = Date.now();
  const authUrl = `/sms/v2/services/${serviceID}/messages`;

  const signature = makeSignature({ accessKey, secretKey, method, url: authUrl, timestamp });

  const sendMessageUrl = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceID}/messages`;
  const certificationNumber = Math.random().toString().split('.')[1].substring(0, 6);

  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'x-ncp-iam-access-key': accessKey,
    'x-ncp-apigw-timestamp': timestamp.toString(),
    'x-ncp-apigw-signature-v2': signature,
  };

  const body = {
    type: 'SMS',
    countryCode: '82',
    from: '01073088987',
    content: `[Brillendar] 인증번호: ${certificationNumber} 인증번호를 입력해주세요.`,
    messages: [{ to: phone }],
  };

  const result: SendMessageResponse = await axios
    .post(sendMessageUrl, body, { headers })
    .then((res) => {
      redisClient.setex(phone, 5 * 60, certificationNumber);
      return { statudCode: res.data.statusCode };
    })
    .catch((err) => ({ statudCode: err.response.status, errMessage: err.response.statusText }));

  return result;
};
