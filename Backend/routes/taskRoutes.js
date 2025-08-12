const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getUserTasks,
  getBlockedTasks,
  getTaskById,
  updateTask,
  markTaskComplete,
  deleteTask
} = require('../controllers/taskController');

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Public
 */
router.post('/', createTask);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with optional filtering
 * @access  Public
 */
router.get('/', getAllTasks);

/**
 * @route   GET /api/tasks/blocked
 * @desc    Get blocked tasks
 * @access  Public
 */
router.get('/blocked', getBlockedTasks);

/**
 * @route   GET /api/tasks/user/:userId
 * @desc    Get tasks for a specific user
 * @access  Public
 */
router.get('/user/:userId', getUserTasks);

/**
 * @route   GET /api/tasks/:taskId
 * @desc    Get a specific task
 * @access  Public
 */
router.get('/:taskId', getTaskById);

/**
 * @route   PUT /api/tasks/:taskId
 * @desc    Update a task
 * @access  Public
 */
router.put('/:taskId', updateTask);

/**
 * @route   PATCH /api/tasks/:taskId/complete
 * @desc    Mark task as complete
 * @access  Public
 */
router.patch('/:taskId/complete', markTaskComplete);

/**
 * @route   DELETE /api/tasks/:taskId
 * @desc    Delete a task
 * @access  Public
 */
router.delete('/:taskId', deleteTask);

module.exports = router;
