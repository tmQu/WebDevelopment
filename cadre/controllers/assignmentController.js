import User from "../models/userModel.js";

const assignmentController = {
    getAll: async (req, res) => {
        try {
            const users = await User.find({ 'role.level': { $in: ['districts', 'wards'] } });

            res.render('vwDepartment/area/areaAssignment', {
                status: 'success',
                data: users.map(user => {
                    user = user.toObject();

                    let _role = '';
                    if (user.role.level === 'districts') {
                        _role = 'Cán bộ Quận';
                    } else if (user.role.level === 'wards') {
                        _role = 'Cán bộ Phường';
                    }

                    return {
                        ...user,
                        _role: _role,
                    }
                }),
                layout: 'department',
            });
        } catch (err) {
            res.status(404).json({
                status: 'fail',
                message: err
            });
        }
    }
}

export default assignmentController;