import boardLocationModel from '../models/boardLocationModel.js';
import boardModel from '../models/boardModel.js';
import boardTypeModel from '../models/boardTypeModel.js';

const ITEMS_PER_PAGE = 5; // Số lượng mục trên mỗi trang

const boardLocationController = {
  viewAllBoardLocation: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Trang mặc định là trang 1

      const totalItems = await boardLocationModel.countDocuments(); // Tính tổng số mục

      let boardLocation = await boardLocationModel
        .find()
        .skip((page - 1) * ITEMS_PER_PAGE) // Bỏ qua mục không cần thiết
        .limit(ITEMS_PER_PAGE); // Giới hạn số lượng mục trên mỗi trang

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
        hasNextPage: ITEMS_PER_PAGE * page < totalItems, // Kiểm tra trang tiếp theo có tồn tại không
        hasPreviousPage: page > 1, // Kiểm tra trang trước có tồn tại không
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE), // Tính toán trang cuối cùng
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
      let boards = await boardModel.find({ boardLocation: req.params.id });
      let boardType = await boardTypeModel.find();
      const user = req.user._id;

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
};

export default boardLocationController;
