// Import the function to fetch country information from the model
const { fetchCountryInfo } = require("../models/countryModel");

// Handler to get country information based on the country name provided in the request
const getCountryInfo = async (req, res) => {
  const countryName = req.params.name; // Extract country name from request parameters

  // Fetch country info using the provided country name
  const { error, data } = await fetchCountryInfo(countryName);

  // If an error occurs (e.g., country not found), return the appropriate status and error message
  if (error) {
    const statusCode = error === "Country not found" ? 404 : 500;
    return res.status(statusCode).json({ error });
  }

  // If successful, return the country data
  res.json(data);
};

module.exports = { getCountryInfo };
