import axios from 'axios';

export const api = axios.create({
  baseURL: typeof window !== 'undefined' ? '' : `http://server:3000`,
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
