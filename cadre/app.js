import express from 'express';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import { engine } from 'express-handlebars';
import hbs_sections from 'express-handlebars-sections';
import cors from 'cors';

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

import boardRouter from './routes/boardRoutes.js';
import userRouter from './routes/userRoutes.js';
import reportRouter from './routes/reportRoutes.js';
import reportController from './controllers/reportController.js';
import reportMethodRoutes from './routes/reportMethodRoutes.js';
import boardLocationController from './controllers/boardLocationController.js';
import boardController from './controllers/boardController.js';

import hbsHelpers from './utils/handlebarsHelpers.js';
import licenseRouter from './routes/licenseRoutes.js';

import cookieParser from 'cookie-parser';

// import model
import boardLocationModel from './models/boardLocationModel.js';
import advtFormModel from './models/advtFormModel.js';
import locationCategoryModel from './models/locationCategoryModel.js';
import districtModel from './models/districtModel.js';
import wardModel from './models/wardModel.js';
import mongoose from 'mongoose';
import boardModel from './models/boardModel.js';
import boardTypeModel from './models/boardTypeModel.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Handlebars
app.engine(
  'hbs',
  engine({
    extname: 'hbs',
    defaultLayout: 'login',
    layoutsDir: `${__dirname}/views/layouts/`,
    helpers: {
      section: hbs_sections(),
      ...hbsHelpers,
    },
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.set('trust proxy', 1);

const corsOptions = {
  origin: ['http://localhost:4000', 'http://localhost:3000'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 1) GLOBAL MIDDLEWARES
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API (prevent from DDOS)
const limiter = rateLimit({
  max: 100, // 100 requests from same IP
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter); // apply to all routes that start with /api
app.use(cookieParser());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());

app.use(xss());

// Serving static files
app.use('/static', express.static('static'));
// app.use(express.static(`/static`));

// 3) ROUTES
app.use('/api/v1/boards', boardRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/reportMethods', reportMethodRoutes);
app.use('/license', licenseRouter);

app.get('/', async (req, res) => {
  var boardLocation = await boardLocationModel
    .find()
    .populate('advertisementForm')
    .populate('locationCategory')
    .populate('addr.district')
    .populate('addr.ward');
  var boards = await boardModel.find().populate('boardType');

  // console.log(boardLocation);
  // console.log(boards);

  res.render('vwHome/index', {
    layout: 'main',
    boardLocation: JSON.stringify(boardLocation),
    boards: JSON.stringify(boards),
  });
});

import authController from './controllers/authController.js';

app.get('/licenseAccount', 
  authController.protect, 
  authController.restrictTo('super-admin'), 
  (req, res) => {
    res.render('vwForm/licenseAccount', { layout: 'main' });
  }
);

app.get('/license', (req, res) => {
  res.render('vwForm/license', { layout: 'main' });
})

app.get('/login', (req, res) => {
  res.render('vwAccount/login');
});

app.get('/forgotPassword', (req, res) => {
  res.render('vwAccount/forgotPassword');
});

app.get('/verifyOTP', (req, res) => {
  res.render('vwAccount/verifyOTP');
});

app.get('/resetPassword', (req, res) => {
  res.render('vwAccount/resetPassword');
});

app.get('/reports', async (req, res) => {
  reportController.getAllReports(req, res);
});

app.get('/reports/:id', async (req, res) => {
  reportController.getByID(req, res);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Something went wrong!';

  res.status(statusCode).render('vwError/error', {
    statusCode: statusCode,
    status: status,
    message: message,
    layout: 'main',
  });
});


app.get('/boardsLocation', (req, res) => {
  boardLocationController.viewAllBoardsLocation(req, res);
});

app.get('/boardsLocation/:id', (req, res) => {
  boardLocationController.viewBoardLocation(req, res);
});

app.get('/boardsLocation/:id/board/:boardID', (req, res) => {
  boardController.viewBoard(req, res);
});

// app.use(globalErrorHandler);

export default app;
