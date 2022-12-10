import axios from 'axios';

export const api = axios.create({
  baseURL: typeof window !== 'undefined' ? '' : `http://server:3000`,
});

// Always return a readable error message
api.interceptors.response.use(undefined, (error) => {
  const status = error.response?.status || error.status;
  const message = error.response?.data?.message || error.message;

  if (error.code === 'ECONNREFUSED') {
    return false;
  }

  if (!message) {
    return Promise.reject(error);
  }

  return Promise.reject({ status, message });
});
