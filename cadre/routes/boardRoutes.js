const boardController = require('../controllers/boardController');
const express = require('express');
const router = express.Router();

router
  .route('/')
  .get(boardController.getAllBoards)
  .post(boardController.createBoard);

router
  .route('/:id')
  .get(boardController.getById)
  .patch(boardController.updateBoard)
  .delete(boardController.deleteBoard);

module.exports = router;
