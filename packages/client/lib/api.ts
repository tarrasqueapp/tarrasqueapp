import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.BASE_PATH,
});

// Always return a readable error message
api.interceptors.response.use(undefined, (error) => {
  const message = error.response?.data?.message || error.message;
  const err = new Error(message);
  return Promise.reject(err);
});
