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
import accountRouter from './routes/accountRoutes.js';
import userRouter from './routes/userRoutes.js';
//import globalErrorHandler from './controllers/errorController.js';
import reportRouter from './routes/reportRoutes.js';
import reportController from './controllers/reportController.js';
import reportMethodController from './controllers/reportMethodController.js';
import reportMethodRoutes from './routes/reportMethodRoutes.js';

import cookieParser from 'cookie-parser';

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
    },
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.set('trust proxy', 1);

const corsOptions = {
  origin: 'http://localhost:4000',
  credentials: true,
};
app.use(cors(corsOptions));

// 1) GLOBAL MIDDLEWARES
app.use(
  helmet({
    contentSecurityPolicy: false,
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

import boardLocation from './models/boardLocationModel.js';

app.get('/test', async (req, res) => {
  try{
    const board = await boardLocation.find().populate('advertisementForm').populate('locationCategory').populate('addr.district').populate('addr.ward');

    res.json(board);
  }
  catch(err){
    console.log(err);
  }
})
import ward from './models/wardModel.js';
app.get('/test2', async (req, res) => {
  try{
    const board = await ward.find().populate('district');
    res.json(board);
  }
  catch(err){
    console.log(err);
  }
})
// Serving static files
app.use('/static', express.static('static'));
// app.use(express.static(`/static`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/boards', boardRouter);
app.use('/api/v1/account', accountRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/reportMethods', reportMethodRoutes);

// app.get('/', (req, res) => {
//   res.render('navBar/navBar');
// });

app.get('/', (req, res) => {
  res.render('vwHome/index', {
    layout: 'main',
  });
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

app.get('/sendReport', async (req, res) => {
  let method = await reportMethodController.getAllMethods();
  //console.log(method);
  method = method.map(method => method.toObject());
  //res.render('vwReport/report', { layout: 'report'});
  res.render('vwReport/report', { method, layout: 'report' });
});

app.get('/viewReports', async (req, res) => {
  let reports = await reportController.getAllReports();
  //console.log(reports);
  reports = reports.map(report => report.toObject());
  res.render('vwReport/listReports', { reports });
});

app.get('/viewDetail/:id', async (req, res) => {
  let report = await reportController.getByID(req.params.id);
  //console.log(report.method);
  report = report.toObject();
  //show image from report
  res.contentType(report.image.contentType);
  
  res.render('vwReport/detailReport', { report });
});


// app.use(globalErrorHandler);

export default app;
