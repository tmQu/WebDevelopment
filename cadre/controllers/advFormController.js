import advFormModel from "../models/advFormModel.js";

const advFormController = {
    getAll: async (req, res) => {
        try {
            const advForms = await advFormModel.find();

            res.render('vwDepartment/advForm/advFormManagement', {
                success: true,
                results: advForms.length,
                data: advForms.map(advForm => advForm.toObject()),
                layout: 'department'
            });
        } catch (error) {
            res.render('vwDepartment/advForm/advFormManagement', {
                success: false,
                message: error.message,
                layout: 'department'
            });
        }
    },
    getByID: async (req, res) => {
        try {
            const advForm = await advFormModel.findById(req.params.id);

            res.status(200).json({
                success: true,
                data: advForm
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    create: async (req, res) => {
        try {
            const { advertisementForm } = req.body;

            const existingAdvForm = await advFormModel.findOne({ advertisementForm });

            if (existingAdvForm) {
                return res.status(400).json({
                    success: false,
                    message: 'This advertisement form already exists'
                });
            }

            const newAdvForm = await advFormModel.create(req.body);

            res.redirect('/advForms');
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    update: async (req, res) => {
        try {
            const advForm = await advFormModel.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });
            res.status(200).json({
                success: true,
                data: advForm,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },
    remove: async (req, res) => {
        try {
            console.log(req.params.id);
            await advFormModel.findByIdAndDelete(req.params.id);

            res.status(204).json({
                success: true,
                data: null
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default advFormController;