import User from "../models/userModel.js";
import District from "../models/districtModel.js";

const assignmentController = {
    getAll: async (req, res) => {
        try {
            const users = await User.find({ 'role.level': { $in: ['districts', 'wards'] } }).populate('role.detail');

            
            res.render('vwDepartment/area/areaAssignment', {
                status: 'success',

                data: await Promise.all(
                    users.map(async (user) => {
                        user = user.toObject();

                        let _role = '';
                        let _detail = '';
                        let _district = '';

                        if (user.role.detail === null) {
                            _detail = 'Chưa phân công';
                        }

                        if (user.role.level === 'districts') {
                            _role = 'Cán bộ Quận';

                            if (user.role.detail !== null) {
                                _detail = user.role.detail.district;
                            }
                        } else if (user.role.level === 'wards') {
                            _role = 'Cán bộ Phường';

                            if (user.role.detail !== null) {
                                _detail = user.role.detail.ward;
                                _district = await District.findById(user.role.detail.district);

                                _detail += ' - ' + _district.district;
                            }
                        }

                        return {
                            ...user,
                            _role: _role,
                            _detail: _detail,
                        }
                    })),
                layout: 'department',
            });
        } catch (err) {
            res.status(404).json({
                status: 'fail',
                message: err
            });
        }
    },
    upRole: async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { 'role.level': 'districts', 'role.detail': null });

            res.redirect('/assignment');
        } catch (err) {
            res.status(404).json({
                status: 'fail',
                message: err
            });
        }
    },
    downRole: async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { 'role.level': 'wards', 'role.detail': null });

            res.redirect('/assignment');
        } catch (err) {
            res.status(404).json({
                status: 'fail',
                message: err
            });
        }
    }
}

export default assignmentController;