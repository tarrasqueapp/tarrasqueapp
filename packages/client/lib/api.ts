import axios from 'axios';

export const api = axios.create({
  baseURL: typeof window !== 'undefined' ? process.env.BASE_PATH : `http://server:10000${process.env.BASE_PATH}`,
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
