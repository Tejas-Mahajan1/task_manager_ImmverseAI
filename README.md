# Smart Task Manager

A modern, full-stack task management web application built with **Next.js** frontend and **Node.js/Express** backend. This application provides a beautiful, responsive interface for managing tasks, users, and project workflows with real-time collaboration features.

## 🚀 Features

### User Management
- **User Registration**: Create new users with username and email (unique validation)
- **User Login**: Simple mock authentication system
- **User Dashboard**: Personalized view for logged-in users
- **Email Uniqueness**: Prevents duplicate email registrations

### Task Management
- **Create Tasks**: Add new tasks with title, description, priority, and status
- **Task Assignment**: Assign tasks to specific users
- **Task Dependencies**: Support for task dependencies (tasks that depend on other tasks)
- **Status Management**: Track task progress (To Do, In Progress, Done)
- **Priority Levels**: Set task priorities (Low, Medium, High)
- **Task Actions**: Start, pause, complete, and delete tasks

### Advanced Features
- **Real-time Updates**: Instant UI updates when tasks are modified
- **Filtering System**: Filter tasks by priority, status, and assigned user
- **View Modes**: 
  - All Tasks: View all tasks in the system
  - My Tasks: View tasks assigned to the current user
  - Blocked Tasks: View tasks that cannot be completed due to dependencies
- **Dependency Validation**: Tasks can only be completed when dependencies are finished
- **API Analytics**: Real-time statistics on endpoint usage and performance metrics
- **Request Logging**: Detailed logging of all API requests with timestamps

### UI/UX Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional design with TailwindCSS
- **Glassmorphism Effects**: Beautiful glass-like UI elements
- **Interactive Cards**: Beautiful task cards with hover effects and animations
- **Modal Dialogs**: Clean modal interfaces for forms
- **Loading States**: Smooth loading indicators with dual spinning animations
- **Error Handling**: User-friendly error messages
- **Statistics Dashboard**: Overview cards showing key metrics

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.4.6
- **Styling**: TailwindCSS 4
- **Language**: JavaScript (ES6+)
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API
- **Development**: Turbopack for fast development

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Architecture**: MVC (Model-View-Controller) pattern
- **Data Storage**: In-memory (Map data structures)
- **Validation**: Custom validation utilities
- **Logging**: Comprehensive request/response logging
- **CORS**: Cross-origin resource sharing enabled

## 📁 Project Structure

```
task_manager/
├── Backend/                    # Express.js backend API
│   ├── app.js                 # Main Express application
│   ├── package.json           # Backend dependencies
│   ├── README.md              # Backend documentation
│   ├── models/                # Data models and business logic
│   │   ├── User.js           # User model with in-memory storage
│   │   └── Task.js           # Task model with dependency logic
│   ├── controllers/           # Request handlers and business logic
│   │   ├── userController.js  # User-related operations
│   │   ├── taskController.js  # Task-related operations
│   │   └── healthController.js # Health check and API stats
│   ├── routes/                # API route definitions
│   │   ├── userRoutes.js      # User API routes
│   │   └── taskRoutes.js      # Task API routes
│   ├── middleware/            # Custom middleware
│   │   ├── errorHandler.js    # Error handling middleware
│   │   └── logger.js          # Request logging and analytics
│   └── utils/                 # Utility functions
│       └── validation.js      # Data validation utilities
├── frontend/                  # Next.js frontend application
│   ├── app/                   # Next.js app directory
│   │   ├── components/        # Reusable UI components
│   │   │   ├── TaskCard.jsx   # Individual task display component
│   │   │   └── Modal.jsx      # Reusable modal component
│   │   ├── globals.css        # Global styles
│   │   ├── layout.jsx         # Root layout component
│   │   └── page.jsx           # Main application page
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   └── README.md              # Frontend documentation
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd task_manager
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the Backend Server**:
   ```bash
   cd ../Backend
   npm run dev
   ```
   The backend will start on `http://localhost:8000`

5. **Start the Frontend Development Server**:
   ```bash
   cd ../frontend
   npm run dev
   ```
   The frontend will start on `http://localhost:3000`

6. **Open your browser**:
   Navigate to `http://localhost:3000`

## 🎯 Usage Guide

### 1. Getting Started
1. **Create a User**: Click "Create User" and fill in username and email
2. **Login**: Use your username to log in to the system
3. **Start Managing Tasks**: Create your first task!

