import licenseModel from "../models/licenseModel.js";
import boardModel from "../models/boardModel.js";
import boardLocationModel from "../models/boardLocationModel.js";
import convertVNTime from "../utils/convertVNTime.js";
import districtModel from '../models/districtModel.js'
import wardModel from '../models/wardModel.js'
import mongoose from 'mongoose';
import {io} from '../app.js';
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
                layout: 'license' ,
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
            console.log('test');
            var license = {};
            console.log(req.file);
            console.log(req.body);
            license.imgBoard = req.file.path;
            license.imgBoard.replace("\\", "/");
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

            console.log(license)

            const newLicense = await licenseModel.create(license);
            res.redirect('/api/v1/license/list');
        } catch (err) {
            console.log(err);
        }
    },
    renderLicenseList: async (req, res) => {
        try {

            const page = parseInt(req.query.page) || 1;
            var filter  = {};
            var total = await licenseModel.countDocuments(filter);
            
            

            var licenses = await licenseModel.find(filter).populate({
                path: 'board', 
                populate : {
                    path : 'boardLocation',
                    populate : {
                        path : 'addr.district'
                    },
                    populate: {
                        path: 'addr.ward'
                    }
                }
            })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
            


            var districtId = []
            var wardId = []

            licenses = licenses.map(license => license.toObject());
            licenses.forEach(license => {
                districtId.push(mongoose.Types.ObjectId(license.board.boardLocation.addr.district._id))
                wardId.push(mongoose.Types.ObjectId(license.board.boardLocation.addr.ward._id));

                license.board.boardLocation.addr = `${license.board.boardLocation.addr.street_number} ${license.board.boardLocation.addr.route}, ${license.board.boardLocation.addr.ward.ward}, ${license.board.boardLocation.addr.district.district}, ${license.board.boardLocation.addr.city}`;
                license.period.start_date = convertVNTime(license.period.start_date);
                license.period.end_date = convertVNTime(license.period.end_date);
                license.createAt = convertVNTime(license.createAt);

            });
            console.log(licenses)
            var districts = await districtModel.find({_id: {$in: districtId}}).lean();
            var wards = await wardModel.find({_id: {$in: wardId}}).lean();
            console.log(districts)
            console.log(wards)
            res.render('vwLicense/licenseTable', {
                layout: 'license',
                license: licenses,
                districts: districts,
                wards: JSON.stringify(wards),
                SERVER_URL: process.env.SERVER_URL,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < total,
                hasNextPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(total / ITEMS_PER_PAGE)
            });
            
        }
        catch(err)
        {
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
            if (action === 'view')
            {
                link = ''
            }
            else if (action === 'delete'){
                link = process.env.SERVER_URL +  `/api/v1/license/delete/${id}`;
            }
            else if(action === 'approve'){
                link =  process.env.SERVER_URL +  `/api/v1/license/approve/${id}`;
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
                layout: 'license' ,
                imgBoardLocation: board_location.imgBillboardLocation[0],
                plan: (board_location.isPlanning == true ? 'Đã quy hoạch' : 'Chưa quy hoạch'),
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
        catch(err)
        {
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
            if (approve == 'true')
            {
                approve = true;
                license = await licenseModel.findById(req.params.id);
                await findByIdAndUpdate(license.board, {isLicense: true});
            }
            else{
                approve = false;
            }
            const updateLicense = await licenseModel.findByIdAndUpdate(req.params.id, {status: true, approve: approve});
            io.emit('update status', {id: req.params.id, status: true, approve: approve});
            res.json(updateLicense);
        } catch (err) {
            console.log(err);
        }
    },
    deleteLicense: async (req, res) => {
        try {
            var license = await licenseModel.findById(req.params.id)
            if (license.status === false)
            {
                const deleteLicense = await licenseModel.findByIdAndDelete(req.params.id);
            }
            else {
                // render error page

            }
            res.redirect(process.env.SERVER_URL + '/api/v1/license/list');
        } catch (err) {
            console.log(err);
        }
    }
}

export default licenseController;