import Report from '../models/reportModel.js';
import Board from '../models/boardModel.js';
import BoardLocation from '../models/boardLocationModel.js';
import sendEmail from '../utils/email.js';
import multer from 'multer';
import path from 'path';
import he from 'he';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../static/img/reports/');
  },
  filename: function (req, file, cb) {
    // Create unique filename (timestamp + ext)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    cb(null, true);
  },
}).array('image', 2); // 2 is the max number of files

const reportController = {
  // Create a new report
  createReport: (req, res) => {
    upload(req, res, async (error) => {
      if (error) {
        // Handle error
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      try {
        // Create new report
        const report = new Report({
          sender: {
            fullname: req.body.sender.fullname,
            email: req.body.sender.email,
            phone: req.body.sender.phone,
          },
          board: req.body.board,
          method: req.body.method,
          images: req.files.map((file) => file.path), // Array of image paths
          description: req.body.description,
          status: req.body.status,
        });

        const result = await report.save();
        console.log(result);

        res.status(200).json({
          success: true,
          message: 'Report created successfully',
          data: {
            report: result,
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });
  },

  // Get all reports
  getAllReports: async (req, res) => {
    try {
      let reports = await Report.find();

      //   return res.json(
      //     {
      //       status: 'success',
      //       results: reports.length,
      //       data: {
      //         reports,
      //       },
      //     },
      //   );
      res.render('vwReport/reports', {
        layout: 'report',
        reports: reports.map((report) => {
          report = report.toObject();
          return {
            ...report,
            createdAt: new Date(report.createdAt).toLocaleString(),
          };
        }),
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
  getByID: async (req, res) => {
    try {
      let report = await Report.findById(req.params.id);
      let board = await Board.findById(report.board);
      if (board === null) {
        return res.status(404).json({
          status: 'fail',
          message: 'Board not found',
        });
      }
      let boardLocation = await BoardLocation.findById(board.boardLocation);

      report = report.toObject();
      board = board.toObject();
      boardLocation = boardLocation.toObject();

      res.render('vwReport/reportDetails', {
        layout: 'report',
        report: {
          ...report,
          createdAt: new Date(report.createdAt).toLocaleString(),
        },
        board,
        boardLocation,
      });
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
      let { email, subject, html } = req.body;
      html = he.decode(html);

      await sendEmail({
        email,
        subject,
        html,
      });

      res.status(200).json({
        status: 'success',
        message: 'Email sent successfully',
      });
    } catch (error) {
      res.status(500).json({
        status: 'fail',
        message: error.message,
      });
    }
  },
};

export default reportController;
