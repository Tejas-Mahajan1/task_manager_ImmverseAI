const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
  getUserById
} = require('../controllers/userController');

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post('/', createUser);

/**
 * @route   POST /api/users/login
 * @desc    Login a user (mock authentication)
 * @access  Public
 */
router.post('/login', loginUser);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', getAllUsers);

/**
 * @route   GET /api/users/:userId
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:userId', getUserById);

module.exports = router;
