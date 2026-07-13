const Todo = require('../models/Todo');

// @desc    Get all todos for the logged-in user
// @route   GET /api/todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch todos.', error: error.message });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
exports.createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Todo title is required.' });
    }

    const newTodo = new Todo({ title, user: req.userId });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create todo.', error: error.message });
  }
};

// @desc    Update an existing todo
// @route   PUT /api/todos/:id
exports.updateTodo = async (req, res) => {
  try {
    const { title, completed } = req.body;
    
    let todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized.' });
    }

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update todo.', error: error.message });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized.' });
    }
    res.json({ message: 'Todo deleted successfully.', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete todo.', error: error.message });
  }
};

// @desc    Update todo completion status
// @route   PATCH /api/todos/:id/status
exports.updateTodoStatus = async (req, res) => {
  try {
    const { completed } = req.body;

    // 1. Validation: Ensure the completed field is a boolean
    if (completed === undefined || typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'Please provide a valid completed boolean status.' });
    }

    // 2. Find the todo and verify ownership
    let todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized.' });
    }

    // 3. Update status and save
    todo.completed = completed;
    const updatedTodo = await todo.save();

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status.', error: error.message });
  }
};