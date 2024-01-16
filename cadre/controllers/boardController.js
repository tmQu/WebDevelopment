import boardLocationModel from '../models/boardLocationModel.js';
import boardModel from '../models/boardModel.js';
import boardTypeModel from '../models/boardTypeModel.js';
import mongoose from 'mongoose';

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
        imgBillboard: '/' + req.file.path,
        boardLocation: req.body.boardLocation
      }
      var board = await boardModel.create(data);


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
      console.log('test')
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
      const board = await boardModel.findByIdAndDelete({ _id: req.params.id });
      if (!board) {
        return res.status(404).json({
          status: 'fail',
          message: err,
        });
      }

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err,
      });
    }
  },

  viewBoard: async (req, res) => {
    try {
      let action = req.query.action;
      let board = await boardModel.findById(req.params.boardId);
      let boardLocation = await boardLocationModel.findById(req.params.id);
      let boardType = await boardTypeModel.find();
      const user = req.user;

      const boardWidth = board.size.split('x')[0];
      const boardHeight = board.size.split('x')[1];
      const boardQuantity = board.quantity.split(' ')[0];
      
      board = board.toObject();

      board = {
        ...board,
        width: boardWidth,
        height: boardHeight,
        quantity: boardQuantity,
      };
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
            edit: action === 'edit',
          },
          boardType,
          user: user.toObject(),
          layout: 'report',
        });
      }

      // request change board
      res.render('vwBoard/boardRequest', {
        isSuperAdmin: req.user.role.level === 'departmental',
        board,
        boardLocation,
        boardType,
        user: user.toObject(),
        layout: 'report',
      });


    } catch (err) {
      console.log(err);
    }
  },
};

export default boardController;
