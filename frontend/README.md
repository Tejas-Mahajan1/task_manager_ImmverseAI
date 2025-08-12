# Smart Task Manager Frontend

A modern, responsive task management web application built with Next.js and TailwindCSS. This frontend provides a beautiful and intuitive interface for managing tasks, users, and project workflows.

## 🚀 Features

### User Management
- **User Registration**: Create new users with username and email
- **User Login**: Simple mock authentication system
- **User Dashboard**: Personalized view for logged-in users

### Task Management
- **Create Tasks**: Add new tasks with title, description, priority, and status
- **Task Assignment**: Assign tasks to specific users
- **Task Dependencies**: Support for task dependencies (tasks that depend on other tasks)
- **Status Management**: Track task progress (To Do, In Progress, Done)
- **Priority Levels**: Set task priorities (Low, Medium, High)

### Advanced Features
- **Real-time Updates**: Instant UI updates when tasks are modified
- **Filtering System**: Filter tasks by priority, status, and assigned user
- **View Modes**: 
  - All Tasks: View all tasks in the system
  - My Tasks: View tasks assigned to the current user
  - Blocked Tasks: View tasks that cannot be completed due to dependencies
- **Task Actions**: Start, pause, complete, and delete tasks
- **Dependency Validation**: Tasks can only be completed when dependencies are finished

### UI/UX Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional design with TailwindCSS
- **Interactive Cards**: Beautiful task cards with hover effects
- **Modal Dialogs**: Clean modal interfaces for forms
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Statistics Dashboard**: Overview cards showing key metrics

## 🛠️ Technology Stack

- **Framework**: Next.js 15.4.6
- **Styling**: TailwindCSS 4
- **Language**: JavaScript (ES6+)
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API
- **Development**: Turbopack for fast development

## 📁 Project Structure

```
frontend/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── TaskCard.jsx    # Individual task display component
│   │   └── Modal.jsx       # Reusable modal component
│   ├── globals.css         # Global styles
│   ├── layout.jsx          # Root layout component
│   └── page.jsx            # Main application page
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Backend server running on port 8000

### Installation

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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

## 🎨 UI Components

### TaskCard Component
- Displays individual task information
- Shows priority and status with color-coded badges
- Provides action buttons for task management
- Responsive design with hover effects

### Modal Component
- Reusable modal dialog for forms
- Clean, accessible design
- Proper focus management
- Backdrop click to close

### Statistics Dashboard
- Real-time task counts
- User-specific metrics
- Visual indicators for different categories

## 🔧 Configuration

### API Configuration
The frontend connects to the backend API at `http://localhost:8000/api`. To change this:

1. Edit the `API_BASE_URL` constant in `app/page.jsx`
2. Update to your backend server URL

### Styling Customization
- All styles use TailwindCSS classes
- Custom colors and spacing can be modified in `tailwind.config.js`
- Component-specific styles are co-located with components

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables
Create a `.env.local` file for environment-specific configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🔗 API Integration

The frontend integrates with the following backend endpoints:

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `POST /api/users/login` - User login
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/complete` - Mark task complete
- `DELETE /api/tasks/:id` - Delete task

## 🎯 Future Enhancements

- **Real-time Collaboration**: WebSocket integration for live updates
- **File Attachments**: Support for task attachments
- **Advanced Filtering**: Date ranges, custom filters
- **Task Templates**: Predefined task templates
- **Export/Import**: Data export functionality
- **Dark Mode**: Theme switching capability
- **Mobile App**: React Native companion app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Smart Task Manager application suite.

---

**Built with ❤️ using Next.js and TailwindCSS**
