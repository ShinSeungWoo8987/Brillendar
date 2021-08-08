import axios from 'axios';

export const setupAxiosInterceptors = (token: string) => {
  axios.interceptors.request.use(
    (config) => {
      config.headers['authorization'] = 'barer ' + token;
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
};
