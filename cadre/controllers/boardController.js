import boardLocationModel from '../models/boardLocationModel.js';
import boardModel from '../models/boardModel.js';
import boardTypeModel from '../models/boardTypeModel.js';
import mongoose from 'mongoose';
import fs from 'fs'
import path from 'path'
import {__dirname} from '../app.js'

const boardController = {
  getAllBoardLocation: async (req, res) => {
    try {
      var boardLocations = await boardLocationModel
        .find()
        .populate('advertisementForm')
        .populate('locationCategory')
        .populate('addr.district')
        .populate('addr.ward');

      if (boardLocations.length === 0 || !boardLocations) {
        res.status(404).json({
          status: 'fail',
          message: 'No boards found',
        });
      }
      var location = []
      boardLocations.forEach((boardLocation) => {
        boardLocation = boardLocation.toObject();
        boardLocation.imgBillboard
      });

      res.status(200).json({
        status: 'success',
        results: boardLocations.length,
        data: boardLocations,
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  },
  getBoardLocationWithId: async (req, res) => {
    try {
      const board = await boardLocationModel
        .findById(req.params.id)
        .populate('advertisementForm')
        .populate('locationCategory')
        .populate('addr.district')
        .populate('addr.ward');
      if (!board) {
        return res.status(404).json({
          status: 'fail',
          message: 'No board found',
        });
      }

      res.status(200).json({
        status: 'success',
        data: {
          board,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  },
  getBoardInLocation: async (req, res) => {
    try {
      var boards = await boardModel
        .find({ boardLocation: mongoose.Types.ObjectId(req.params.id) })
        .populate('boardType');
      var boardLocation = await boardLocationModel
        .findById(req.params.id)
        .populate('advertisementForm')
        .populate('locationCategory')
        .populate('addr.district')
        .populate('addr.ward');

      res.status(200).json({
        status: 'success',
        data: {
          boards: boards,
          boardLocation: boardLocation,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  },
  getByAccount: async (req, res) => {
    try {
      const account = await accountModel.findById(req.params.id);
      const boards = await boardModel.find({ 'addr.district': account.role });

      res.status(200).json({
        status: 'success',
        results: boards.length,
        data: {
          boards,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  },
  createBoard: async (req, res) => {
    try {
      
      var boardType = await boardTypeModel.findById(req.body.boardType);
      console.log(boardType);
      var unit = boardType.boardType.split(' ')[0].toLowerCase() + '/bảng';
      let data = {
        size: `${req.body.boardWidth}x${req.body.boardHeight}`,
        quantity: `${req.body.boardQuantity} ${unit}`,
        boardType: req.body.boardType,
        imgBillboard: '\\' + req.file.path,
        boardLocation: req.body.boardLocation
      }
      console.log(data);


      var board = await boardModel.create(data);

      var boardLocation = await boardLocationModel.findById(req.body.boardLocation);
      boardLocation.num_board = boardLocation.num_board + 1;


      res.redirect('/boardsLocation/' + req.body.boardLocation)
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err,
      });
    }
  },
  updateBoard: async (req, res) => {
    try {
      console.log(req.body.boardType)
      console.log(req.body)
      var boardType = await boardTypeModel.findById(req.body.boardType);
      console.log(boardType);
      var unit = boardType.boardType.split(' ')[0].toLowerCase() + '/bảng';
      let updateInfor = {
        size: `${req.body.boardWidth}x${req.body.boardHeight}`,
        quantity: `${req.body.boardQuantity} ${unit}`,
        boardType: boardType._id,
      }

      if (req.file)
      {
          updateInfor.imgBillboard = '/' + req.file.path;
      }



      const board = await boardModel.findByIdAndUpdate(req.params.id, updateInfor, {
        new: true,
        runValidators: true,
      });

      res.redirect('/boardsLocation/' + board.boardLocation)
    } catch (err) {
      res.render('vwError/error', {
        statusCode: 500,
        status: 'fail',
        message: err.message,
        layout: 'main',
      })
    }
  },
  deleteBoard: async (req, res) => {
    try {
      const board = await boardModel.findByIdAndDelete(req.params.id);
      console.log(board)
      var boardLocation = await boardLocationModel.findById(board.boardLocation);
      boardLocation.num_board = boardLocation.num_board - 1;
      boardLocation.save();
      console.log('sucess')
      if (!board) {
        return res.status(404).json({
          status: 'fail',
          message: err,
        });
      }

      // not delete the sample image use for all board
      if (!board.imgBillboard.includes('static/db/advs/adv_'))
      {
        console.log(path.join(__dirname, board.imgBillboard))
        fs.unlinkSync(path.join(__dirname, board.imgBillboard));
      }
      console.log('delet success')

      res.redirect('/boardsLocation/' + boardLocation._id)
    } catch (err) {
      res.render('vwError/error', {
        statusCode: 500,
        status: 'fail',
        message: err.message,
        layout: 'main',
      })
    }
  },

  viewBoard: async (req, res) => {
    try {
      let action = req.query.action;
      let board;
      let boardWidth;
      let boardHeight;
      let boardQuantity;
      if(action !== 'add')
      {
        board = await boardModel.findById(req.params.boardId);
        board = board.toObject();
        boardWidth = board.size.split('x')[0];
        boardHeight = board.size.split('x')[1];
        boardQuantity = board.quantity.split(' ')[0];

        board = {
          ...board,
          width: boardWidth,
          height: boardHeight,
          quantity: boardQuantity,
        };

      }
      let boardLocation = await boardLocationModel.findById(req.params.id);
      let boardType = await boardTypeModel.find();
      const user = req.user;




      boardLocation = boardLocation.toObject();
      boardLocation = {
        ...boardLocation,
        boardWidth,
        boardHeight,
      };
      boardType = boardType.map((type) => {
        type = type.toObject();
        return {
          ...type,
        };
      });
      
      if ((user.role.level === 'departmental' && action === 'add')) {
        res.render('vwBoard/boardRequest', {
          isSuperAdmin: req.user.role.level === 'departmental',
          action: {
            add: action === 'add',
            edit: action === 'update',
          },
          boardLocation,
          boardType,
          user: user.toObject(),
          layout: 'license',
        });
        return;
      }

      // request change board
      res.render('vwBoard/boardRequest', {
        isSuperAdmin: req.user.role.level === 'departmental',
        board,
        boardLocation,
        boardType,
        user: user.toObject(),
        layout: 'license',
      });


    } catch (err) {
      res.render('vwError/error', {
        statusCode: 500,
        status: 'fail',
        message: err.message,
        layout: 'main',
      })
    }
  },
};

export default boardController;
