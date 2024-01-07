import boardLocationModel from '../models/boardLocationModel.js';
import boardModel from '../models/boardModel.js';
import accountModel from '../models/accountModel.js';
import  mongoose from 'mongoose';

const boardController = {
  getAllBoardLocation: async (req, res) => {
    try {

      let query = boardLocationModel.find()
                        .populate('advertisementForm')
                        .populate('locationCategory')
                        .populate('addr.district')
                        .populate('addr.ward');

      const boards = await query;

      if (boards.length === 0 || !boards) {
        return res.status(404).json({
          status: 'fail',
          message: 'No boards found',
        });
      }

      res.status(200).json({
        status: 'success',
        results: boards.length,
        data: 
          boards,
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

      const board = await boardLocationModel.findById(req.params.id)
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


      var boards = await boardModel.find({boardLocation: mongoose.Types.ObjectId(req.params.id)}).populate('boardType');
      var boardLocation = await boardLocationModel.findById(req.params.id)
                        .populate('advertisementForm')
                        .populate('locationCategory')
                        .populate('addr.district')
                        .populate('addr.ward');


      res.status(200).json({
        status: 'success',
        data: {
          boards: boards,
          boardLocation: boardLocation
        }
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
      const allowedUpdates = [
        'addr',
        'location',
        'isPlan',
        'advertisementForm',
        'locationCategory',
      ];
      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid updates!' });
      }

      const board = await boardModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

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
      const board = await boardModel.findByIdAndDelete({_id: req.params.id});
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
};

export default boardController;
