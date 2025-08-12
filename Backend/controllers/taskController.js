const Task = require('../models/Task');
const User = require('../models/User');
const { validateTask, validateDependencies, validateAssignedUser } = require('../utils/validation');

/**
 * Create a new task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, assignedTo, dependencies = [] } = req.body;
    
    const validation = validateTask({ title, description, priority, status });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }
    
    // Validate assigned user if provided
    const assignedUserValidation = validateAssignedUser(assignedTo);
    if (!assignedUserValidation.isValid) {
      return res.status(400).json({
        success: false,
        errors: assignedUserValidation.errors
      });
    }
    
    // Validate dependencies if provided
    if (dependencies.length > 0) {
      const dependencyValidation = validateDependencies(dependencies);
      if (!dependencyValidation.isValid) {
        return res.status(400).json({
          success: false,
          errors: dependencyValidation.errors
        });
      }
    }
    
    const newTask = Task.create(title, description, priority, status, assignedTo, dependencies);
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: newTask.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all tasks with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllTasks = async (req, res) => {
  try {
    const { priority, status, assignedTo } = req.query;
    
    let allTasks = Task.findAll();
    
    // Apply filters
    if (priority) {
      allTasks = allTasks.filter(task => task.priority === priority);
    }
    
    if (status) {
      allTasks = allTasks.filter(task => task.status === status);
    }
    
    if (assignedTo) {
      allTasks = allTasks.filter(task => task.assignedTo === assignedTo);
    }
    
    res.json({
      success: true,
      tasks: allTasks.map(task => task.toJSON())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get tasks for a specific user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!User.findById(userId)) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const userTasks = Task.findByUser(userId);
    
    res.json({
      success: true,
      tasks: userTasks.map(task => task.toJSON())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get blocked tasks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getBlockedTasks = async (req, res) => {
  try {
    const blockedTasks = Task.getBlockedTasks();
    
    res.json({
      success: true,
      tasks: blockedTasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get a specific task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      task: task.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, status, assignedTo, dependencies } = req.body;
    
    const task = Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Validate task data if provided
    if (title || description || priority || status) {
      const validation = validateTask({
        title: title || task.title,
        description: description || task.description,
        priority: priority || task.priority,
        status: status || task.status
      });
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }
    }
    
    // Validate assigned user if provided
    if (assignedTo !== undefined) {
      const assignedUserValidation = validateAssignedUser(assignedTo);
      if (!assignedUserValidation.isValid) {
        return res.status(400).json({
          success: false,
          errors: assignedUserValidation.errors
        });
      }
    }
    
    // Validate dependencies if provided
    if (dependencies) {
      const dependencyValidation = validateDependencies(dependencies);
      if (!dependencyValidation.isValid) {
        return res.status(400).json({
          success: false,
          errors: dependencyValidation.errors
        });
      }
    }
    
    // Update task
    const updates = {
      title,
      description,
      priority,
      status,
      assignedTo,
      dependencies
    };
    
    const updatedTask = Task.update(taskId, updates);
    
    res.json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Mark task as complete
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const markTaskComplete = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    try {
      task.markAsComplete();
      
      res.json({
        success: true,
        message: 'Task marked as complete',
        task: task.toJSON()
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Check if this task is a dependency for other tasks
    if (Task.isDependencyForOtherTasks(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete task. It is a dependency for other tasks.'
      });
    }
    
    Task.delete(taskId);
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getUserTasks,
  getBlockedTasks,
  getTaskById,
  updateTask,
  markTaskComplete,
  deleteTask
};
