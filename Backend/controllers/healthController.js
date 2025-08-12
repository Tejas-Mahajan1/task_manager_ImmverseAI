const User = require('../models/User');
const Task = require('../models/Task');

/**
 * Health check endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const healthCheck = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Task Manager API is running',
      timestamp: new Date().toISOString(),
      stats: {
        users: User.getCount(),
        tasks: Task.getCount()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
};

/**
 * API statistics endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const apiStats = async (req, res) => {
  try {
    // Import the apiStats object from logger middleware
    const { apiStats } = require('../middleware/logger');
    
    const uptime = Math.floor((new Date() - apiStats.startTime) / 1000);
    
    res.json({
      success: true,
      message: 'API Statistics',
      timestamp: new Date().toISOString(),
      stats: {
        uptime: `${uptime} seconds`,
        totalRequests: apiStats.totalRequests,
        requestsPerSecond: uptime > 0 ? (apiStats.totalRequests / uptime).toFixed(2) : 0,
        endpoints: apiStats.requests
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get API statistics',
      error: error.message
    });
  }
};

module.exports = {
  healthCheck,
  apiStats
};
