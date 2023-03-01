/* eslint-disable @typescript-eslint/no-var-requires */
// import axios from 'axios';
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://ghibliapi.herokuapp.com',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    'Cache-Control': 'no-cache',
  },
});

export default api;
// module.exports = { api };
