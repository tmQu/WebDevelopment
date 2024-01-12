import changeBoardModel from '../models/changeBoardModel.js';

const changeBoardController = {
  createChangeInfoReq: async (req, res) => {
    try {
      // console.log(req.body);
      const newChangeInfoReq = await changeBoardModel.create({
        boardType: req.body.boardType,
        size: req.body.boardSize,
        quantity: req.body.quantity,
        reason: req.body.reason,
        imgBillboard: '/' + req.file.path,
        creator: req.body.creator,
        board: req.body.board,
        boardLocation: req.body.boardLocation,
      });

      res.status(201).json({
        status: 'success',
        data: {
          changeInfoReq: newChangeInfoReq,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        status: 'fail',
        message: err,
      });
    }
  },
};

export default changeBoardController;
