import changeInfoReqModel from "../models/changeInfoReqModel.js";

const changeInfoReqController = {
  createChangeInfoReq: async (req, res) => {
    try {
      const newChangeInfoReq = await changeInfoReqModel.create({
        ...req.body,
        creator: req.user._id,
      });
      res.status(201).json({
        status: "success",
        data: {
          changeInfoReq: newChangeInfoReq,
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