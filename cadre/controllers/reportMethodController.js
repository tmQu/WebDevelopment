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

            res.render('vwDepartment/reportMethod/reportMethodManagement', {
                success: true,
                results: methods.length,
                data: methods.map(method => method.toObject()),
                layout: 'department'
            });
        } catch (error) {
            res.render('vwDepartment/reportMethod/reportMethodManagement', {
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

            const existingMethod = await reportMethodModel.findOne({ reportMethod });

            if (existingMethod) {
                return res.status(400).json({
                    success: false,
                    message: 'Method already exists'
                });
            }

            const method = await reportMethodModel.create({ reportMethod });

            res.redirect('/reportMethods');
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    updateMethod: async (req, res) => {
        try {
            const { reportMethod } = req.body;
            const method = await reportMethodModel.findByIdAndUpdate(req.params.id, { reportMethod });
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
    deleteMethod: async (req, res) => {
        try {
            await reportMethodModel.findByIdAndDelete(req.params.id);
            
            res.status(200).json({
                success: true,
                data: null
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