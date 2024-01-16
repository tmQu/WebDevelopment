import Report from '../models/reportModel.js';
import userModel from '../models/userModel.js';
import wardModel from '../models/wardModel.js';
import Board from '../models/boardModel.js';
import BoardLocation from '../models/boardLocationModel.js';

import sendEmail from '../utils/email.js';
import emailTemplate from '../utils/emailTemplate.js';

import mongoose from 'mongoose';
import Mongoose from 'mongoose';
import axios from 'axios';
import districtModel from '../models/districtModel.js';

const ITEMS_PER_PAGE = 5; // Số lượng mục trên mỗi trang

const reportController = {
  createReport: async (req, res) => {
    try {
      const secret_key = '6Lebc04pAAAAANGsdaO-Gnq1h90GzWaEVoUGlD6x';
      const verify_link =
        'https://www.google.com/recaptcha/api/siteverify?secret=' + secret_key + '&response=' + req.body.captcha;
      var response = await axios.get(verify_link);
      if (response.data.success === false) {
        res.status(500).json({
          success: false,
          message: 'invalid captcha',
        });
        return;
      }
      var ward;
      var district;
      var location;
      var addr = req.body.addr;

      if (req.body.board != 'null') {
        var board = await Board.findById(req.body.board)
          .populate('boardLocation')
          .populate('boardLocation.addr.ward')
          .populate('boardLocation.addr.district');
        addr = `${board.boardLocation.addr.street_number} ${board.boardLocation.addr.route}, ${board.boardLocation.addr.ward.ward}, ${board.boardLocation.addr.district.district}, ${board.boardLocation.addr.city}`;
        ward = Mongoose.Types.ObjectId(board.boardLocation.addr.ward._id);
        district = Mongoose.Types.ObjectId(board.boardLocation.addr.district._id);
        location = board.boardLocation.location;
      } else {
        var district_id = await districtModel.find({ district: { $regex: req.body.district, $options: 'i' } });
        if (district_id.length == 0) {
          district = null;
          ward = null;
        } else {
          district_id = district_id[0]._id;
          district = Mongoose.Types.ObjectId(district_id);
          var ward_id = await wardModel.find({
            ward: { $regex: req.body.ward, $options: 'i' },
            district: mongoose.Types.ObjectId(district_id),
          });
          if (ward_id.length == 0) {
            ward = null;
          } else ward = Mongoose.Types.ObjectId(ward_id[0]._id);

          location = {
            lat: req.body.location.lat,
            lng: req.body.location.lng,
          };
        }
      }

      const report = new Report({
        ward: ward,
        district: district,
        location: location,
        sender: {
          fullname: req.body.sender.fullname,
          email: req.body.sender.email,
          phone: req.body.sender.phone,
        },
        board: req.body.board == 'null' ? null : req.body.board,
        method: req.body.method,
        images: req.files.map((file) => '/' + file.path),
        description: req.body.description,
        addr: addr,
      });
      console.log(report);
      var result = await report.save();
      var rp = await Report.findById(result._id).populate('method');
      res.status(200).json({
        success: true,
        message: 'Report created successfully',
        data: {
          report: rp,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get all reports
  getAllReports: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Trang mặc định là trang 1

      let reports = [];
      const query = {};

      if (req.user.role.level === 'wards') {
        query.ward = req.user.role.detail;
        let ward = await wardModel.findById(req.user.role.detail);
        query.district = ward.district;
      } else if (req.user.role.level === 'districts') {
        query.district = req.user.role.detail;
      }

      const options = {
        skip: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      };

      const totalItems = await Report.countDocuments(query);

      reports = await Report.find(query, null, options);

      // Get boardLocation of each board
      console.log(req.user)
      var number_statistic = [0,0,0]
      reports = await Promise.all(
        reports.map(async (report) => {
          let boardLocation = null;
          number_statistic[report.status + 1] += 1

          if (report.board) {
            boardLocation = await BoardLocation.findById(report.board.boardLocation);
            boardLocation = boardLocation.toObject();

            report = report.toObject();
          }

          return {
            ...report,
            boardLocation,
            createdAt: new Date(report.createdAt).toLocaleString(),
          };
        })
      );
      console.log(number_statistic)
      res.render('vwReport/reports', {
        isSuperAdmin: req.user.role.level === 'departmental',
        number_statistic: {
          pending: number_statistic[0],
          inprogress: number_statistic[1],
          done: number_statistic[2]
        },
        layout: 'list',
        reports: reports,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems, // Kiểm tra trang tiếp theo có tồn tại không
        hasPreviousPage: page > 1, // Kiểm tra trang trước có tồn tại không
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE), // Tính toán trang cuối cùng
      });

      // return reports;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 'fail',
        message: 'Server error',
      });
    }
  },

  // Get a report
  getByID_v1: async (req, res) => {
    try {
      let report = await Report.findById(req.params.id);
      let board;
      let boardLocation;
      if (report.board != null) {
        board = await Board.findById(report.board);

        boardLocation = await BoardLocation.findById(board.boardLocation);
        board = board.toObject();
        boardLocation = boardLocation.toObject();
      } else {
        board = null;
        boardLocation = null;
      }

      report = report.toObject();
      
      res.render('vwReport/reportDetails', {
        isSuperAdmin: req.user.role.level === 'departmental',
        layout: 'report',
        report: {
          ...report,
          createdAt: new Date(report.createdAt).toLocaleString(),
          method: {
            ...report.method,
            steps: report.method.steps.map((step, index) => {
              return {
                step: step,
                index: index + 1,
              };
            }),
          },
        },
        board,
        boardLocation,
        user: req.user._id,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 'fail',
        message: error.message,
      });
    }
  },
  getByID_v2: async (req, res) => {
    try {

      let report = await Report.findById(req.params.id);
      let board;
      let boardLocation;
      if (report.board != null) {
        board = await Board.findById(report.board);

        boardLocation = await BoardLocation.findById(board.boardLocation);
        board = board.toObject();
        boardLocation = boardLocation.toObject();
      }
      else {
        board = null;
        boardLocation = null;
      }

      report = report.toObject();

      // append server url
      var newImage = []
      report.images.forEach((img) => {
        img = process.env.SERVER_URL + img;
        newImage.push(img);
      })
      report.images = newImage;

      res.status(200).json(
        {
          success: true,
          message: 'Report created successfully',
          data: {
            report: report,
            board: board,
            boardLocation: boardLocation
          }
        })
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 'fail',
        message: error.message,
      });
    }
  },
  // Update a report
  updateReport: async (req, res) => {
    try {
      const { status } = req.body;

      await Report.findOneAndUpdate({ _id: req.params.id, status });

      res.status(200).json({
        success: true,
        message: 'Report updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Delete a report
  deleteReport: async (req, res) => {
    try {
      await Report.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Report deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Send email to reporter
  sendEmailToReporter: async (req, res) => {
    try {
      let subject = 'Thông báo xử lý báo cáo';
      let { email, updateDetails, statusDetails, sender, officer, reportId } = req.body;

      const user = await userModel.findById(officer);
      officer = user.role.level;

      let status = '';
      if (statusDetails === 'pending') status = -1;
      else if (statusDetails === 'inprogress') status = 0;
      else status = 1;

      const report = await Report.findByIdAndUpdate(reportId, { status: status, handleDetails: updateDetails, officer: officer });

      let html = emailTemplate.sendEmailReport(sender, statusDetails, updateDetails, officer);

      await sendEmail({
        email,
        subject,
        html: html,
      });

      res.redirect(`/reports/${reportId}`);
    } catch (error) {
      res.status(500).json({
        status: 'fail',
        message: error.message,
      });
    }
  },
};

export default reportController;
