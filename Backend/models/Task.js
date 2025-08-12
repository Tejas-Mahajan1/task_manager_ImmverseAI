const { v4: uuidv4 } = require("uuid");

// In-memory storage for tasks
const tasks = new Map();

class Task {
  constructor(
    title,
    description,
    priority,
    status,
    assignedTo = null,
    dependencies = []
  ) {
    this.id = uuidv4();
    this.title = title.trim();
    this.description = description.trim();
    this.priority = priority;
    this.status = status;
    this.assignedTo = assignedTo;
    this.dependencies = dependencies;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Static methods for task management
  static create(
    title,
    description,
    priority,
    status,
    assignedTo = null,
    dependencies = []
  ) {
    const task = new Task(
      title,
      description,
      priority,
      status,
      assignedTo,
      dependencies
    );
    tasks.set(task.id, task);
    return task;
  }

  static findById(id) {
    return tasks.get(id);
  }

  static findAll() {
    return Array.from(tasks.values());
  }

  static findByUser(userId) {
    return Array.from(tasks.values()).filter(
      (task) => task.assignedTo === userId
    );
  }

  static findByPriority(priority) {
    return Array.from(tasks.values()).filter(
      (task) => task.priority === priority
    );
  }

  static findByStatus(status) {
    return Array.from(tasks.values()).filter((task) => task.status === status);
  }

  static findByAssignedUser(userId) {
    return Array.from(tasks.values()).filter(
      (task) => task.assignedTo === userId
    );
  }

  static getBlockedTasks() {
    const blockedTasks = [];
    for (const [taskId, task] of tasks) {
      if (task.status !== "Done" && !this.canCompleteTask(taskId)) {
        blockedTasks.push({ ...task, id: taskId });
      }
    }
    return blockedTasks;
  }

  static canCompleteTask(taskId) {
    const task = tasks.get(taskId);
    if (!task) return false;

    // Check if all dependencies are complete
    for (const dependencyId of task.dependencies) {
      const dependency = tasks.get(dependencyId);
      if (!dependency || dependency.status !== "Done") {
        return false;
      }
    }
    return true;
  }

  static isDependencyForOtherTasks(taskId) {
    for (const [_, task] of tasks) {
      if (task.dependencies.includes(taskId)) {
        return true;
      }
    }
    return false;
  }

  static update(id, updates) {
    const task = tasks.get(id);
    if (!task) return null;

    // Update fields
    if (updates.title !== undefined) task.title = updates.title.trim();
    if (updates.description !== undefined)
      task.description = updates.description.trim();
    if (updates.priority !== undefined) task.priority = updates.priority;
    if (updates.status !== undefined) task.status = updates.status;
    if (updates.assignedTo !== undefined) task.assignedTo = updates.assignedTo;
    if (updates.dependencies !== undefined)
      task.dependencies = updates.dependencies;

    task.updatedAt = new Date().toISOString();

    return task;
  }

  static delete(id) {
    return tasks.delete(id);
  }

  static getCount() {
    return tasks.size;
  }

  // Instance methods
  markAsComplete() {
    if (this.status === "Done") {
      throw new Error("Task is already completed");
    }

    if (!Task.canCompleteTask(this.id)) {
      throw new Error(
        "Task cannot be completed. Dependencies are not finished."
      );
    }

    this.status = "Done";
    this.updatedAt = new Date().toISOString();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: this.status,
      assignedTo: this.assignedTo,
      dependencies: this.dependencies,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Task;
