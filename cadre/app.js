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
import boardLocationRouter from './routes/boardLocationRoutes.js';
import userRouter from './routes/userRoutes.js';
import reportRouter from './routes/reportRoutes.js';
import reportMethodRoutes from './routes/reportMethodRoutes.js';
import changeBoardRoutes from './routes/changeBoardRoutes.js';
import changeBoardLocationRoutes from './routes/changeBoardLocationRoutes.js';
import advFormRoutes from './routes/advFormRoutes.js';
import licenseRouter from './routes/licenseRoutes.js';
import wardRoutes from './routes/wardRoutes.js';
import districtRoutes from './routes/districtRoutes.js';
import filterRoutes from './routes/filterRoutes.js';

import hbsHelpers from './static/js/handlebarsHelpers.js';
import cookieParser from 'cookie-parser';

// import model
import boardLocationModel from './models/boardLocationModel.js';
import districtModel from './models/districtModel.js';
import wardModel from './models/wardModel.js';
import mongoose from 'mongoose';
import boardModel from './models/boardModel.js';
import reportModel from './models/reportModel.js';
import advFormModel from './models/advFormModel.js';
import reportMethodModel from './models/reportMethodModel.js';

import reportMethodController from './controllers/reportMethodController.js';
import boardLocationController from './controllers/boardLocationController.js';
import boardController from './controllers/boardController.js';
import authController from './controllers/authController.js';
import reportController from './controllers/reportController.js';
import changeBoardController from './controllers/changeBoardController.js';
import changeBoardLocationController from './controllers/changeBoardLocationController.js';
import areaController from './controllers/areaController.js';
import advFormController from './controllers/advFormController.js';

import { Server } from 'socket.io';
import { createServer } from 'http';

import session from 'express-session';

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
      isSelected: function (value, selectedValues) {

        if (selectedValues && Array.isArray(selectedValues) && selectedValues.includes(value.toString())) {
          return 'checked';
        }
  
        return '';
      },
      isSelectedTableWard: function (value, selectedValues) {

        if (selectedValues && Array.isArray(selectedValues) && selectedValues.includes(value.toString())) {
          return 'display: block;';
        }
        return 'display: none;';
      },
    }
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

app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'somesecret', 
  cookie: { maxAge: 60000 }}));

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
app.use('/api/v1/boardLocation', boardLocationRouter.router_v1);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reports', reportRouter.router_v1);
app.use('/api/v1/reportMethods', reportMethodRoutes);
app.use('/api/v1/license', licenseRouter);
app.use('/api/v1/changeBoard', changeBoardRoutes.router_v1);
app.use('/api/v1/changeBoardLocation', changeBoardLocationRoutes.router_v1);
app.use('/api/v1/advForms', advFormRoutes);

// Resident Route -> for get json
app.use('/api/v2/boards', boardRouter.router_v2);
app.use('/api/v2/reports', reportRouter.router_v2);
app.use('/api/v2/reportMethods', reportMethodRoutes);
app.use('/api/v2/wards', wardRoutes);
app.use('/api/v2/districts', districtRoutes);
app.use('/api/v2/filter', filterRoutes);
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
  res.render('vwLicense/licenseAccount', { layout: 'license' });
});

app.get('/license', (req, res) => {
  res.render('vwLicense/license', { layout: 'main' });
});

app.get('/wardAdmin', authController.protect, async (req, res) => {

  var queryBoard = {};
  if (req.user.role.level === 'wards') {
    queryBoard['addr.ward'] = mongoose.Types.ObjectId(req.user.role.detail);
    let ward = await wardModel.findById(req.user.role.detail);
    queryBoard['addr.district'] = mongoose.Types.ObjectId(ward.district);
  } else if (req.user.role.level === 'districts') {
    queryBoard['addr.district'] = mongoose.Types.ObjectId(req.user.role.detail);
  }

  const queryReport = {};
    if (req.user.role.level === 'wards') {
      queryReport.ward = req.user.role.detail;
      let ward = await wardModel.findById(req.user.role.detail);
      queryReport.district = ward.district;
    } else if (req.user.role.level === 'districts') {
      queryReport.district = req.user.role.detail;
    }

  var boardLocation = await boardLocationModel
    .find(queryBoard)
    .populate('advertisementForm')
    .populate('locationCategory')
    .populate('addr.district')
    .populate('addr.ward');

  var boards = await boardModel.find().populate('boardType');
  var reports = await reportModel.find(queryReport).populate('reportMethod').populate('boardLocation').populate('board');

  var reportObject = [];
  reports.forEach((report) => {
    reportObject.push({
      _id: report._id,
      location: report.location,
      createdAt: report.createdAt,
      method: report.method.reportMethod,
      sender: report.sender,
      board: report.board,
      addr: report.addr,
    });
  });

  res.render('vwAdmin/wardAdmin', {
    layout: 'main',
    isSuperAdmin: req.user.role.level === 'departmental',
    boardLocation: JSON.stringify(boardLocation),
    boards: JSON.stringify(boards),
    reports: JSON.stringify(reportObject),
  });
});

app.get('/departmentAdmin', async (req, res) => {
  res.render('vwAdmin/departmentAdmin', { layout: 'main' });
});

app.get('/login', (req, res) => {
  res.render('vwAccount/login');
});

