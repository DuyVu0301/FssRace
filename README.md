# FSS Race - Virtual Running Platform

A full-stack virtual racing platform built with React, Node.js, and MySQL, integrated with Strava API for activity tracking.

## Features

✅ User Authentication (JWT-based)
✅ Strava OAuth2 Integration
✅ Activity Syncing from Strava
✅ Race Management (Admin Panel)
✅ Race Progress Tracking with Progress Bars
✅ Global & Race-Specific Leaderboards
✅ User Profiles with Statistics
✅ Role-Based Access Control (Admin/User)
✅ Responsive Design with Tailwind CSS
✅ Global State Management with Zustand

## Project Structure

```
FSS Race/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── database.sql
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── stravaController.js
│   │   ├── raceController.js
│   │   ├── userController.js
│   │   └── leaderboardController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── stravaRoutes.js
│   │   ├── raceRoutes.js
│   │   ├── userRoutes.js
│   │   └── leaderboardRoutes.js
│   ├── services/
│   │   └── stravaService.js
│   ├── .env
│   ├── .gitignore
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── ProgressBar.jsx
    │   │   ├── ActivityList.jsx
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Races.jsx
    │   │   ├── AdminPanel.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Leaderboard.jsx
    │   │   └── UserRaces.jsx
    │   ├── store/
    │   │   ├── authStore.js
    │   │   ├── raceStore.js
    │   │   └── activityStore.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fss_race

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
STRAVA_REDIRECT_URI=http://localhost:5000/api/auth/strava/callback

FRONTEND_URL=http://localhost:5173
```

4. Set up MySQL database:

```bash
mysql -u root -p < config/database.sql
```

5. Start the server:

```bash
npm start
# or for development with auto-reload
npm install -g nodemon
nodemon server.js
```

### Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/strava/callback` - Strava OAuth callback

### Strava Integration

- `POST /api/strava/link` - Link Strava profile
- `POST /api/strava/sync` - Sync activities from Strava
- `GET /api/strava/activities` - Get recent activities

### Races

- `GET /api/races` - Get all races
- `GET /api/races/:id` - Get race details
- `POST /api/races` - Create race (Admin)
- `PUT /api/races/:id` - Update race (Admin)
- `DELETE /api/races/:id` - Delete race (Admin)
- `POST /api/races/join` - Join a race
- `GET /api/races/:raceId/progress` - Get user's race progress

### Users

- `GET /api/users/profile` - Get user profile
- `GET /api/users/stats` - Get user statistics
- `PUT /api/users/profile` - Update user profile

### Leaderboard

- `GET /api/leaderboard/global` - Get global leaderboard
- `GET /api/leaderboard/race/:raceId` - Get race-specific leaderboard

## Key Technologies

- **Frontend**: React 18, Vite, Tailwind CSS, Zustand, Axios, React Router
- **Backend**: Node.js, Express.js, MySQL, JWT, BcryptJS
- **Integration**: Strava API (OAuth2)

## Database Schema

### users

- id, username, password, email, role, created_at, updated_at

### strava_profiles

- id, user_id, strava_athlete_id, access_token, refresh_token, expires_at, created_at, updated_at

### races

- id, title, distance_target, start_date, end_date, description, created_at, updated_at

### activities

- id, user_id, strava_activity_id (UNIQUE), distance, moving_time, start_date_local, activity_type, created_at

### user_races

- id, user_id, race_id, total_distance, created_at (UNIQUE: user_id + race_id)

## Features Overview

### User Features

- Register and login with JWT authentication
- Connect Strava account via OAuth2
- Sync running activities from Strava
- View personal dashboard with race progress
- Join and participate in races
- Track distance progress with visual progress bars
- View global and race-specific leaderboards
- Update profile information

### Admin Features

- Create, update, and delete races
- Manage race events
- View all users and their progress
- Monitor platform activity

## Security Considerations

- Passwords are hashed using BcryptJS
- JWT tokens expire after 7 days
- Strava tokens are securely stored and refreshed automatically
- Role-based access control for admin operations
- CORS and Helmet for HTTP security
- Environment variables for sensitive data

## Future Enhancements

- WebSocket for real-time leaderboard updates
- Email notifications for race updates
- Social features (friend requests, team races)
- Mobile app version
- Advanced analytics and statistics
- Badge/achievement system
- Push notifications

## License

MIT License

## Support

For issues or feature requests, please contact: support@fssrace.com
