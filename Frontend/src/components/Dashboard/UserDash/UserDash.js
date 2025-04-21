import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../UserDash/UserDash.css";

const UserDashboard = () => {
  // State variables
  const [apiKeys, setApiKeys] = useState([]);
  const [selectedApiKey, setSelectedApiKey] = useState(null);
  const [country, setCountry] = useState("");
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Get user's API keys from backend
  const fetchApiKeys = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/get-api-keys",
        {
          withCredentials: true,
        }
      );

      if (response.data.apiKeys.length > 0) {
        setApiKeys(response.data.apiKeys);
      } else {
        console.log("No API keys found for this user.");
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    }
  };

  // Fetch country info using selected API key
  const fetchCountryData = async () => {
    if (!selectedApiKey) {
      toast.warn("Please select an API key first!");
      return;
    }

    if (!country || country.trim() === "") {
      toast.warn("Enter a country name!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/countries/${country}`,
        {
          withCredentials: true,
          headers: {
            "x-api-key": selectedApiKey,
          },
        }
      );

      setCountryData(response.data);
    } catch (error) {
      toast.error("Country not found or API issue.");
    }

    setLoading(false);
  };

  // Generate a new API key
  const generateApiKey = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/generate-api-key",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.apiKey) {
        setApiKeys([
          ...apiKeys,
          {
            api_key: response.data.apiKey,
            created_at: new Date().toISOString(),
          },
        ]);
      }
      toast.success("New API Key generated!");
    } catch (error) {
      toast.error("Error generating API key");
    }
    setLoading(false);
  };

  // Delete a specific API key
  const deleteApiKey = async (apikey) => {
    try {
      await axios.delete(
        `http://localhost:3000/auth/delete-api-key/${apikey}`,
        {
          withCredentials: true,
        }
      );
      setApiKeys(apiKeys.filter((key) => key.api_key !== apikey));
      toast.success("API Key deleted successfully!");
    } catch (error) {
      toast.error("Error deleting API key");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header with logout */}
      <header className="user-header">
        <h2>USER DASHBOARD</h2>
        <button className="u-logout-btn" onClick={() => navigate("/login")}>
          Logout
        </button>
      </header>

      <div className="sub-dash">
        {/* Left panel: Profile and API keys */}
        <div className="u-left-panel">
          <div className="u-user-profile">
            <div className="u-profile-circle">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <h3>{username}</h3>
          </div>

          {/* List of API keys */}
          <div className="u-api-key-table">
            <h4>CREATED API KEYS</h4>
            {apiKeys.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>API Key</th>
                    <th>Created Date and Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key, index) => (
                    <tr key={index}>
                      <td>
                        <button
                          id="api-select-btn"
                          className={`api-select-button ${
                            selectedApiKey === key.api_key ? "selected" : ""
                          }`}
                          onClick={() => setSelectedApiKey(key.api_key)}
                        >
                          API{index + 1}
                        </button>
                      </td>
                      <td>{`************${key.api_key.slice(-4)}`}</td>
                      <td>{new Date(key.created_at).toLocaleString()}</td>
                      <td>
                        <button
                          className="api-delete-btn"
                          onClick={() => deleteApiKey(key.api_key)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p></p>
            )}
          </div>

          {/* Button to generate API key */}
          <div className="api-key-generate-section">
            <button
              className="generate-btn"
              onClick={generateApiKey}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate API Key"}
            </button>
          </div>
        </div>

        {/* Right panel: Country search */}
        <div className="u-right-panel">
          <header id="head1">
            <h2>Country Search</h2>
          </header>

          <div className="search-section">
            <input
              type="text"
              placeholder="Enter country name"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <button
              id="u-fetch-button"
              onClick={fetchCountryData}
              disabled={loading}
            >
              {loading ? "Searching..." : "Fetch Country Info"}
            </button>
          </div>

          {/* Display country data */}
          {countryData && (
            <div className="country-card">
              <button>{countryData.name}</button>
              <button>Capital: {countryData.capital}</button>
              <button>Currency: {countryData.currency}</button>
              <button>Languages: {countryData.languages.join(", ")}</button>
              <img src={countryData.flag} alt="Flag" />
            </div>
          )}
        </div>

        {/* Toast notifications */}
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default UserDashboard;
