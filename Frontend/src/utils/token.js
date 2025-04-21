import axios from "axios";

export const refreshToken = async () => {
  try {
    // Make a POST request to the backend to refresh the token
    await axios.post(
      "http://localhost:3000/auth/refresh-token",
      {},
      { withCredentials: true }
    );

    // Set a new expiration time,
    const newExp = Date.now() / 1000 + 3600;
    localStorage.setItem("exp", newExp.toString()); // Store the new expiration time in localStorage
  } catch (err) {
    console.error("Refresh token failed", err);

    // Clear any saved credentials and redirect to the login page
    localStorage.clear();
    window.location.href = "/login";
  }
};
