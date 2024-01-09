const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');

const app = express();

// 1. Middleware
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());

app.use(express.json());

app.use('/static', express.static('static'));

module.exports = app;
