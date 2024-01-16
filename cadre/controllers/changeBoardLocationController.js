import changeBoardLocationModel from "../models/changeBoardLocationModel.js";
import locationCategoryModel from "../models/locationCategoryModel.js";
import boardLocationModel from "../models/boardLocationModel.js";
import wardModel from "../models/wardModel.js";
import districtModel from "../models/districtModel.js";
import mongoose from "mongoose";
import sanitizeHtml from 'sanitize-html';

const changeBoardLocationController = {
  createChangeBoardLocationReq: async (req, res) => {
    try {
      console.log(req.body.boardLocation);
      const district_id = await districtModel.find({ district: { $regex: req.body.district, $options: 'i' } });
      const ward_id = await wardModel.find({ ward: { $regex: req.body.ward, $options: 'i' }, district: district_id[0]._id });

      const changeBoardLocationReq = await changeBoardLocationModel.create({
        boardLocation: req.body.boardLocation,
        reason: sanitizeHtml(req.body.boardReason),
        creator: req.body.creator,
        addr: {
          street_number: req.body.street_number,
          route: req.body.route,
          ward: mongoose.Types.ObjectId(ward_id[0]._id),
          district: mongoose.Types.ObjectId(district_id[0]._id),
          city: req.body.city,
        },
        location: {
          lat: req.body.lat,
          lng: req.body.lng,
        },
        imgBillboardLocation: req.files.map((file) => '/' + file.path),
        // num_board: req.body.boardQuantity,
        advertisementForm: req.body.advertisementForm,
        locationCategory: req.body.locationCategory,
      });

      res.redirect('/boardsLocation/' + req.body.boardLocation);
    } catch (err) {
      console.log(err);
      res.render('vwError/error', {
        statusCode: 500,
        status: 'fail',
        message: err.message,
        layout: 'main',
      });
    }
  },
}

export default changeBoardLocationController;