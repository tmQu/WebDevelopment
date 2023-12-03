const express = require('express');
const morgan = require('morgan');

const app = express();

const boardRouter = require('./routes/boardRoutes');

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/boards', boardRouter);

module.exports = app;
