import { rejects } from 'assert';
import redis from 'redis';
import { RegisterResponse } from '../types';

const redisClient = redis.createClient({
  // url: '' // 배포할때 사용됨.
});
export default redisClient;

//

export const DEFAULT_EXPIRATION = 3600;
export const EMAIL_EXPIRATION = 15 * 60;
export const PHONE_EXPIRATION = 15 * 60;

//

export const setNewEmailStatus = (email: string, uuid: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 일단 냅다 지워버리자.
    redisClient.del(email, (err, data) => {
      if (err) reject(err);
      else {
        redisClient.rpush(email, uuid, (err1, data1) => {
          if (err1) reject(err1);
          else {
            redisClient.rpush(email, '0', (err2, data2) => {
              if (err2) reject(err2);
              else {
                redisClient.expire(email, 10 * 60, (err3, data3) => {
                  if (err3) reject(err3);
                  else resolve();
                });
              }
            });
          }
        });
      }
    });
  });
};

//
export const changeEmailStatus = (email: string, uuid: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    redisClient.lrange(email, 0, 0, (err, data) => {
      // 메세지 처리가 필요하면 고치기.
      if (err) reject(err);
      else if (data[0] !== uuid) reject();
      else {
        redisClient.rpop(email, (err2, data2) => {
          if (err2) reject(err2);
          else {
            redisClient.rpush(email, '1', (err3, data3) => {
              if (err3) reject(err3);
              else resolve();
            });
          }
        });
      }
    });
  });
};

//
export const checkVerifiedEmail = (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    redisClient.lrange(email, 1, 1, (err, data) => {
      if (err) reject(err);
      if (data[0] !== '1') reject();
      else resolve();
    });
  });
};

///////////////////////////////////////////////////////////////////////////////////

export const setOrChangePhoneValidationStatus = (ip: string): Promise<0 | 1> => {
  // 메세지 보내기 : 0
  // 시도 횟수 초과 : 1
  return new Promise((resolve, reject) => {
    // ip로 이전에 시도한적이 있는지 확인.
    redisClient.get(ip, async (err, count) => {
      if (err) reject(err);
      else if (count === null) {
        // 없으면, 새로 만들기
        redisClient.setex(ip, DEFAULT_EXPIRATION, '1', (err2) => {
          if (err2) reject(err2);
        });

        resolve(0);
      } else {
        // 횟수 초과
        if (Number(count) >= 5) resolve(1);
        else {
          // 횟수 증가시키기
          redisClient.incr(ip, (err3) => {
            if (err3) reject(err3);
          });

          resolve(0);
        }
      }
    });
  });
};

//
export const verifyPhoneCode = (phone: string, code: string): Promise<RegisterResponse> => {
  return new Promise((resolve, reject) => {
    redisClient.get(phone, (err, certificationNumber) => {
      if (err) {
        reject(err);
      } else if (certificationNumber !== null) {
        if (code === certificationNumber) {
          resolve({ ok: true });
        } else {
          resolve({ error: { field: 'Verify', message: 'Wrong code.' }, ok: false });
        }
      } else {
        resolve({ error: { field: 'Verify', message: 'Expired code.' }, ok: false });
      }
    });
  });
};

///////////////////////////////////////////////////////////////////////////////////

export const deleteEmail = (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    redisClient.del(email, (err, data) => {
      if (err) reject(err);
    });

    resolve();
  });
};

export const deletePhone = (phone: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    redisClient.del(phone, (err, data) => {
      if (err) reject(err);
    });

    resolve();
  });
};

///////////////////////////////////////////////////////////////////////////////////
