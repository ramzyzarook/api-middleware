import { useState } from "react";
import axios from "axios";
import "../Register/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [role, setRole] = useState("user"); // Default role is 'user'
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    adminSecret: "", // Used for admin registration
  });

  const navigate = useNavigate(); // For navigation after successful registration

  // Handle input changes for username, password, and admin secret
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle role selection (user or admin)
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setFormData({ ...formData, adminSecret: "" }); // Reset admin secret when switching roles
  };

  // Handle form submission (send registration data to the backend)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const requestData = {
      username: formData.username,
      password: formData.password,
      role, // Include selected role
    };

    // If the role is admin and the admin secret is provided, include it in the request
    if (role === "admin" && formData.adminSecret.trim() !== "") {
      requestData.adminSecret = formData.adminSecret;
    }

    try {
      // Send registration data to the backend
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        requestData
      );
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      // Display error toast if registration fails
      toast.error(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <ToastContainer position="top-center" /> {/* Toast notifications */}
        {/* Role Selection */}
        <div className="role-selection">
          <button
            className={role === "user" ? "active" : ""}
            onClick={() => handleRoleChange("user")}
          >
            User
          </button>
          <button
            className={role === "admin" ? "active" : ""}
            onClick={() => handleRoleChange("admin")}
          >
            Admin
          </button>
        </div>
        {/* Registration Form */}
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

          {/* Admin Secret Field appears only for Admins */}
          {role === "admin" && (
            <input
              type="text"
              name="adminSecret"
              placeholder="Enter secret key"
              value={formData.adminSecret}
              onChange={handleChange}
            />
          )}

          <button type="submit">Register</button>

          {/* Link to login page */}
          <p id="register-p">
            Already have an account?{" "}
            <Link id="lo-link" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
