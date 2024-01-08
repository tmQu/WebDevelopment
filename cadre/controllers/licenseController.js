import licenseModel from "../models/licenseModel.js";
import boardModel from "../models/boardModel.js";
import boardLocationModel from "../models/boardLocationModel.js";


const licenseController = { 
    renderLicenseForm: async (req, res) => {
        try {
            var boardId = req.params.id;
            var board = await boardModel.findById(boardId).populate('boardType');
            board = board.toObject();
            board.boardType = board.boardType.boardType;

            var board_location = await boardLocationModel.findById(board.boardLocation)
                                    .populate('advertisementForm')
                                    .populate('locationCategory')
                                    .populate('addr.district')
                                    .populate('addr.ward');
            board_location = board_location.toObject();
            board_location.addr = `${board_location.addr.street_number} ${board_location.addr.route}, ${board_location.addr.ward.ward}, ${board_location.addr.district.district}, ${board_location.addr.city}`;
            board_location.locationCategory = board_location.locationCategory.map(category => category.locationCategory).join('/');
            board_location.advertisementForm = board_location.advertisementForm.advertisementForm;
            console.log(board_location);
            res.render('vwForm/license', { 
                layout: 'main' ,
                imgBoardLocation: board_location.imgBillboardLocation[0],
                plan: (board_location.isPlanning == true ? 'Đã quy hoạch' : 'Chưa quy hoạch'),
                boardLocation: board_location,
                board: board
            });
        } catch (err) {
            console.log(err);
        }
    },
    getLicense: async (req, res) => {
        try {
            const license = await licenseModel.find().populate('board');
            res.json(license);
        } catch (err) {
            console.log(err);
        }
    },
    createLicense: async (req, res) => {
        try {
            var license = {};
            console.log(req.file);
            console.log(req.body);
            license.imgBoard = 'http://localhost:4000/'+ req.file.path;
            license.imgBoard.replace("\\", "/");
            license.board = req.params.id;
            license.content = req.body.content;
            license.company = {
                infor: req.body.infor,
                email: req.body.email,
                phone: req.body.phone,
                addr: req.body.addr
            };
            license.status = 'Chưa xử lý';
            license.period = {
                start_date: new Date(req.body.start_date),
                end_date: new Date(req.body.end_date)
            }

            console.log(license)

            const newLicense = await licenseModel.create(license);
            res.json(newLicense);
        } catch (err) {
            console.log(err);
        }
    },
    renderLicenseList: async (req, res) => {
        try {

        }
        catch(err)
        {
            
        }
    },
    updateLicense: async (req, res) => {
        try {
            const updateLicense = await licenseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updateLicense);
        } catch (err) {
            console.log(err);
        }
    },
    deleteLicense: async (req, res) => {
        try {
            const deleteLicense = await licenseModel.findByIdAndDelete(req.params.id);
            res.json(deleteLicense);
        } catch (err) {
            console.log(err);
        }
    }
}

export default licenseController;