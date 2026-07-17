# Online Store Management System - Backend

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root of the `server` folder with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI="mongodb://localhost:27017/online-store"

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 2. Database Setup
1. Make sure MongoDB is installed and running
2. The database will be automatically created on the first connection (or update MONGODB_URI)

### 3. Run the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## Installed Packages

### Dependencies
- **express** - Web framework
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **mongoose** - MongoDB object modeling
- **razorpay** - Payment gateway integration

### Dev Dependencies
- **nodemon** - Auto-restart on file changes

## Project Structure

```
server/
├── src/
│   ├── controllers/       # Request handlers
│   ├── models/           # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/             # Utility functions
│   ├── seedCMS.js         # Seed data script
│   └── index.js           # Entry point
├── .env                   # Environment variables (create this)
├── .gitignore
└── package.json
```

