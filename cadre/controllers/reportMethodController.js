import reportMethodModel from "../models/reportMethodModel.js";

const reportMethodController = {
    getAllMethods: async (req, res) => {
        try {
            const methods = await reportMethodModel.find();
            res.status(200).json({
                success: true,
                results: methods.length,
                data: {
                    methods,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    getAllMethods_v2: async (req, res) => {
        try {
            const methods = await reportMethodModel.find();
            res.render('vwDepartment/reportMethodManagement', {
                success: true,
                results: methods.length,
                data: methods,
                layout: 'department'
            });
        } catch (error) {
            res.render('vwDepartment/reportMethodManagement', {
                success: false,
                message: error.message,
                layout: 'department'
            });
        }
    },
    getByID: async (req, res) => {
        try {
            const method = await reportMethodModel.findById(req.params.id);
            res.status(200).json({
                success: true,
                data: method
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    createMethod: async (req, res) => {
        try {
            const { reportMethod } = req.body;
            const method = await reportMethodModel.create({ reportMethod });
            res.status(200).json({
                success: true,
                data: method
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

export default reportMethodController;