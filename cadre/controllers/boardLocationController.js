import boardLocationModel from '../models/boardLocationModel.js';
import boardModel from '../models/boardModel.js';
import boardTypeModel from '../models/boardTypeModel.js';
import advtFormModel from '../models/advFormModel.js';
import locationCategoryModel from '../models/locationCategoryModel.js';
import wardModel from '../models/wardModel.js';
import districtModel from '../models/districtModel.js';
import mongoose from 'mongoose'
import fs from 'fs';
import { __dirname } from '../app.js';
import path from 'path';

const ITEMS_PER_PAGE = 5; // Số lượng mục trên mỗi trang

const boardLocationController = {
  viewAllBoardLocation: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Trang mặc định là trang 1

      let boardLocation = [];
      console.log(req.user)
      var query = {};
      if (req.user.role.level === 'wards') {
        query['addr.ward'] = mongoose.Types.ObjectId(req.user.role.detail);
        let ward = await wardModel.findById(req.user.role.detail);
        
      } else if (req.user.role.level === 'districts') {
        query['addr.district'] = mongoose.Types.ObjectId(req.user.role.detail);
      }

      const options = {
        skip: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      };

      
      var filter = req.session.filter;
      if (filter)
      {
        query = {
          $and: [
            query,
          {'addr.ward': {$in: filter.wards.map((ward)=>{return mongoose.Types.ObjectId(ward)})}}
          ]
        }
      }

      boardLocation = await boardLocationModel.find(query, null, options);
      const totalItems = await boardLocationModel.countDocuments(query);
      console.log(boardLocation.length)
      
      boardLocation = boardLocation.map((boardLocation) => {
        boardLocation = boardLocation.toObject();
        return {
          ...boardLocation,
          locationCategory: boardLocation.locationCategory,
          addr: {
            ...boardLocation.addr,
            district: boardLocation.addr.district.district,
            ward: boardLocation.addr.ward.ward,
          },
          advertisementForm: boardLocation.advertisementForm.advertisementForm,
        };
      });

      res.render('vwBoard/boardLocation', {
        isSuperAdmin: req.user.role.level === 'departmental',
        layout: 'list',
        boardLocation: boardLocation,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 'fail',
        message: 'Server error',
      });
    }
  },
  viewBoardLocation: async (req, res) => {
    try {

      let boardLocation = await boardLocationModel.findById(req.params.id);
      let boards = await boardModel.find({ boardLocation: boardLocation._id });
      let boardType = await boardTypeModel.find();
      const user = req.user._id;

      boards = boards.map((board) => {
        board = board.toObject();
        return {
          ...board,
          boardType: board.boardType.boardType,
          expireDate: new Date(board.expireDate).toLocaleString(),
        };
      });

      boardLocation = {
        ...boardLocation,
        _id: boardLocation._id,
        locationCategory: boardLocation.locationCategory.map((locationCategory) => {
          return locationCategory.locationCategory;
        }),
        addr: {
          ...boardLocation.addr,
          district: boardLocation.addr.district.district,
          ward: boardLocation.addr.ward.ward,
        },
        advertisementForm: boardLocation.advertisementForm.advertisementForm,
      };

      boardType = boardType.map((boardType) => {
        boardType = boardType.toObject();
        return {
          ...boardType,
          boardType: boardType.boardType,
        };
      });

      res.render('vwBoard/boardLocationDetail', {
        isSuperAdmin: req.user.role.level === 'departmental',
        layout: 'list',
        user: user,
        boards: boards,
        boardLocation: boardLocation,
        boardType: boardType,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 'fail',
        message: 'Server error',
      });
    }
  },
  viewBoard: async (req, res) => {
    try {
      let boards = await boardModel.findById(req.params.boardID);
      let boardLocation = await boardLocationModel.findById(req.params.id);

      boardLocation = {
        ...boardLocation,
        locationCategory: boardLocation.locationCategory,
        addr: {
          ...boardLocation.addr,
          district: boardLocation.addr.district,
          ward: boardLocation.addr.ward,
        },
        advertisementForm: boardLocation.advertisementForm,
      };

      boards = boards.map((board) => {
        board = board.toObject();
        return {
          ...board,
          createdAt: new Date(board.createdAt).toLocaleString(),
        };
      });
      res.render('vwBoard/board', {
        layout: 'list',
        boards: boards,
        boardLocation: boardLocation,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 'fail',
        message: 'Server error',
      });
    }
  },
  changeInfoRequest: async (req, res) => {
    try {
      let action = req.query.action;
      let boardLocation = await boardLocationModel.findById(req.params.id);
      let advertisementForm = await advtFormModel.find();
      let locationCategory = await locationCategoryModel.find();
      const user = req.user;

      advertisementForm = advertisementForm.map((advertisementForm) => {
        advertisementForm = advertisementForm.toObject();
        return {
          ...advertisementForm,
          advertisementForm: advertisementForm.advertisementForm,
        };
      });

      locationCategory = locationCategory.map((locationCategory) => {
        locationCategory = locationCategory.toObject();
        return {
          ...locationCategory,
          locationCategory: locationCategory.locationCategory,
        };
      });

      boardLocation = boardLocation.toObject();
      boardLocation = {
        ...boardLocation,
        locationCategory: boardLocation.locationCategory,
        addr: {
          ...boardLocation.addr,
          district: boardLocation.addr.district,
          ward: boardLocation.addr.ward,
        },
        advertisementForm: boardLocation.advertisementForm,
      };
      res.render('vwBoard/boardLocationRequest', {
        isSuperAdmin: req.user.role.level === 'departmental',
        action: {
          add: action === 'add',
          edit: action === 'update',
        },
        layout: 'report',
        user: user.toObject(),
        boardLocation: boardLocation,
        advertisementForm: advertisementForm,
        locationCategory: locationCategory,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 'fail',
        message: 'Server error',
      });
    }
  },
  viewBoardLocationForm: async (req, res) => {
    try {

      let action = req.query.action;
  
      let boardLocation;

      let advertisementForm = await advtFormModel.find();
      let locationCategory = await locationCategoryModel.find();
      const user = req.user;
      advertisementForm = advertisementForm.map((advertisementForm) => {
        advertisementForm = advertisementForm.toObject();
        return {
          ...advertisementForm,
          advertisementForm: advertisementForm.advertisementForm,
        };
      });

      locationCategory = locationCategory.map((locationCategory) => {
        locationCategory = locationCategory.toObject();
        return {
          ...locationCategory,
          locationCategory: locationCategory.locationCategory,
        };
      });

      if (action === 'update'){
        boardLocation = await boardLocationModel.findById(req.params.id);
        boardLocation = boardLocation.toObject();
        boardLocation = {
          ...boardLocation,
          locationCategory: boardLocation.locationCategory,
          addr: {
            ...boardLocation.addr,
            district: boardLocation.addr.district,
            ward: boardLocation.addr.ward,
          },
          advertisementForm: boardLocation.advertisementForm,
        };
      }




      if (user.role.level === 'departmental' && action === 'add') {

        res.render('vwBoard/boardLocationRequest', {
          isSuperAdmin: req.user.role.level === 'departmental',
          action: {
            add: true,
            edit: action === 'update',
          },
          layout: 'report',
          user: user.toObject(),
          advertisementForm: advertisementForm,
          locationCategory: locationCategory,
        });
        return;

      }
      res.render('vwBoard/boardLocationRequest', {
        isSuperAdmin: req.user.role.level === 'departmental',
        action: {
          add: action === 'add',
          edit: action === 'update',
        },
        layout: 'report',
        user: user.toObject(),
        boardLocation: boardLocation,
        advertisementForm: advertisementForm,
        locationCategory: locationCategory,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 'fail',
        message: 'Server error',
      });
    }
  },
  createBoardLocation: async(req, res)=>{
    try {
      var district_id;
      var ward_id
      district_id = await districtModel.find({ district: { $regex: req.body.district, $options: 'i' } });
      if(district_id)
        ward_id = await wardModel.find({ ward: { $regex: req.body.ward, $options: 'i' }, district: district_id[0]._id });
      var newInfor = {
        advertisementForm: req.body.advertisementForm,
        locationCategory:  req.body.locationCategory,
        imgBillboardLocation: req.files.map((file) => '/' + file.path),
        location: {
          lat: req.body.lat,
          lng: req.body.lng
        },
        addr: {
          street_number: req.body.street_number,
          route: req.body.route,
          ward: mongoose.Types.ObjectId(ward_id[0]._id),
          district: mongoose.Types.ObjectId(district_id[0]._id),
          city: req.body.city,
        }
      }
      await boardLocationModel.create(newInfor)
      res.redirect('/boardsLocation/');
    }
    catch(err)
    {
      console.log(err);
      res.render('vwError/error', {
        statusCode: 500,
        status: 'fail',
        message: err.message,
        layout: 'main',
      });
    }
  },
  updateBoardLocation: async(req, res) =>{
    try {
      var id = req.params.id;
      var district_id;
      var ward_id
      district_id = await districtModel.find({ district: { $regex: req.body.district, $options: 'i' } });
      if(district_id)
        ward_id = await wardModel.find({ ward: { $regex: req.body.ward, $options: 'i' }, district: district_id[0]._id });
      var newInfor = {
        advertisementForm: req.body.advertisementForm,
        locationCategory:  req.body.locationCategory,
        location: {
          lat: req.body.lat,
          lng: req.body.lng
        },
        addr: {
          street_number: req.body.street_number,
          route: req.body.route,
          ward: mongoose.Types.ObjectId(ward_id[0]._id),
          district: mongoose.Types.ObjectId(district_id[0]._id),
          city: req.body.city,
        }
      }
      if(req.files.length > 0)
      {
        newInfor.imgBillboardLocation = req.files.map((file) => '/' + file.path);
      }
      const boardLocation = await boardLocationModel.findByIdAndUpdate(id, newInfor);
      res.redirect('/boardsLocation/');
    }
    catch(err)
    {
      console.log(err);
      res.render('vwError/error', {
        statusCode: 500,
        status: 'fail',
        message: err.message,
        layout: 'main',
      });
    }
  },
  deleteBoardLocation: async (req, res) =>{
    try {
      const boardLocation = await boardLocationModel.findOneAndDelete({_id: req.params.id});

      if (!boardLocation) {
        return res.status(404).json({
          status: 'fail',
          message: 'Board location not found',
        });
      }
      console.log(boardLocation)
      boardLocation.imgBillboardLocation.forEach((img)=>{
        // not delete the default image which is used by most of billbaord
  
        if (!img.includes('db/billboard/billboard_'))
          fs.unlinkSync(path.join(__dirname, img));
      })
      res.redirect('/boardsLocation/');
    }
    catch(err)
    {
      console.log(err);
      res.render('vwError/error', {
        statusCode: 500,
        status: 'fail',
        message: err.message,
        layout: 'main',
      });
    }
  }
};

export default boardLocationController;
