import boardModel from '../models/boardLocationModel.js';
import accountModel from '../models/accountModel.js';

const boardController = {
  getAllBoards: async (req, res) => {
    try {
      let query = boardModel.find();

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
  getById: async (req, res) => {
    try {
      const board = await boardModel.find({_id: req.params.id});
      console.log(board[0])
      res.status(200).json({
        status: 'success',
        data: board[0],
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
