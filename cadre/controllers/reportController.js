import Report from "../models/reportModel.js";
import multer from "multer";

const reportController = {
    // Create a new report
    createReport: async (req, res) => {
        try {
            const storage = multer({ dest: 'api/v1/reports/' });
            const upload = storage.single('image');
            const report = new Report(
                {
                    sender: {
                        fullname: req.body.sender.fullname,
                        email: req.body.sender.email,
                        phone: req.body.sender.phone
                    },
                    board: req.body.board,
                    method: req.body.method,
                    image: {
                        data: req.body.image
                    },
                    description: req.body.description,
                    status: req.body.status
                }
            );

            const result = await report.save();
            //res.redirect('/viewReports');
            console.log(result);

            res.status(200).json({
                success: true,
                message: "Report created successfully",
                data: {
                    report: result
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get all reports
    getAllReports: async (req, res) => {
        try {
            const reports = await Report.find();
            // res.status(200).json({
            //     status: 'success',
            //     results: reports.length,
            //     data: {
            //       reports,
            //     },
            // });
            return reports;
            // const reports = await reportModel.find();
            // return reports;
        } catch (error) {
            console.log(error);
        }
        //     console.log('helo?');
        //     res.status(200).json({
        //         status: 'success',
        //         results: reports.length,
        //         data: {
        //           reports,
        //         },
        //     });
        // } catch (error) {
        //     res.status(500).json({
        //         success: false,
        //         message: error.message
        //     });
        // }
    },

    // Get a report
    getByID: async (req, res) => {
        try {
            const report = await Report.findById(req);
            //res.send(report.image.data);

            // res.status(200).json({
            //     status: 'success',
            //     results: report.length,
            //     data: {
            //       report, 
            //     },
            // });
            return report;
        } catch (error) {
            console.log(error);
        }
    },

    // Update a report
    updateReport: async (req, res) => {
        try {
            const { status } = req.body;

            await Report.findOneAndUpdate(
                { _id: req.params.id, status }
            );

            res.status(200).json({
                success: true,
                message: "Report updated successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Delete a report
    deleteReport: async (req, res) => {
        try {
            await Report.findByIdAndDelete(req.params.id);

            res.status(200).json({
                success: true,
                message: "Report deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

export default reportController;