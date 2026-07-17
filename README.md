# Online Store Management System

A comprehensive web application for managing an online store, featuring a complete frontend for users and an administrative backend.

## Project File Structure

```text
ONLINE-STORE-MANAGEMENT-SYSTEM/
├── backend/                  # Backend application directory
│   └── server/               # Node.js/Express server
│       ├── src/              # Backend source code (Controllers, Models, Routes)
│       ├── .env              # Environment configurations (hidden)
│       ├── package.json      # Backend dependencies and scripts
│       └── ...
├── frontend/                 # Frontend application directory
│   └── client/               # React application
│       ├── public/           # Public static assets
│       ├── src/              # Frontend source code (Components, Pages, Styles)
│       │   ├── components/   # Reusable UI components
│       │   ├── css/          # Stylesheets
│       │   └── pages/        # React pages (Admin, User, etc.)
│       ├── index.html        # Main HTML template
│       ├── package.json      # Frontend dependencies and scripts
│       └── vite.config.js    # Vite configuration
├── OSMS_ER_Diagram.pdf       # Documentation and Diagrams
├── OSMS_Data_Dictionary.docx # Documentation and Diagrams
├── OSMS_Database_Tables.docx # Documentation and Diagrams
├── Online_Store_OSMS_DFDs.pdf# Data Flow Diagrams
└── README.md                 # Project documentation
```

## Setup Instructions

### Backend
1. Navigate to the backend server directory: `cd backend/server`
2. Install dependencies: `npm install`
3. Configure your `.env` variables
4. Start the server: `npm start` (or `npm run dev`)

### Frontend
1. Navigate to the frontend client directory: `cd frontend/client`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
