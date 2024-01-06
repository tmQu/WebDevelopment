import boardModel from '../models/boardModel.js';
import boardLocationModel from '../models/boardLocationModel.js';
import wardModel from '../models/wardModel.js';
import districtModel from '../models/districtModel.js';
import locationCategoryModel from '../models/locationCategoryModel.js';
import advertisementFormModel from '../models/advtFormModel.js';
import boardTypeModel from '../models/boardTypeModel.js';


const districtController = {
    createDistrict: async (req, res) => {
        try {
            const newDistrict = await districtModel.create(req.body);
            res.status(201).json({
                status: "success",
                data: {
                    district: newDistrict,
                },
            });
        } catch (err) {
            res.status(400).json({
                status: "fail",
                message: err,
            });
        }
    }
}

export default districtController;