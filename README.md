# freshly-server

A TypeScript Express.js server with MongoDB integration for user authentication and product management.

## Features

- User authentication with JWT
- Role-based access control (admin, deliveryGuy, user)
- MongoDB integration with Mongoose
- TypeScript for type safety
- Password hashing with bcrypt

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ROOT_PASSWORD=your_root_password
PORT=3000
```

### Development

Run in development mode with hot reload:

```bash
npm run dev
```

Run with ts-node:

```bash
npm run start:dev
```

### Production

Build the TypeScript files:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Build in watch mode

```bash
npm run build:watch
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user and receive JWT token

### User Management

- `GET /users/me` - Get current user profile (authenticated)
- `GET /users` - Get all users (admin only)
- `PUT /users/updateRole` - Update user role (admin only)

### System

- `GET /health` - Health check endpoint

## Project Structure

```
src/
├── index.ts              # Main application entry point
├── config.ts             # Application configuration
├── database.ts           # MongoDB connection setup
├── types.ts              # TypeScript type definitions
├── controllers/
│   └── userController.ts # User-related business logic
├── routes/
│   └── userRoutes.ts     # API route definitions
├── middlewares/
│   ├── index.ts          # Middleware exports
│   ├── auth.ts           # Authentication middleware
│   ├── roles.ts          # Role-based access control
│   ├── validation.ts     # Input validation middleware
│   └── error.ts          # Error handling & logging
├── utils/
│   └── errors.ts         # Custom error classes
└── models/
    ├── index.ts          # Model exports
    ├── Users.ts          # User model
    └── Products.ts       # Product model
```

## Features

- **🔐 Authentication**: JWT-based authentication with bcrypt password hashing
- **👥 Role Management**: Three-tier role system (admin, deliveryGuy, user)
- **🛡️ Security**: Input validation, proper error handling, and secure headers
- **📊 Type Safety**: Full TypeScript implementation with strict typing
- **🗄️ Database**: MongoDB integration with Mongoose ODM
- **🏗️ Architecture**: Clean separation of concerns with controllers, routes, and middleware
- **🔧 Configuration**: Environment-based configuration with validation
- **📝 Logging**: Comprehensive error logging and request tracking
- **✅ Validation**: Email format and password strength validation
- **🔍 Monitoring**: Request/response logging with timestamps and duration
- **⚡ Performance**: Optimized middleware pipeline for fast response times
- **🚨 Error Handling**: Centralized error handling with custom error classes
- **🔄 Async Support**: Proper async/await error handling with Express middleware
