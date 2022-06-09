import axios from 'axios';

import { config } from './config';

export const api = axios.create({
  baseURL: typeof window !== 'undefined' ? config.BASE_PATH : `http://server:${config.PORT}${config.BASE_PATH}`,
});

// Always return a readable error message
api.interceptors.response.use(undefined, (error) => {
  const message = error.response?.data?.message || error.message;

  if (!message) {
    return Promise.reject(error);
  }

  if (error.code === 'ECONNREFUSED') {
    return false;
  }

  const err = new Error(message);

  return Promise.reject(err);
});
