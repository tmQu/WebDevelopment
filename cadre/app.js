import express from 'express';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import bodyParser from 'body-parser';

import { engine } from 'express-handlebars';
import hbs_sections from 'express-handlebars-sections';
import cors from 'cors';

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

import boardRouter from './routes/boardRoutes.js';
import boardLocationRouter from './routes/boardLocationRoutes.js'
import userRouter from './routes/userRoutes.js';
import reportRouter from './routes/reportRoutes.js';
import reportMethodRoutes from './routes/reportMethodRoutes.js';
import changeBoardRoutes from './routes/changeBoardRoutes.js';
import changeBoardLocationRoutes from './routes/changeBoardLocationRoutes.js';
import advFormRoutes from './routes/advFormRoutes.js';
import licenseRouter from './routes/licenseRoutes.js';

import hbsHelpers from './static/js/handlebarsHelpers.js';
import cookieParser from 'cookie-parser';

// import model
import boardLocationModel from './models/boardLocationModel.js';
import advtFormModel from './models/advFormModel.js';
import locationCategoryModel from './models/locationCategoryModel.js';
import districtModel from './models/districtModel.js';
import wardModel from './models/wardModel.js';
import mongoose from 'mongoose';
import boardModel from './models/boardModel.js';
import boardTypeModel from './models/boardTypeModel.js';

import reportMethodController from './controllers/reportMethodController.js';
import boardLocationController from './controllers/boardLocationController.js';
import boardController from './controllers/boardController.js';
import reportController from './controllers/reportController.js';
import authController from './controllers/authController.js';

import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const io = new Server(server);

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
      range: function (start, end) {
        const result = [];
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
        return result;
      },
      eq: function (a, b) {
        return a === b;
      },
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

app.use(express.urlencoded({ extended: true }));

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

// 3) ROUTES

// Cadre Route -> for render
app.use('/api/v1/boards', boardRouter.router_v1);
app.use('/api/v1/boardLocation', boardLocationRouter.router_v1)
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reports', reportRouter.router_v1);
app.use('/api/v1/reportMethods', reportMethodRoutes);
app.use('/api/v1/license', licenseRouter);
app.use('/api/v1/changeBoard', changeBoardRoutes.router_v1);
app.use('/api/v1/changeBoardLocation', changeBoardLocationRoutes.router_v1);
app.use('/api/v1/advForms', advFormRoutes);

// Resident Route -> for get json
app.use('/api/v2/boards', boardRouter.router_v2)
app.use('/api/v2/reports', reportRouter.router_v2);
app.use('/api/v2/reportMethods', reportMethodRoutes);


// app.get('/', async (req, res) => {
//   var boardLocation = await boardLocationModel
//     .find()
//     .populate('advertisementForm')
//     .populate('locationCategory')
//     .populate('addr.district')
//     .populate('addr.ward');
//   var boards = await boardModel.find().populate('boardType');

//   res.render('vwHome/index', {
//     layout: 'main',
//     boardLocation: JSON.stringify(boardLocation),
//     boards: JSON.stringify(boards),
//   });
// });

app.get('/licenseAccount', authController.protect, authController.restrictTo('departmental'), (req, res) => {
  res.render('vwLicense/licenseAccount', { layout: 'department' });
});

app.get('/license', (req, res) => {
  res.render('vwLicense/license', { layout: 'main' });
});

app.get('/wardAdmin', (req, res) => {
  res.render('vwAdmin/wardAdmin', { layout: 'main' });
});

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

app.get('/reports', authController.protect, async (req, res) => {
  reportController.getAllReports(req, res);
});

app.get('/reports/:id', authController.protect, async (req, res) => {
  reportController.getByID_v1(req, res);
});

app.get('/boardsLocation', authController.protect, (req, res) => {
  boardLocationController.viewAllBoardLocation(req, res);
});



// for add
app.get('/boardsLocation/departmental', authController.protect, (req, res) => {
  boardLocationController.viewBoardLocationForm(req, res);
});

// for edit action=update
app.get('/boardsLocation/departmental/:id', authController.protect, (req, res) => {
  boardLocationController.viewBoardLocationForm(req, res);
});

app.get('/boardsLocation/:id/changeInfoRequest', authController.protect, (req, res) => {
  boardLocationController.changeInfoRequest(req, res);
});



app.get('/boardsLocation/:id/board', authController.protect, (req, res) => {
  boardController.viewBoard(req, res);
});
app.get('/boardsLocation/:id/board/:boardId', authController.protect, (req, res) => {
  boardController.viewBoard(req, res);
});

app.get('/boardsLocation/:id', authController.protect, (req, res) => {
  boardLocationController.viewBoardLocation(req, res);
});

import reportMethodController from './controllers/reportMethodController.js';

app.get('/reportMethods', (req, res) => {
  reportMethodController.getAllMethods_v2(req, res);
});

app.get('/reportMethods/add', (req, res) => {
  res.render('vwDepartment/reportMethod/reportMethodAdd', {
    layout: 'department'
  });
});

app.get('/reportMethods/edit/:id', (req, res) => {
  res.render('vwDepartment/reportMethod/reportMethodEdit', {
    id: req.params.id,
    layout: 'department'
  });
});

import advFormController from './controllers/advFormController.js';

app.get('/advForms', (req, res) => {
  advFormController.getAll(req, res);
});

app.get('/advForms/add', (req, res) => {
  res.render('vwDepartment/advForm/advFormAdd', {
    layout: 'department'
  });
});

app.get('/advForms/edit/:id', (req, res) => {
  res.render('vwDepartment/advForm/advFormEdit', {
    id: req.params.id,
    layout: 'department'
  });
});

app.get('/', async (req, res) => {
  res.render('vwHome/index', { layout: 'main' });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Something went wrong!';

  res.status(statusCode).render('vwError/error', {
    statusCode: statusCode,
    status: status,
    message: message,
    layout: 'department',
  });
});

export { server, io, __dirname};