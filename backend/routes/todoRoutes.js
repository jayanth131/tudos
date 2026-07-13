const express = require('express');
const router = express.Router();
const { getTodos, createTodo, updateTodo, deleteTodo,updateTodoStatus } = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all todo routes using the authentication middleware
router.use(authMiddleware);

router.route('/')
  .get(getTodos)
  .post(createTodo);

router.route('/:id')
  .put(updateTodo)
  .delete(deleteTodo);

router.patch('/:id/status', updateTodoStatus);

module.exports = router;