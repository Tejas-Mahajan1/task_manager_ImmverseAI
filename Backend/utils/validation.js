const User = require('../models/User');
const Task = require('../models/Task');

/**
 * Validate task data
 * @param {Object} taskData - Task data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
function validateTask(taskData) {
  const errors = [];
  
  if (!taskData.title || taskData.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!taskData.description || taskData.description.trim() === '') {
    errors.push('Description is required');
  }
  
  const validPriorities = ['Low', 'Medium', 'High'];
  if (!validPriorities.includes(taskData.priority)) {
    errors.push('Priority must be Low, Medium, or High');
  }
  
  const validStatuses = ['To Do', 'In Progress', 'Done'];
  if (!validStatuses.includes(taskData.status)) {
    errors.push('Status must be To Do, In Progress, or Done');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate user data
 * @param {Object} userData - User data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
function validateUser(userData) {
  const errors = [];
  
  if (!userData.username || userData.username.trim() === '') {
    errors.push('Username is required');
  }
  
  if (!userData.email || userData.email.trim() === '') {
    errors.push('Email is required');
  }
  
  // Check if username already exists
  if (User.exists(userData.username)) {
    errors.push('Username already exists');
  }

  // New: Check if email already exists (case-insensitive)
  if (User.emailExists(userData.email)) {
    errors.push('Email already exists');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate task dependencies
 * @param {Array} dependencies - Array of dependency task IDs
 * @returns {Object} - Validation result with isValid and errors
 */
function validateDependencies(dependencies) {
  const errors = [];
  
  for (const dependencyId of dependencies) {
    if (!Task.findById(dependencyId)) {
      errors.push(`Dependency task with ID ${dependencyId} not found`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate assigned user
 * @param {string} assignedTo - User ID to validate
 * @returns {Object} - Validation result with isValid and errors
 */
function validateAssignedUser(assignedTo) {
  const errors = [];
  
  if (assignedTo && !User.findById(assignedTo)) {
    errors.push('Assigned user not found');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateTask,
  validateUser,
  validateDependencies,
  validateAssignedUser
};
