# Smart Task Manager Backend API

A robust Express.js backend for managing tasks with user authentication, task dependencies, and real-time collaboration features. Built with a clean MVC architecture for maintainability and scalability.

## Features

- **User Management**: Create users, login, and view all users
- **Task Management**: Create, read, update, delete tasks with full CRUD operations
- **Task Dependencies**: Tasks can depend on other tasks and can only be completed when dependencies are finished
- **Task Assignment**: Assign tasks to specific users
- **Priority & Status**: Tasks have priorities (Low/Medium/High) and statuses (To Do/In Progress/Done)
- **Filtering**: Filter tasks by priority, status, and assigned user
- **Blocked Tasks**: View tasks that cannot be completed due to incomplete dependencies
- **In-Memory Storage**: Uses Map data structures for fast in-memory operations
- **Clean Architecture**: Organized in MVC pattern with separated concerns
- **Request Logging**: Detailed logging of all API requests with timestamps and response times
- **API Analytics**: Real-time statistics on endpoint usage and performance metrics
- **Graceful Shutdown**: Proper server shutdown with statistics reporting

## Project Structure

```
Backend/
├── app.js                 # Main Express application (44 lines vs 621 lines!)
├── package.json           # Dependencies and scripts
├── README.md              # Updated documentation
├── models/                # Data models and business logic
│   ├── User.js           # User model with in-memory storage
│   └── Task.js           # Task model with dependency logic
├── controllers/           # Request handlers and business logic
│   ├── userController.js  # User-related operations
│   ├── taskController.js  # Task-related operations
│   └── healthController.js # Health check endpoint
├── routes/                # API route definitions
│   ├── userRoutes.js      # User API routes
│   └── taskRoutes.js      # Task API routes
├── middleware/            # Custom middleware
│   ├── errorHandler.js    # Error handling middleware
│   └── logger.js          # Request logging and analytics middleware
└── utils/                 # Utility functions
    └── validation.js      # Data validation utilities
```

## Installation

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. For production:
```bash
npm start
```

The server will start on `http://localhost:5000`

## Architecture Overview

### Models
- **User.js**: Handles user data storage and operations
- **Task.js**: Manages task data, dependencies, and completion logic

### Controllers
- **userController.js**: Handles user creation, login, and retrieval
- **taskController.js**: Manages task CRUD operations and business logic
- **healthController.js**: Provides API health status

### Routes
- **userRoutes.js**: Defines user-related API endpoints
- **taskRoutes.js**: Defines task-related API endpoints

### Middleware
- **errorHandler.js**: Centralized error handling and 404 responses

### Utils
- **validation.js**: Data validation functions for users and tasks

### Middleware
- **errorHandler.js**: Centralized error handling and 404 responses
- **logger.js**: Request logging, response time tracking, and API usage statistics

## API Endpoints

### Health & Monitoring
- **GET** `/api/health` - Check API status and statistics
- **GET** `/api/stats` - Get detailed API usage statistics and endpoint analytics

### User Management

#### Create User
- **POST** `/api/users`
- **Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com"
}
```

#### Login User
- **POST** `/api/users/login`
- **Body:**
```json
{
  "username": "john_doe"
}
```

#### Get All Users
- **GET** `/api/users`

#### Get User by ID
- **GET** `/api/users/:userId`

### Task Management

#### Create Task
- **POST** `/api/tasks`
- **Body:**
```json
{
  "title": "Implement Login Feature",
  "description": "Create user authentication system",
  "priority": "High",
  "status": "To Do",
  "assignedTo": "user-id-here",
  "dependencies": ["task-id-1", "task-id-2"]
}
```

#### Get All Tasks
- **GET** `/api/tasks`
- **Query Parameters:**
  - `priority` - Filter by priority (Low/Medium/High)
  - `status` - Filter by status (To Do/In Progress/Done)
  - `assignedTo` - Filter by assigned user ID

#### Get User Tasks
- **GET** `/api/tasks/user/:userId`

#### Get Blocked Tasks
- **GET** `/api/tasks/blocked`

#### Get Specific Task
- **GET** `/api/tasks/:taskId`

#### Update Task
- **PUT** `/api/tasks/:taskId`
- **Body:** (all fields optional)
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "priority": "Medium",
  "status": "In Progress",
  "assignedTo": "new-user-id",
  "dependencies": ["new-dependency-id"]
}
```

#### Mark Task as Complete
- **PATCH** `/api/tasks/:taskId/complete`

#### Delete Task
- **DELETE** `/api/tasks/:taskId`

## Data Models

### User
```javascript
{
  id: "uuid",
  username: "string",
  email: "string",
  createdAt: "ISO date string"
}
```

### Task
```javascript
{
  id: "uuid",
  title: "string",
  description: "string",
  priority: "Low" | "Medium" | "High",
  status: "To Do" | "In Progress" | "Done",
  assignedTo: "user-id" | null,
  dependencies: ["task-id-1", "task-id-2"],
  createdAt: "ISO date string",
  updatedAt: "ISO date string"
}
```

## Business Logic

### Task Dependencies
- Tasks can have dependencies on other tasks
- A task can only be marked as "Done" when all its dependencies are completed
- Tasks with incomplete dependencies are considered "blocked"
- You cannot delete a task that is a dependency for other tasks

### Validation Rules
- **Task Title & Description**: Required and cannot be empty
- **Priority**: Must be "Low", "Medium", or "High"
- **Status**: Must be "To Do", "In Progress", or "Done"
- **Username**: Required and must be unique
- **Email**: Required for user creation
- **Assigned User**: Must be a valid user ID if provided
- **Dependencies**: Must be valid task IDs if provided

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Example Usage

### 1. Create a User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "email": "alice@example.com"}'
```

### 2. Create a Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Setup Database",
    "description": "Configure database connection",
    "priority": "High",
    "status": "To Do",
    "assignedTo": "user-id-here"
  }'
```

### 3. Get All Tasks
```bash
curl http://localhost:5000/api/tasks
```

### 4. Filter Tasks by Priority
```bash
curl "http://localhost:5000/api/tasks?priority=High"
```

### 5. Mark Task as Complete
```bash
curl -X PATCH http://localhost:5000/api/tasks/task-id-here/complete
```

## Development

### Key Features Implemented
- ✅ User creation and authentication
- ✅ Task CRUD operations
- ✅ Task dependencies and completion logic
- ✅ Task assignment to users
- ✅ Priority and status management
- ✅ Filtering capabilities
- ✅ Blocked tasks detection
- ✅ Comprehensive validation
- ✅ Error handling
- ✅ In-memory data storage
- ✅ RESTful API design
- ✅ Clean MVC architecture
- ✅ Separated concerns
- ✅ Modular code structure

### Code Organization Benefits
- **Maintainability**: Each component has a single responsibility
- **Scalability**: Easy to add new features and endpoints
- **Testability**: Controllers and models can be tested independently
- **Readability**: Clear separation of concerns makes code easier to understand
- **Reusability**: Models and utilities can be reused across different parts of the application

### Testing the API

You can test the API using tools like:
- **Postman** - GUI-based API testing
- **cURL** - Command-line HTTP client
- **Thunder Client** - VS Code extension
- **Insomnia** - API testing tool

## Next Steps

The backend is now ready for the frontend integration. The API provides all necessary endpoints for:
- User management and authentication
- Complete task lifecycle management
- Dependency tracking and validation
- Real-time task status updates

The organized structure makes it easy to:
- Add new features
- Implement authentication middleware
- Add database integration
- Create comprehensive tests
- Scale the application

The frontend can now consume these endpoints to build a full-featured task management application. 