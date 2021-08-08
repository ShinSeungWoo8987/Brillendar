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
exports.deletePhone = exports.deleteEmail = exports.verifyPhoneCode = exports.setOrChangePhoneValidationStatus = exports.checkVerifiedEmail = exports.changeEmailStatus = exports.setNewEmailStatus = exports.PHONE_EXPIRATION = exports.EMAIL_EXPIRATION = exports.DEFAULT_EXPIRATION = void 0;
const redis_1 = __importDefault(require("redis"));
const redisClient = redis_1.default.createClient({
// url: '' // 배포할때 사용됨.
});
exports.default = redisClient;
//
exports.DEFAULT_EXPIRATION = 3600;
exports.EMAIL_EXPIRATION = 15 * 60;
exports.PHONE_EXPIRATION = 15 * 60;
//
const setNewEmailStatus = (email, uuid) => {
    return new Promise((resolve, reject) => {
        // 일단 냅다 지워버리자.
        redisClient.del(email, (err, data) => {
            if (err)
                reject(err);
            else {
                redisClient.rpush(email, uuid, (err1, data1) => {
                    if (err1)
                        reject(err1);
                    else {
                        redisClient.rpush(email, '0', (err2, data2) => {
                            if (err2)
                                reject(err2);
                            else {
                                redisClient.expire(email, 10 * 60, (err3, data3) => {
                                    if (err3)
                                        reject(err3);
                                    else
                                        resolve();
                                });
                            }
                        });
                    }
                });
            }
        });
    });
};
exports.setNewEmailStatus = setNewEmailStatus;
//
const changeEmailStatus = (email, uuid) => {
    return new Promise((resolve, reject) => {
        redisClient.lrange(email, 0, 0, (err, data) => {
            // 메세지 처리가 필요하면 고치기.
            if (err)
                reject(err);
            else if (data[0] !== uuid)
                reject();
            else {
                redisClient.rpop(email, (err2, data2) => {
                    if (err2)
                        reject(err2);
                    else {
                        redisClient.rpush(email, '1', (err3, data3) => {
                            if (err3)
                                reject(err3);
                            else
                                resolve();
                        });
                    }
                });
            }
        });
    });
};
exports.changeEmailStatus = changeEmailStatus;
//
const checkVerifiedEmail = (email) => {
    return new Promise((resolve, reject) => {
        redisClient.lrange(email, 1, 1, (err, data) => {
            if (err)
                reject(err);
            if (data[0] !== '1')
                reject();
            else
                resolve();
        });
    });
};
exports.checkVerifiedEmail = checkVerifiedEmail;
///////////////////////////////////////////////////////////////////////////////////
const setOrChangePhoneValidationStatus = (ip) => {
    // 메세지 보내기 : 0
    // 시도 횟수 초과 : 1
    return new Promise((resolve, reject) => {
        // ip로 이전에 시도한적이 있는지 확인.
        redisClient.get(ip, (err, count) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                reject(err);
            else if (count === null) {
                // 없으면, 새로 만들기
                redisClient.setex(ip, exports.DEFAULT_EXPIRATION, '1', (err2) => {
                    if (err2)
                        reject(err2);
                });
                resolve(0);
            }
            else {
                // 횟수 초과
                if (Number(count) >= 5)
                    resolve(1);
                else {
                    // 횟수 증가시키기
                    redisClient.incr(ip, (err3) => {
                        if (err3)
                            reject(err3);
                    });
                    resolve(0);
                }
            }
        }));
    });
};
exports.setOrChangePhoneValidationStatus = setOrChangePhoneValidationStatus;
//
const verifyPhoneCode = (phone, code) => {
    return new Promise((resolve, reject) => {
        redisClient.get(phone, (err, certificationNumber) => {
            if (err) {
                reject(err);
            }
            else if (certificationNumber !== null) {
                if (code === certificationNumber) {
                    resolve({ ok: true });
                }
                else {
                    resolve({ error: { field: 'Verify', message: 'Wrong code.' }, ok: false });
                }
            }
            else {
                resolve({ error: { field: 'Verify', message: 'Expired code.' }, ok: false });
            }
        });
    });
};
exports.verifyPhoneCode = verifyPhoneCode;
///////////////////////////////////////////////////////////////////////////////////
const deleteEmail = (email) => {
    return new Promise((resolve, reject) => {
        redisClient.del(email, (err, data) => {
            if (err)
                reject(err);
        });
        resolve();
    });
};
exports.deleteEmail = deleteEmail;
const deletePhone = (phone) => {
    return new Promise((resolve, reject) => {
        redisClient.del(phone, (err, data) => {
            if (err)
                reject(err);
        });
        resolve();
    });
};
exports.deletePhone = deletePhone;
///////////////////////////////////////////////////////////////////////////////////
