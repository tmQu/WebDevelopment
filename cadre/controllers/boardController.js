const Board = require('../models/boardModel.js');

exports.getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find();

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
};

exports.getById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
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
};

exports.createBoard = async (req, res) => {
  try {
    const newBoard = await Board.create(req.body);
    console.log(req.body);
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
};

exports.updateBoard = async (req, res) => {
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

    const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
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
};

exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
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
};
