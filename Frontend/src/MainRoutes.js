import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Register from "./components/Register/Register"; // Register component
import Login from "./components/Login/Login"; // Login component
import UserDashboard from "./components/Dashboard/UserDash/UserDash"; // User dashboard
import AdminDashboard from "./components/Dashboard/AdminDash/AdminDash"; // Admin dashboard
import { isTokenExpired } from "./utils/auth"; // Token expiration check utility
import { refreshToken } from "./utils/token"; // Token refresh utility

// PrivateRoute: Ensures only logged-in users can access protected routes
const PrivateRoute = ({ children }) => {
  const username = localStorage.getItem("username"); // Get stored username
  return username ? children : <Navigate to="/login" />; // Redirect if not logged in
};

// MainRoutes: Manages the routing logic for the app
const MainRoutes = () => {
  const navigate = useNavigate(); // Navigate function for redirection
  const location = useLocation(); // Current location (URL)

  // Effect to check token expiration on every route change
  useEffect(() => {
    const publicPaths = ["/login", "/register"]; // List of public routes

    // Skip token check for public routes (login/register)
    if (publicPaths.includes(location.pathname)) return;

    // Check if token is expired
    if (isTokenExpired()) {
      refreshToken() // Try to refresh token
        .catch(() => {
          localStorage.clear(); // Clear local storage if refresh fails
          navigate("/register"); // Redirect to register page
        });
    }
  }, [navigate, location.pathname]); // Re-run effect when location changes

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={<Register />} /> {/* Register page */}
      <Route path="/login" element={<Login />} /> {/* Login page */}
      {/* Protected Routes */}
      <Route
        path="/user-dashboard"
        element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        }
      />{" "}
      {/* User dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />{" "}
      {/* Admin dashboard */}
      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" />} />{" "}
      {/* Redirect to login if route doesn't match */}
    </Routes>
  );
};

export default MainRoutes;
