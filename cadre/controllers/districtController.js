import districtModel from '../models/districtModel.js';

const districtController = {
    getAll: async (req, res) => {
        try {
            const districts = await districtModel.find();

            res.status(200).json({
                status: 'success',
                data: districts
            });
        } catch (err) {
            res.status(404).json({
                status: 'fail',
                message: err
            });
        }
    },
    getById: async (req, res) => {
        try {
            const district = await districtModel.findById(req.params.id);

            res.status(200).json({
                status: 'success',
                data: district
            });
        } catch (err) {
            res.status(404).json({
                status: 'fail',
                message: err
            });
        }
    },
    create: async (req, res) => {
        try {
            const newDistrict = await districtModel.create(req.body);

            res.redirect('/areas');
        } catch (err) {
            res.status(400).json({
                status: "fail",
                message: err,
            });
        }
    },
    update: async (req, res) => {
        try {
            const district = await districtModel.findByIdAndUpdate(
                req.params.id,
                req.body, {
                    new: true,
                    runValidators: true,
                }
            );
            res.status(200).json({
                status: "success",
                data: district
            });
        } catch (err) {
            res.status(400).json({
                status: "fail",
                message: err,
            });
        }
    },
    remove: async (req, res) => {
        try {
            await districtModel.findByIdAndDelete(req.params.id);

            res.status(204).json({
                status: "success",
                data: null,
            });
        } catch (err) {
            res.status(404).json({
                status: "fail",
                message: err,
            });
        }
    },
}

export default districtController;