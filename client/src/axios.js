import axios from 'axios';

axios.defaults.baseURL = 'https://personal-finance-saas.onrender.com/api';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios;
