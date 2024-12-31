# Company Management System

A full-stack web application for managing companies and user interactions.

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB**
- **Git**

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <https://github.com/sangeeta2003/entnt>
cd <entnt>
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM_NAME=Your App Name
ADMIN_CREATE_KEY=your_secure_admin_key_here
ADMIN_EMAIL=admin@yourdomain.com
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm start
```
The backend server will run on [http://localhost:5000](http://localhost:5000).

### 2. Start the Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will run on [http://localhost:3000](http://localhost:3000).

## Initial Setup

1. Create an admin user using the `/api/auth/create-initial-admin` endpoint:
```bash
curl -X POST http://localhost:5000/api/auth/create-initial-admin \
-H "Content-Type: application/json" \
-d '{
  "email": "newadmin@admin.com",
  "password": "Admin@123"
  
}'
```

2. Login with the admin credentials at [http://localhost:3000/login](http://localhost:3000/login).

## Features

- User Authentication (Login/Register)
- Role-based Authorization (Admin/User)
- Company Management
- User Management (Admin only)
- Calendar Integration
- Communication Methods Management
- Responsive Design

## Environment Variables Explanation

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: your_jwt_secret
- `FRONTEND_URL`: [Frontend application URL](http://localhost:3000)
- `EMAIL_USERNAME`: Gmail address for sending emails
- `EMAIL_PASSWORD`: your_app_password
- `EMAIL_FROM_NAME`=Your App Name 
- `ADMIN_CREATE_KEY`: your_secure_admin_key_here
- `ADMIN_EMAIL`=admin@yourdomain.com 

### Frontend (.env)
- `REACT_APP_API_URL`: [Backend API URL](http://localhost:5000/api)

## Common Issues & Solutions

1. **Connection Refused Error**
   - Ensure MongoDB is running.
   - Check if the backend server is running on port 5000.
   - Verify MongoDB connection string in backend `.env`.

2. **Authentication Issues**
   - Check if `JWT_SECRET` is properly set.
   - Ensure tokens are being properly stored/removed.

3. **Email Sending Issues**
   - Verify `EMAIL_USERNAME` and `EMAIL_PASSWORD` are correct.
   - Make sure you're using an App Password for Gmail.

## Support

For issues and support, please create an issue in the repository or contact the maintainers.
