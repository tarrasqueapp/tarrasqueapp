import axios from 'axios';

import { config } from './config';

export const api = axios.create({
  baseURL: typeof window !== 'undefined' ? config.basePath : `http://server:${config.port}${config.basePath}`,
});

// Always return a readable error message
api.interceptors.response.use(undefined, (error) => {
  const message = error.response?.data?.message || error.message;

  if (!message) {
    return Promise.reject(error);
  }

  const err = new Error(message);

  return Promise.reject(err);
});
