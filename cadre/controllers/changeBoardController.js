import changeBoardModel from '../models/changeBoardModel.js';
import boardLocationModel from '../models/boardLocationModel.js';
import boardTypeModel from '../models/boardTypeModel.js';
import boardModel from '../models/boardModel.js';

const changeBoardController = {
  createChangeInfoReq: async (req, res) => {
    try {
      var boardType = await boardTypeModel.findById(req.body.boardType);
      console.log(boardType);
      var unit = boardType.boardType.split(' ')[0].toLowerCase() + '/bảng';

      const newChangeInfoReq = await changeBoardModel.create({
        boardType: req.body.boardType,
        size: `${req.body.boardWidth}x${req.body.boardHeight}`,
        quantity: `${req.body.boardQuantity} ${unit}`,
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
        message: err.message,
        layout: 'main',
      });
    }
  },
  deleteReq: async (req, res) => {
    try {
      // Delete image in ../static/db/advs first, then delete its in database
      const changeBoard = await changeBoardModel.findById(req.params.id);
      const imgPath = changeBoard.imgBillboard;
      const imgPathArr = imgPath.split('/');
      const imgName = imgPathArr[imgPathArr.length - 1];

      fs.unlink('./static/db/advs/' + imgName, (err) => {
        if (err) {
          console.log(err);
        }
      });

      const deleteReq = await changeBoardModel.findByIdAndDelete(req.params.id);

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

  updateChangeInfoReq: async (req, res) => {
    try {
      const changeBoard = await changeBoardModel.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
      });
      res.redirect('/boardsLocation/' + changeBoard.boardLocation);
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
      let requests = await changeBoardModel.find();
      var filter = req.session.filter;
      const user = req.user;
      console.log(filter)
      requests = await Promise.all(
        requests.map(async (request) => {
          let boardLocation = await boardLocationModel.findById(request.boardLocation);
          if (filter && !filter.wards.includes(boardLocation.addr.ward._id.toString())) {
            
            return null;
          }

          boardLocation = boardLocation.toObject();
          return {
            ...request.toObject(),
            boardLocation: {
              ...boardLocation,
              addr: {
                ...boardLocation.addr,
                ward: boardLocation.addr.ward.ward,
                district: boardLocation.addr.district.district,
              },
              locationCategory: boardLocation.locationCategory,
              advertisementForm: boardLocation.advertisementForm.advertisementForm,
            },
          };
        })
      );

      requests = requests.filter(request => request !== null)
      res.render('vwRequest/boardRequestList', {
        requests,
        user: user.toObject(),
        layout: 'list',
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
      let request = await changeBoardModel.findById(req.params.id).populate('boardLocation');
      let oldBoard = await boardModel.findById(request.board).populate('boardLocation');
      const user = req.user;

      request = request.toObject();
      oldBoard = oldBoard.toObject();

      res.render('vwRequest/boardRequestDetails', {
        newBoard: {
          ...request,
          boardType: request.boardType,
          boardLocation: {
            ...request.boardLocation,
            addr: {
              ...request.boardLocation.addr,
              ward: request.boardLocation.addr.ward.ward,
              district: request.boardLocation.addr.district.district,
            },
            locationCategory: request.boardLocation.locationCategory,
            advertisementForm: request.boardLocation.advertisementForm.advertisementForm,
          },
        },
        oldBoard: {
          ...oldBoard,
          boardType: oldBoard.boardType,
          boardLocation: {
            ...request.boardLocation,
            addr: {
              ...request.boardLocation.addr,
              ward: request.boardLocation.addr.ward.ward,
              district: request.boardLocation.addr.district.district,
            },
            locationCategory: request.boardLocation.locationCategory,
            advertisementForm: request.boardLocation.advertisementForm.advertisementForm,
          },
        },
        user: user.toObject(),
        layout: 'list',
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
      const changeBoard = await changeBoardModel.findById(req.params.id);
      const board = await boardModel.findById(changeBoard.board);

      // Get ?approve=true or false in url
      const approve = req.query.approve;
      if (approve === 'true') {
        // Update board
        await boardModel.findByIdAndUpdate(board._id, {
          boardType: changeBoard.boardType,
          size: changeBoard.size,
          quantity: changeBoard.quantity,
          imgBillboard: changeBoard.imgBillboard,
        });

        // Update status of changeBoard
        await changeBoardModel.findByIdAndUpdate(req.params.id, {
          status: 1,
        });
      } else {
        await changeBoardModel.findByIdAndUpdate(req.params.id, {
          status: -1,
        });
      }

      res.redirect('/boardRequest/' + req.params.id)

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

export default changeBoardController;