### 2. Creating Tasks
1. Click "Create New Task" button
2. Fill in the task details:
   - **Title**: Brief task name
   - **Description**: Detailed task description
   - **Priority**: Low, Medium, or High
   - **Status**: To Do, In Progress, or Done
   - **Assign To**: Select a user or leave unassigned
3. Click "Create Task"

### 3. Managing Tasks
- **View Tasks**: Use the view mode tabs to see different task categories
- **Filter Tasks**: Use the filter dropdowns to narrow down tasks
- **Update Status**: Use the action buttons on each task card
- **Delete Tasks**: Click the delete button (only if no dependencies)

### 4. Task Dependencies
- Tasks with dependencies cannot be completed until all dependencies are done
- The system automatically prevents completion of blocked tasks
- View blocked tasks using the "Blocked Tasks" view mode

## 🔧 Configuration

### Backend Configuration
The backend runs on port 8000 by default. To change this:
1. Edit the `PORT` variable in `Backend/app.js`
2. Or set the `PORT` environment variable

### Frontend Configuration
The frontend connects to the backend API at `http://localhost:8000/api`. To change this:
1. Edit the `API_BASE_URL` constant in `frontend/app/page.jsx`
2. Update to your backend server URL

### Environment Variables
Create `.env` files in both Backend and frontend directories for environment-specific configuration:

**Backend/.env**:
```env
PORT=8000
NODE_ENV=development
```

**frontend/.env.local**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🔗 API Endpoints

### Health & Monitoring
- `GET /api/health` - Check API status and statistics
- `GET /api/stats` - Get detailed API usage statistics

### User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `POST /api/users/login` - User login
- `GET /api/users/:userId` - Get user by ID

### Task Management
- `GET /api/tasks` - Get all tasks (with optional filtering)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:taskId` - Get specific task
- `PUT /api/tasks/:taskId` - Update task
- `PATCH /api/tasks/:taskId/complete` - Mark task complete
- `DELETE /api/tasks/:taskId` - Delete task
- `GET /api/tasks/user/:userId` - Get tasks for specific user
- `GET /api/tasks/blocked` - Get blocked tasks

## 🎨 UI Components

### TaskCard Component
- Displays individual task information with glassmorphism effects
- Shows priority and status with gradient badges and icons
- Provides action buttons for task management
- Responsive design with hover animations

### Modal Component
- Reusable modal dialog for forms with backdrop blur
- Clean, accessible design with smooth animations
- Proper focus management and keyboard navigation

### Statistics Dashboard
- Real-time task counts with gradient text effects
- User-specific metrics with hover animations
- Visual indicators for different categories

## 🚀 Deployment

### Backend Deployment
```bash
cd Backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm run start
```

### Environment Setup
Ensure environment variables are properly configured for production:
- Set `NODE_ENV=production`
- Configure database connections (if migrating from in-memory)
- Set up proper CORS origins
- Configure logging levels

## 🧪 Testing

### Backend Testing
Test the API endpoints using tools like:
- **Postman** - GUI-based API testing
- **cURL** - Command-line HTTP client
- **Thunder Client** - VS Code extension
- **Insomnia** - API testing tool

### Frontend Testing
The frontend can be tested by:
- Manual testing through the UI
- Browser developer tools for debugging
- Network tab for API request monitoring

## 🔍 Monitoring & Analytics

### API Statistics
- Real-time endpoint usage tracking
- Response time monitoring
- Request count analytics
- Performance metrics

### Request Logging
- Detailed request/response logging
- Timestamp and duration tracking
- Error logging and debugging
- API usage patterns

## 🎯 Future Enhancements

### Planned Features
- **Real-time Collaboration**: WebSocket integration for live updates
- **File Attachments**: Support for task attachments
- **Advanced Filtering**: Date ranges, custom filters
- **Task Templates**: Predefined task templates
- **Export/Import**: Data export functionality
- **Dark Mode**: Theme switching capability
- **Mobile App**: React Native companion app

### Technical Improvements
- **Database Integration**: Replace in-memory storage with persistent database
- **Authentication**: JWT-based authentication system
- **Caching**: Redis integration for performance
- **Testing**: Comprehensive unit and integration tests
- **CI/CD**: Automated deployment pipelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code structure and patterns
- Add proper comments and documentation
- Test your changes thoroughly
- Ensure responsive design compatibility
- Follow the established naming conventions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing React framework
- **TailwindCSS** for the utility-first CSS framework
- **Express.js** team for the Node.js web framework
- **Heroicons** for the beautiful SVG icons

---

**Built with ❤️ using Next.js, Express.js, and TailwindCSS**

*Smart Task Manager - Organize, collaborate, succeed*