app.get('/logout', (req, res) => {
  authController.logout(req, res);
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

app.get('/boardsLocation/:id', authController.protect, (req, res) => {
  boardLocationController.viewBoardLocation(req, res);
});

app.get('/boardsLocation/:id/board', authController.protect, (req, res) => {
  boardController.viewBoard(req, res);
});

app.get('/boardsLocation/:id/board/:boardId', authController.protect, (req, res) => {
  boardController.viewBoard(req, res);
});

app.get('/boardRequest', authController.protect, (req, res) => {
  changeBoardController.viewAllRequest(req, res);
});

app.get('/boardRequest/:id', authController.protect, (req, res) => {
  changeBoardController.viewRequest(req, res);
});

app.get('/boardRequest/:id/accept', authController.protect, (req, res) => {
  changeBoardController.acceptRequest(req, res);
});

app.get('/boardLocationRequest', authController.protect, (req, res) => {
  changeBoardLocationController.viewAllRequest(req, res);
});

app.get('/boardLocationRequest/:id', authController.protect, (req, res) => {
  changeBoardLocationController.viewRequest(req, res);
});

app.get('/boardLocationRequest/:id/accept', authController.protect, (req, res) => {
  changeBoardLocationController.acceptRequest(req, res);
});

import handlebarsHelpers from './static/js/handlebarsHelpers.js';

app.get('/reportMethods', (req, res) => {
  reportMethodController.getAllMethods_v2(req, res);
});

app.get('/reportMethods/add', (req, res) => {
  res.render('vwDepartment/reportMethod/reportMethodAdd', {
    layout: 'department',
  });
});

app.get('/reportMethods/edit/:id', async (req, res) => {
  const oldData = await reportMethodModel.findById(req.params.id);
  
  res.render('vwDepartment/reportMethod/reportMethodEdit', {
    id: req.params.id,
    layout: 'department',
    oldData: oldData.reportMethod
  });
});

app.get('/advForms', (req, res) => {
  advFormController.getAll(req, res);
});

app.get('/advForms/add', (req, res) => {
  res.render('vwDepartment/advForm/advFormAdd', {
    layout: 'department',
  });
});

app.get('/advForms/edit/:id', async (req, res) => {
  const oldData = await advFormModel.findById(req.params.id);

  res.render('vwDepartment/advForm/advFormEdit', {
    id: req.params.id,
    layout: 'department',
    oldData: oldData.advertisementForm
  });
});

app.get('/accountSetting', authController.protect, async (req, res) => {
  try {
    if (req.user.role.level === 'departmental')
    {
      var filter = req.session.filter;
      var selectedDistricts;
      var selectedWards;
      var showButtonWard = false;
      if (!req.session.filter || !req.session.filter.districts)
      {
        console.log('filter')
        var districts = await districtModel.find();
        var allWard= await wardModel.find();
        selectedDistricts = districts.map(district => district._id.toString());
        selectedWards = allWard.map(ward => ward._id.toString());
        showButtonWard = true;
      }
      else {
        selectedDistricts = req.session.filter.districts;
        selectedWards = req.session.filter.wards;
      }
      var wards = await wardModel.aggregate([
        {$group: {_id: '$district', wards: {$push: '$$ROOT'}}},
        {$lookup: {from: 'districts', localField: '_id', foreignField: '_id', as: 'district'}},
        // {$sort: {'district.district': 1}},
        {$project: {_id: -1, district: {$arrayElemAt: ['$district', 0]}, wards: 1}}
      ])

      // wards.forEach(ward => { newWards.push(wards.toObject()) });

      if (req.session.filter)
        if (filter.districts.length > 0)
          showButtonWard = true;
      console.log(wards)  
      res.render('vwAccount/filterDepartmental', {
          layout: 'list',
          wardInDistrict: wards,
          selectedDistricts: selectedDistricts,
          selectedWards: selectedWards,
          showButtonWard: showButtonWard
      });
    }
    else
    {
      var filter;
      if (req.session.filter)
        filter = req.session.filter;

      var wards = await wardModel.find({district: mongoose.Types.ObjectId('659271d460292ab573f76030')});
      wards = wards.map(ward => ward.toObject());
      console.log(wards)
      var selectedWards;
      console.log(filter)
      if (!filter)
      {
        selectedWards = wards.map(ward => ward._id.toString());
      }
      else
      {
        selectedWards = filter.wards;
      }
      res.render('vwAccount/filterDistrict', {
        layout: 'list',
        wards: wards,
        selectedWards: selectedWards
      })
    }

} catch (err) {
    console.log(err)
    res.status(404).json({
        status: 'fail',
        message: err
    });
}
})

app.get('/areas', (req, res) => {
  areaController.getAll(req, res);
});

import assignmentController from './controllers/assignmentController.js';

app.get('/assignment', (req, res) => {
  assignmentController.getAll(req, res);
});

app.get('/', authController.isLoggedIn, async (req, res, next) => {
  if (res.locals.user) {
    if (res.locals.user.role.level === 'wards' || res.locals.user.role.level === 'districts')
      res.redirect('/wardAdmin');
    else 
      res.redirect('/wardAdmin');
  } else res.redirect('/login');
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

export { server, io, __dirname };
