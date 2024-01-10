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