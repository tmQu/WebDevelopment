import changeBoardModel from '../models/changeBoardModel.js';

const changeBoardController = {
  createChangeInfoReq: async (req, res) => {
    try {
      const newChangeInfoReq = await changeBoardModel.create({
        boardType: req.body.boardType,
        size: `${req.body.boardWidth}x${req.body.boardHeight}`,
        quantity: req.body.boardQuantity,
        reason: req.body.boardReason,
        imgBillboard: '/' + req.file.path,
        creator: req.body.creator,
        board: req.body.board,
        boardLocation: req.body.boardLocation,
      });

      res.redirect('/boardsLocation/' + req.body.boardLocation);
    } catch (err) {
      console.log(err);
      res.render('vwError/error', {
        statusCode: 500,
        status: 'fail',
        message: message,
        layout: 'main',
      });
    }
  },
};

export default changeBoardController;
