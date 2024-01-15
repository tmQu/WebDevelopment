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
      const newBoard = await boardModel.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          board: newBoard,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err,
      });
    }
  },
  updateBoard: async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['addr', 'location', 'isPlan', 'advertisementForm', 'locationCategory', 'status'];
      const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid updates!' });
      }

      const board = await boardModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        status: 'success',
        data: {
          board,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err,
      });
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

      res.render('vwBoard/boardRequest', {
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
