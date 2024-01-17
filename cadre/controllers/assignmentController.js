import User from "../models/userModel.js";

const assignmentController = {
    getAll: async (req, res) => {
        try {
            const users = await User.find();

            res.render('vwDepartment/area/areaAssignment', {
                status: 'success',
                data: users.map(user => user.toObject()),
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