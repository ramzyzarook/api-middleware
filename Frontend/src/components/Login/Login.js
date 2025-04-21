import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  // State to manage form data and error messages
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation after successful login

  // Handle input changes (for both username and password)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (login request)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Reset error on each submission

    try {
      // Send login credentials to the backend
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        formData,
        { withCredentials: true } // Sending cookies with the request
      );

      // Get the username and role from the backend response
      const { username, role } = response.data;

      // Store user data and session expiration time in localStorage
      localStorage.setItem("username", username);
      const newExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour expiry
      localStorage.setItem("exp", newExp.toString());

      console.log("Login Success:", username, role);

      // Redirect user based on role
      if (role === "admin") {
        navigate("/admin-dashboard", { state: { username } });
      } else {
        navigate("/user-dashboard", { state: { username } });
      }
    } catch (error) {
      // Display error toast if login fails
      toast.error(
        error.response?.data?.error || "Login failed. Please check credentials."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <ToastContainer position="top-center" /> {/* Toast notifications */}
        <h2>Login</h2>
        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>

          {/* Link to the registration page */}
          <p id="login-p">
            Need to create an account?{" "}
            <Link id="re-link" to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
