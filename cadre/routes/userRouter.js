import express from 'express'
import userController from '../controllers/userController';


var userRouter = express.Router();

userRouter.get('/all', userController.getAll);
userRouter.get('/:id', userController.getById);
userRouter.delete('delete/:id', userController.deleteUser);
userRouter.post('/add', userController.addUser)

export default userRouter;