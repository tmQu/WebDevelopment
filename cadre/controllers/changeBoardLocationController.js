import changeBoardLocationModel from '../models/changeBoardLocationModel.js';
import locationCategoryModel from '../models/locationCategoryModel.js';
import boardLocationModel from '../models/boardLocationModel.js';
import wardModel from '../models/wardModel.js';
import districtModel from '../models/districtModel.js';
import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';

const changeBoardLocationController = {
  createChangeBoardLocationReq: async (req, res) => {
    try {
      console.log(req.body.boardLocation);
      const district_id = await districtModel.find({ district: { $regex: req.body.district, $options: 'i' } });
      const ward_id = await wardModel.find({
        ward: { $regex: req.body.ward, $options: 'i' },
        district: district_id[0]._id,
      });

      const changeBoardLocationReq = await changeBoardLocationModel.create({
        boardLocation: req.body.boardLocation,
        reason: sanitizeHtml(req.body.boardReason),
        creator: req.body.creator,
        addr: {
          street_number: req.body.street_number,
          route: req.body.route,
          ward: mongoose.Types.ObjectId(ward_id[0]._id),
          district: mongoose.Types.ObjectId(district_id[0]._id),
          city: req.body.city,
        },
        location: {
          lat: req.body.lat,
          lng: req.body.lng,
        },
        imgBillboardLocation: req.files.map((file) => '/' + file.path),
        advertisementForm: req.body.advertisementForm,
        locationCategory: req.body.locationCategory,
      });

      res.redirect('/boardsLocation/');
    } catch (err) {
      console.log(err);
      res.render('vwError/error', {
        statusCode: 500,
        status: 'fail',
        message: err.message,
        layout: 'main',
      });
    }
  },

  viewAllRequest: async (req, res) => {
    try {

      var query = {};
      if (req.session.filter)
      {
        query = {
          'addr.ward' : {$in : req.session.filter.wards.map((ward) => mongoose.Types.ObjectId(ward))}
        }
      }
      let changeBoardLocationReq = await changeBoardLocationModel.find(query);
      const user = req.user;

      changeBoardLocationReq = changeBoardLocationReq.map((changeBoardLocationReq) => {
        changeBoardLocationReq = changeBoardLocationReq.toObject();
        return {
          ...changeBoardLocationReq,
          addr: {
            ...changeBoardLocationReq.addr,
            district: changeBoardLocationReq.addr.district.district,
            ward: changeBoardLocationReq.addr.ward.ward,
          },
          locationCategory: changeBoardLocationReq.locationCategory,
          advertisementForm: changeBoardLocationReq.advertisementForm,
        };
      });

      res.render('vwRequest/boardLocationRequestList', {
        layout: 'list',
        requests: changeBoardLocationReq,
        user: user.toObject(),
      });
    } catch (err) {
      console.log(err);
      res.render('vwError/error', {
        statusCode: 500,
        status: 'fail',
        message: err.message,
        layout: 'main',
      });
    }
  },
  viewRequest: async (req, res) => {
    try {
      let changeBoardLocationReq = await changeBoardLocationModel.findById(req.params.id);
      let oldBoardLocation = await boardLocationModel.findById(changeBoardLocationReq.boardLocation);
      const user = req.user;

      changeBoardLocationReq = changeBoardLocationReq.toObject();
      changeBoardLocationReq = {
        ...changeBoardLocationReq,
        addr: {
          ...changeBoardLocationReq.addr,
          district: changeBoardLocationReq.addr.district.district,
          ward: changeBoardLocationReq.addr.ward.ward,
        },
        locationCategory: changeBoardLocationReq.locationCategory,
        advertisementForm: changeBoardLocationReq.advertisementForm,
      };

      oldBoardLocation = oldBoardLocation.toObject();
      oldBoardLocation = {
        ...oldBoardLocation,
        addr: {
          ...oldBoardLocation.addr,
          district: oldBoardLocation.addr.district.district,
          ward: oldBoardLocation.addr.ward.ward,
        },
        locationCategory: oldBoardLocation.locationCategory,
        advertisementForm: oldBoardLocation.advertisementForm,
      };

      res.render('vwRequest/boardLocationRequestDetails', {
        layout: 'list',
        newBoardLocation: changeBoardLocationReq,
        oldBoardLocation: oldBoardLocation,
        user: user.toObject(),
      });
    } catch (err) {
      console.log(err);
      res.render('vwError/error', {
        statusCode: 500,
        status: 'fail',
        message: err.message,
        layout: 'main',
      });
    }
  },
  acceptRequest: async (req, res) => {
    try {
      const changeBoardLocation = await changeBoardLocationModel.findById(req.params.id);
      // const oldBoardLocation = await boardLocationModel.findById(changeBoardLocation.boardLocation);

      // Get ?approve=true or false in url
      const approve = req.query.approve;
      if (approve === 'true') {
        await changeBoardLocationModel.findByIdAndUpdate(req.params.id, {
          status: 1,
        });
        await boardLocationModel.findByIdAndUpdate(changeBoardLocation.boardLocation, {
          locationCategory: changeBoardLocation.locationCategory,
          advertisementForm: changeBoardLocation.advertisementForm,
          addr: changeBoardLocation.addr,
          location: changeBoardLocation.location,
        });
      }
      else {
        await changeBoardLocationModel.findByIdAndUpdate(req.params.id, {
          status: -1,
        });
      }
      res.redirect('/boardLocationRequest/' + req.params.id);
    } catch (err) {
      console.log(err);
      res.render('vwError/error', {
        statusCode: 500,
        status: 'fail',
        message: err.message,
        layout: 'main',
      });
    }
  },
};

export default changeBoardLocationController;
