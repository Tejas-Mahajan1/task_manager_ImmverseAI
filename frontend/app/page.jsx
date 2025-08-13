"use client";

import { useState, useEffect } from "react";
import TaskCard from "./components/TaskCard";
import Modal from "./components/Modal";

// API Base URL
const API_BASE_URL = "http://localhost:8000/api";

export default function Home() {
  // State management
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  // Form states
  const [loginForm, setLoginForm] = useState({ username: "" });
  const [userForm, setUserForm] = useState({ username: "", email: "" });
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "To Do",
    assignedTo: "",
    dependencies: [],
  });
  const [editTaskForm, setEditTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "To Do",
    assignedTo: "",
    dependencies: [],
  });

  // Filter states
  const [filters, setFilters] = useState({
    priority: "",
    status: "",
    assignedTo: "",
  });

  // View states
  const [viewMode, setViewMode] = useState("all"); // 'all', 'my-tasks', 'blocked'

  // Load initial data
  useEffect(() => {
    loadUsers();
    loadTasks();
    // Load and validate current user from localStorage on app start
    validateSavedUser();
  }, []);

  // Validate saved user session
  const validateSavedUser = async () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // Verify user still exists in the system
        const response = await fetch(`${API_BASE_URL}/users/${user.id}`);
        if (!response.ok) {
          // Backend not available or user not found
          localStorage.removeItem('currentUser');
          setCurrentUser(null);
        } else {
          const data = await response.json();
          if (data.success) {
            setCurrentUser(user);
          } else {
            // User no longer exists, clear from localStorage
            localStorage.removeItem('currentUser');
            setCurrentUser(null);
          }
        }
      } catch (error) {
        console.error('Error validating saved user:', error);
        // Network error or backend not available
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
      }
    }
    setUserLoading(false);
  };

  // API Functions
  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });
      const data = await response.json();
      if (data.success) {
        setUsers([...users, data.user]);
        setShowCreateUserModal(false);
        setUserForm({ username: "", email: "" });
        alert("User created successfully!");
      } else {
        alert("Error: " + data.errors.join(", "));
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user");
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        // Save user to localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setShowLoginModal(false);
        setLoginForm({ username: "" });
        alert("Login successful!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in");
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...taskForm,
        assignedTo: taskForm.assignedTo || null,
        dependencies: taskForm.dependencies.filter((d) => d),
      };

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      if (data.success) {
        setTasks([...tasks, data.task]);
        setShowCreateTaskModal(false);
        setTaskForm({
          title: "",
          description: "",
          priority: "Medium",
          status: "To Do",
          assignedTo: "",
          dependencies: [],
        });
        alert("Task created successfully!");
      } else {
        alert("Error: " + data.errors.join(", "));
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Error creating task");
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const markTaskComplete = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (data.success) {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, status: "Done" } : task
          )
        );
        alert("Task marked as complete!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error marking task complete:", error);
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setTasks(tasks.filter((task) => task.id !== taskId));
        alert("Task deleted successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Task editing functions
  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setEditTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo || "",
      dependencies: task.dependencies || [],
    });
    setShowEditTaskModal(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...editTaskForm,
        assignedTo: editTaskForm.assignedTo || null,
        dependencies: editTaskForm.dependencies.filter((d) => d),
      };

      const response = await fetch(`${API_BASE_URL}/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      if (data.success) {
        setTasks(
          tasks.map((task) =>
            task.id === editingTask.id ? data.task : task
          )
        );
        setShowEditTaskModal(false);
        setEditingTask(null);
        alert("Task updated successfully!");
      } else {
        alert("Error: " + data.errors.join(", "));
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error updating task");
    }
  };

  // Dependency management functions
  const addDependency = (taskId, dependencies) => {
    if (!dependencies.includes(taskId)) {
      return [...dependencies, taskId];
    }
    return dependencies;
  };

  const removeDependency = (taskId, dependencies) => {
    return dependencies.filter((id) => id !== taskId);
  };

  const getDependencyNames = (dependencyIds) => {
    return dependencyIds
      .map((id) => {
        const task = tasks.find((t) => t.id === id);
        return task ? task.title : "Unknown Task";
      })
      .join(", ");
  };

  // Filter tasks based on current filters and view mode
  const filteredTasks = tasks.filter((task) => {
    // Apply view mode filters
    if (viewMode === "my-tasks" && task.assignedTo !== currentUser?.id)
      return false;
    if (
      viewMode === "blocked" &&
      (task.status === "Done" || task.dependencies.length === 0)
    )
      return false;

    // Apply manual filters
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.status && task.status !== filters.status) return false;
    if (filters.assignedTo && task.assignedTo !== filters.assignedTo)
      return false;
    return true;
  });

  // Get user tasks
  const userTasks = currentUser
    ? tasks.filter((task) => task.assignedTo === currentUser.id)
    : [];

  // Get blocked tasks
  const blockedTasks = tasks.filter(
    (task) => task.status !== "Done" && task.dependencies.length > 0
  );

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          </div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading Task Manager...</p>
          <p className="mt-2 text-gray-400 text-sm">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Smart Task Manager
                </h1>
                <p className="text-sm text-gray-500">Organize, collaborate, succeed</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Welcome, {currentUser.username}!
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      // Clear user from localStorage on logout
                      localStorage.removeItem('currentUser');
                    }}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowCreateUserModal(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Create User
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{tasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Tasks</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{userTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blocked Tasks</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">{blockedTasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl mb-8 p-8 border border-white/20">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowCreateTaskModal(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create New Task</span>
              </button>
              <button
                onClick={loadTasks}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh Tasks</span>
              </button>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center space-x-2 bg-gray-100/50 p-2 rounded-xl">
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === "all"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-white/50 hover:text-gray-900"
                }`}
              >
                All Tasks
              </button>
              {currentUser && (
                <button
                  onClick={() => setViewMode("my-tasks")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === "my-tasks"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-white/50 hover:text-gray-900"
                  }`}
                >
                  My Tasks
                </button>
              )}
              <button
                onClick={() => setViewMode("blocked")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === "blocked"
                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-white/50 hover:text-gray-900"
                }`}
              >
                Blocked Tasks
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                <span>Filters:</span>
              </span>
              <select
                value={filters.priority}
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="" className="text-gray-900">All Priorities</option>
                <option value="High" className="text-gray-900">High</option>
                <option value="Medium" className="text-gray-900">Medium</option>
                <option value="Low" className="text-gray-900">Low</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="" className="text-gray-900">All Statuses</option>
                <option value="To Do" className="text-gray-900">To Do</option>
                <option value="In Progress" className="text-gray-900">In Progress</option>
                <option value="Done" className="text-gray-900">Done</option>
              </select>

              <select
                value={filters.assignedTo}
                onChange={(e) =>
                  setFilters({ ...filters, assignedTo: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="" className="text-gray-900">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id} className="text-gray-900">
                    {user.username}
                  </option>
                ))}
              </select>

              <button
                onClick={() =>
                  setFilters({ priority: "", status: "", assignedTo: "" })
                }
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
              onDelete={deleteTask}
              onMarkComplete={markTaskComplete}
              onUpdateStatus={updateTaskStatus}
              onEdit={openEditTaskModal}
              getDependencyNames={getDependencyNames}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-6">Create your first task to get started!</p>
            <button
              onClick={() => setShowCreateTaskModal(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Your First Task
            </button>
          </div>
        )}
      </main>

      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login"
      >
        <form onSubmit={loginUser} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Username
            </label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) =>
                setLoginForm({ ...loginForm, username: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-200"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        title="Create New User"
      >
        <form onSubmit={createUser} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Username
            </label>
            <input
              type="text"
              value={userForm.username}
              onChange={(e) =>
                setUserForm({ ...userForm, username: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-200"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Email
            </label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-200"
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create User
            </button>
            <button
              type="button"
              onClick={() => setShowCreateUserModal(false)}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        title="Create New Task"
      >
        <form onSubmit={createTask} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Title
            </label>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-200"
              placeholder="Enter task title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Description
            </label>
            <textarea
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-200"
              rows="4"
              placeholder="Enter task description"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Priority
              </label>
              <select
                value={taskForm.priority}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, priority: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-200"
              >
                <option value="Low" className="text-gray-900">Low</option>
                <option value="Medium" className="text-gray-900">Medium</option>
                <option value="High" className="text-gray-900">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Status
              </label>
              <select
                value={taskForm.status}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-200"
              >
                <option value="To Do" className="text-gray-900">To Do</option>
                <option value="In Progress" className="text-gray-900">In Progress</option>
                <option value="Done" className="text-gray-900">Done</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Assign To
            </label>
            <select
              value={taskForm.assignedTo}
              onChange={(e) =>
                setTaskForm({ ...taskForm, assignedTo: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              <option value="" className="text-gray-900">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id} className="text-gray-900">
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          
          {/* Dependencies Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Dependencies
            </label>
            <div className="space-y-3">
              <div className="max-h-32 overflow-y-auto hide-scrollbar smooth-scroll border border-gray-300 rounded-xl p-3 bg-white/80 backdrop-blur-sm">
                {tasks.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-2">No tasks available for dependencies</p>
                ) : (
                  tasks.map((task) => (
                    <label key={task.id} className="flex items-center space-x-3 py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={taskForm.dependencies.includes(task.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTaskForm({
                              ...taskForm,
                              dependencies: addDependency(task.id, taskForm.dependencies)
                            });
                          } else {
                            setTaskForm({
                              ...taskForm,
                              dependencies: removeDependency(task.id, taskForm.dependencies)
                            });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.priority} • {task.status}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>
              {taskForm.dependencies.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Selected dependencies:</span> {getDependencyNames(taskForm.dependencies)}
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Task
            </button>
            <button
              type="button"
              onClick={() => setShowCreateTaskModal(false)}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditTaskModal}
        onClose={() => setShowEditTaskModal(false)}
        title="Edit Task"
      >
        <form onSubmit={updateTask} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Title
            </label>
            <input
              type="text"
              value={editTaskForm.title}
              onChange={(e) =>
                setEditTaskForm({ ...editTaskForm, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-200"
              placeholder="Enter task title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Description
            </label>
            <textarea
              value={editTaskForm.description}
              onChange={(e) =>
                setEditTaskForm({ ...editTaskForm, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-200"
              rows="4"
              placeholder="Enter task description"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Priority
              </label>
              <select
                value={editTaskForm.priority}
                onChange={(e) =>
                  setEditTaskForm({ ...editTaskForm, priority: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-200"
              >
                <option value="Low" className="text-gray-900">Low</option>
                <option value="Medium" className="text-gray-900">Medium</option>
                <option value="High" className="text-gray-900">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Status
              </label>
              <select
                value={editTaskForm.status}
                onChange={(e) =>
                  setEditTaskForm({ ...editTaskForm, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-200"
              >
                <option value="To Do" className="text-gray-900">To Do</option>
                <option value="In Progress" className="text-gray-900">In Progress</option>
                <option value="Done" className="text-gray-900">Done</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Assign To
            </label>
            <select
              value={editTaskForm.assignedTo}
              onChange={(e) =>
                setEditTaskForm({ ...editTaskForm, assignedTo: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              <option value="" className="text-gray-900">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id} className="text-gray-900">
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          
          {/* Dependencies Selection for Edit */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Dependencies
            </label>
            <div className="space-y-3">
              <div className="max-h-32 overflow-y-auto hide-scrollbar smooth-scroll border border-gray-300 rounded-xl p-3 bg-white/80 backdrop-blur-sm">
                {tasks.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-2">No tasks available for dependencies</p>
                ) : (
                  tasks
                    .filter((task) => task.id !== editingTask?.id) // Prevent self-dependency
                    .map((task) => (
                      <label key={task.id} className="flex items-center space-x-3 py-2 hover:bg-gray-50 rounded-lg px-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editTaskForm.dependencies.includes(task.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditTaskForm({
                                ...editTaskForm,
                                dependencies: addDependency(task.id, editTaskForm.dependencies)
                              });
                            } else {
                              setEditTaskForm({
                                ...editTaskForm,
                                dependencies: removeDependency(task.id, editTaskForm.dependencies)
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                          <p className="text-xs text-gray-500">{task.priority} • {task.status}</p>
                        </div>
                      </label>
                    ))
                )}
              </div>
              {editTaskForm.dependencies.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Selected dependencies:</span> {getDependencyNames(editTaskForm.dependencies)}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Update Task
            </button>
            <button
              type="button"
              onClick={() => setShowEditTaskModal(false)}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
