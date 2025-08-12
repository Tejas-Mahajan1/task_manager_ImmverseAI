const express = require('express');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Import controllers
const { healthCheck, apiStats } = require('./controllers/healthController');

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { requestLogger, statsLogger, printApiStats } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware (add before routes)
app.use(requestLogger);
app.use(statsLogger);

// Health check endpoint
app.get('/api/health', healthCheck);

// API Statistics endpoint
app.get('/api/stats', apiStats);

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', notFoundHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Task Manager Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 API Statistics: http://localhost:${PORT}/api/stats`);
  console.log(`👥 Users endpoint: http://localhost:${PORT}/api/users`);
  console.log(`📋 Tasks endpoint: http://localhost:${PORT}/api/tasks`);
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  printApiStats();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  printApiStats();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;
