# SIH-2025-BusRadar

> A Smart Bus Tracking System for SIH 2025

## Overview
SIH-2025-BusRadar is a full-stack application designed to provide real-time tracking and management of buses, routes, and stops. Built for the Smart India Hackathon 2025, it aims to improve public transport efficiency and user experience.

## Features
- Real-time bus location tracking
- Search and view available buses and routes
- User authentication (login/signup)
- Interactive map for bus locations
- Modern UI with Tailwind CSS and Vite
- Backend API with Node.js, Express, and MongoDB

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Other:** EJS (views), ESLint

## Folder Structure
```
SIH-2025-BusRadar/
├── bus-tracker-SIH-backend/   # Backend API and server
│   ├── src/
│   │   ├── models/            # Mongoose models (Bus, Route, Stop)
│   │   ├── routes/            # Express route handlers
│   │   ├── middleware/        # Mongoose setup
│   │   └── server.js          # Main server file
│   └── views/                 # EJS templates and static files
├── bus-tracker-SIH-frontend/  # Frontend React app
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # App pages (Home, BusMap, etc.)
│   │   └── assets/            # Images and icons
│   └── public/                # Static assets
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites
- Node.js & npm
- MongoDB (local or cloud)

### Backend Setup
```bash
cd bus-tracker-SIH-backend
npm install
# Configure MongoDB connection in src/middleware/mongooseSetup.js
npm start
```

### Frontend Setup
```bash
cd bus-tracker-SIH-frontend
npm install
npm run dev
```

### Accessing the App
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000) (default)

## Usage
- Sign up or log in to access bus tracking features
- View buses and routes on the interactive map
- Search for buses by route or stop

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT

## Authors
- Nishant (Owner)
- SIH-2025 Team
