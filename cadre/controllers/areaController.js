import wardModel from "../models/wardModel.js";
import districtModel from "../models/districtModel.js";

const areaController = {
    getAll: async (req, res) => {
        try {
            const selectedDistricts = [].concat(req.query.districts || []);
            const districts = await districtModel.find();
            const wards = await wardModel.find({ 'district': { $in: req.query.districts } }).populate('district');

            res.render('vwDepartment/area/areaManagement', {
                status: 'success',
                districts: districts.map(district => district.toObject()),
                wards: wards.map(ward => {
                    ward = ward.toObject();
                    return {
                        ...ward,
                        district: ward.district
                    }
                }),
                selectedDistricts: selectedDistricts
            });
        } catch (err) {
            res.status(404).json({
                status: 'fail',
                message: err
            });
        }
    }
}

export default areaController;