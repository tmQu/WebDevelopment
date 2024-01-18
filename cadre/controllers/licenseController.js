import licenseModel from "../models/licenseModel.js";
import boardModel from "../models/boardModel.js";
import boardLocationModel from "../models/boardLocationModel.js";
import convertVNTime from "../utils/convertVNTime.js";
import districtModel from '../models/districtModel.js'
import wardModel from '../models/wardModel.js'
import mongoose from 'mongoose';
import { io } from '../app.js';

const ITEMS_PER_PAGE = 4; // Số lượng mục trên mỗi trang
const licenseController = {
    renderLicenseForm: async (req, res) => {
        try {
            console.log('test');
            var boardId = req.params.id;

            var board = await boardModel.findById(boardId).populate('boardType');
            board = board.toObject();

            var board_location = await boardLocationModel.findById(board.boardLocation)
                .populate('advertisementForm')
                .populate('locationCategory')
                .populate('addr.district')
                .populate('addr.ward');


            board_location = board_location.toObject();
            board_location.addr = `${board_location.addr.street_number} ${board_location.addr.route}, ${board_location.addr.ward.ward}, ${board_location.addr.district.district}, ${board_location.addr.city}`;
            board_location.locationCategory = board_location.locationCategory.map(category => category.locationCategory).join('/');
            board_location.advertisementForm = board_location.advertisementForm.advertisementForm;
            console.log(board_location)
            res.render('vwLicense/license', {
                layout: 'license',
                imgBoardLocation: board_location.imgBillboardLocation[0],
                plan: (board_location.isPlan == true ? 'Đã quy hoạch' : 'Chưa quy hoạch'),
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
            console.log('test');
            var board = await boardModel.findById(req.params.id).populate('boardLocation');
            var license = {};
            console.log(req.file);
            console.log(req.body);
            license.imgBoard = '\\' + req.file.path;
            license.board = req.params.id;
            license.content = req.body.content;
            license.company = {
                infor: req.body.infor,
                email: req.body.email,
                phone: req.body.phone,
                addr: req.body.addr
            };
            license.status = false;
            license.createAt = new Date();
            license.period = {
                start_date: new Date(req.body.start_date),
                end_date: new Date(req.body.end_date)
            }
            
            license.ward = mongoose.Types.ObjectId(board.boardLocation.addr.ward._id);
            license.district = mongoose.Types.ObjectId(board.boardLocation.addr.district._id);

            

            const newLicense = await licenseModel.create(license);
            res.redirect('/api/v1/license/list');
        } catch (err) {
            console.log(err);
        }
    },
    renderLicenseList: async (req, res) => {
        try {

            const page = parseInt(req.query.page) || 1;
            var query = {};
            var filter = req.session.filter
            if (req.user.role.level === 'wards') {
                query['ward'] = mongoose.Types.ObjectId(req.user.role.detail);

                
            } else if (req.user.role.level === 'districts') {
                query['district'] = mongoose.Types.ObjectId(req.user.role.detail);
            }


            if (filter) {
                query = {
                    $and: [
                      query,
                    {'addr.ward': {$in: filter.wards.map((ward)=>{return mongoose.Types.ObjectId(ward)})}}
                    ]
                }
            }
            var total = await licenseModel.countDocuments(query);


            
            var licenses = await licenseModel.find(query).populate('board')
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);


            var districtId = []
            var wardId = []
            console.log(licenses.length)
            licenses = await Promise.all(licenses.map(async (license) => {
                license = license.toObject()
                var boardLocation = 'Bảng quảng cáo đã bị xóa'
                
                if (license.board !== null)
                    boardLocation = await boardLocationModel.findById(license.board.boardLocation).populate('addr.district').populate('addr.ward').lean();
                else
                {
                    license.board = {boardLocation: {addr: 'Điểm đặt quảng cáo đã bị xóa'}}
                }
                if (boardLocation != 'Bảng quảng cáo đã bị xóa'){
                    license.board.boardLocation.addr = `${boardLocation.addr.street_number} ${boardLocation.addr.route}, ${boardLocation.addr.ward.ward}, ${boardLocation.addr.district.district}, ${boardLocation.addr.city}`;
                    districtId.push(mongoose.Types.ObjectId(boardLocation.addr.district._id))
                    wardId.push(mongoose.Types.ObjectId(boardLocation.addr.ward._id));
                }
        
                license.period.start_date = convertVNTime(license.period.start_date);
                license.period.end_date = convertVNTime(license.period.end_date);
                license.createAt = convertVNTime(license.createAt);
                return license
            }));
            console.log(licenses.length)
            var districts = await districtModel.find({ _id: { $in: districtId } }).lean();
            var wards = await wardModel.find({ _id: { $in: wardId } }).lean();
            console.log(districts)
            console.log(req.user)
            res.render('vwLicense/licenseTable', {
                //isSuperAdmin: req.user.role.level === 'departmental',
                layout: 'license',
                isSuperAdmin: req.user.role.level === 'departmental',
                license: licenses,
                districts: districts,
                wards: JSON.stringify(wards),
                SERVER_URL: process.env.SERVER_URL,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page <= total,
                nextPage: page + 1,
                hasPreviousPage: page > 1,
                previousPage: page - 1,
                lastPage: Math.ceil(total / ITEMS_PER_PAGE)
            });

        }
        catch (err) {
            console.log(err);
            res.status(400).json({
                status: 'fail'
            });
        }
    },
    renderDetailForm: async (req, res) => {
        try {
            var id = req.query.id;
            var action = req.query.action;
            var link
            if (action === 'view') {
                link = ''
            }
            else if (action === 'delete') {
                link = process.env.SERVER_URL + `/api/v1/license/delete/${id}`;
            }
            else if (action === 'approve') {
                link = process.env.SERVER_URL + `/api/v1/license/approve/${id}`;
            }
            var license = await licenseModel.findById(id).lean();
            license.period.start_date = convertVNTime(license.period.start_date);
            license.period.end_date = convertVNTime(license.period.end_date);
            var board = await boardModel.findById(license.board).populate('boardType').lean();


            var board_location = await boardLocationModel.findById(board.boardLocation)
                .populate('advertisementForm')
                .populate('locationCategory')
                .populate('addr.district')
                .populate('addr.ward');


            board_location = board_location.toObject();
            board_location.addr = `${board_location.addr.street_number} ${board_location.addr.route}, ${board_location.addr.ward.ward}, ${board_location.addr.district.district}, ${board_location.addr.city}`;
            board_location.locationCategory = board_location.locationCategory.map(category => category.locationCategory).join('/');
            board_location.advertisementForm = board_location.advertisementForm.advertisementForm;

            res.render('vwLicense/license_detail', {
                isSuperAdmin: req.user.role.level === 'departmental',
                layout: 'license',
                imgBoardLocation: board_location.imgBillboardLocation[0],
                plan: (board_location.isPlan == true ? 'Đã quy hoạch' : 'Chưa quy hoạch'),
                boardLocation: board_location,
                board: board,
                license: license,
                action: {
                    link: link,
                    approve: action === 'approve' ? true : false,
                    delete: action === 'delete' ? true : false
                },
                SERVER_URL: process.env.SERVER_URL
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({
                status: 'fail'
            });
        }
    },
    approveLicense: async (req, res) => {

        try {
            console.log('aprrove')
            var approve = req.body.approve;
            if (approve == 'true') {
                approve = true;
                var license = await licenseModel.findById(req.params.id);

                await boardModel.findByIdAndUpdate(license.board, { isLicense: true, imgBillboard: license.imgBoard, expireDate: license.period.end_date });
            }
            else {
                approve = false;
            }
            const updateLicense = await licenseModel.findByIdAndUpdate(req.params.id, { status: true, approve: approve });
            io.emit('update status', { id: req.params.id, status: true, approve: approve });
            res.redirect(process.env.SERVER_URL + '/api/v1/license/list')
        } catch (err) {
            console.log(err);
        }
    },
    deleteLicense: async (req, res) => {
        try {
            var license = await licenseModel.findById(req.params.id)
            if (license.status === false) {
                const deleteLicense = await licenseModel.findByIdAndDelete(req.params.id);
            }
            else {
                // render error page
                render.render('vwError/error', {
                    statusCode: statusCode,
                    status: status,
                    message: 'Yêu cầu đã được xét duyệt không thể xóa',
                    layout: 'department',
                  });
            }
            res.redirect(process.env.SERVER_URL + '/api/v1/license/list');
        } catch (err) {
            console.log(err);
            res.render('vwError/error', {
                statusCode: statusCode,
                status: status,
                message: message,
                layout: 'department',
            });
        }
    }
}

export default licenseController;