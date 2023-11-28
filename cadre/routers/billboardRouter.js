import express from 'express'
import billboardController from '../controller/billboardController.js';

var billboardRouter = express.Router();

billboardRouter.get('/all', billboardController.getAllLocation)
billboardRouter.get('/detail', billboardController.getById);

export default billboardRouter;