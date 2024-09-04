import axios from 'axios';
import config from '../config';

export const httpClient = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.response.use((res) => res.data);
