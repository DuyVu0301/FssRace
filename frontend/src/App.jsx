import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Races from "./pages/Races";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import UserRaces from "./pages/UserRaces";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/races" element={<Races />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route
          path="/user-races"
          element={
            <ProtectedRoute>
              <UserRaces />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/races" />} />
      </Routes>
    </Router>
  );
}

export default App;
