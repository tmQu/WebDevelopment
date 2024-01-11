import changeBoardModel from "../models/changeBoardModel.js";

const changeBoardController = {
  createChangeInfoReq: async (req, res) => {
    try {
      const newChangeInfoReq = await changeBoardModel.create({
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