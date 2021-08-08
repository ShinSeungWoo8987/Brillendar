"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const enc_base64_1 = __importDefault(require("crypto-js/enc-base64"));
const redisClient_1 = __importDefault(require("./redisClient"));
const makeSignature = ({ method, url, accessKey, secretKey, timestamp }) => {
    const space = ' ';
    const newLine = '\n';
    let baseSignature = method;
    baseSignature += space;
    baseSignature += url;
    baseSignature += newLine;
    baseSignature += timestamp ? timestamp.toString() : Date.now().toString();
    baseSignature += newLine;
    baseSignature += accessKey;
    const hmac = crypto_js_1.default.HmacSHA256(baseSignature, secretKey);
    return enc_base64_1.default.stringify(hmac);
};
// //////////////////////////////////////////
const sendMessage = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    const accessKey = process.env.API_ACCESS_KEY_ID;
    const secretKey = process.env.API_SECRET_KEY;
    const serviceID = process.env.SMS_SERVICE_ID;
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
    const result = yield axios_1.default
        .post(sendMessageUrl, body, { headers })
        .then((res) => {
        redisClient_1.default.setex(phone, 5 * 60, certificationNumber);
        return { statudCode: res.data.statusCode };
    })
        .catch((err) => ({ statudCode: err.response.status, errMessage: err.response.statusText }));
    return result;
});
exports.sendMessage = sendMessage;
