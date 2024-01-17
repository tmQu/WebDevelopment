import wardModel from '../models/wardModel.js';
import districtModel from '../models/districtModel.js';

const wardController = {
    getAll: async (req, res) => {
        try {
            const wards = await wardModel.find().populate('district');

            res.status(200).json({
                status: 'success',
                data: wards
            });
        } catch (err) {
            res.status(404).json({
                status: 'fail',
                message: err
            });
        }
    },
    getOfDistrict: async (req, res) => {
        try {       
            const wards = await wardModel.find({ 'district': { $in: req.query.districts } });

            res.status(200).json({
                status: 'success',
                length: wards.length,
                data: wards
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
            const ward = await wardModel.findById(req.params.id);

            res.status(200).json({
                status: 'success',
                data: ward
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
            const newWard = await wardModel.create(req.body);

            res.redirect('/areas?districts=' + req.body.district);
        } catch (err) {
            res.status(400).json({
                status: 'fail',
                message: err
            });
        }
    },
    update: async (req, res) => {
        try {
            const ward = await wardModel.findByIdAndUpdate(
                req.params.id,
                req.body, {
                    new: true,
                    runValidators: true,
                }
            );

            console.log('ward: ', ward);
            res.status(200).json({
                status: "success",
                data: ward
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
            await wardModel.findByIdAndDelete(req.params.id);
            res.status(204).json({
                status: "success",
                data: null,
            });
        } catch (err) {
            res.status(400).json({
                status: "fail",
                message: err,
            });
        }
    }
}

export default wardController;