import boardLocationModel from '../models/boardLocationModel.js';
import boardModel from '../models/boardModel.js';
import boardTypeModel from '../models/boardTypeModel.js';
import advtFormModel from '../models/advtFormModel.js';
import locationCategoryModel from '../models/locationCategoryModel.js';
import wardModel from '../models/wardModel.js';

const ITEMS_PER_PAGE = 5; // Số lượng mục trên mỗi trang

const boardLocationController = {
  viewAllBoardLocation: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Trang mặc định là trang 1

      let boardLocation = [];
      const query = {};

      if (req.user.role.level === 'wards') {
        query['addr.ward'] = req.user.role.detail;
        let ward = await wardModel.findById(req.user.role.detail);
        query['addr.district'] = ward.district;
      } else if (req.user.role.level === 'districts') {
        query['addr.district'] = req.user.role.detail;
      }

      const options = {
        skip: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      };

      const totalItems = await boardLocationModel.countDocuments(query);
      boardLocation = await boardLocationModel.find(query, null, options);

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

      // console.log(boardLocation, boards, boardType, user);

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
      console.log(boardLocation);
      res.render('vwBoard/boardLocationRequest', {
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
};

export default boardLocationController;
