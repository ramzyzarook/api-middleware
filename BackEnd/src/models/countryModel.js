const axios = require("axios");

// Function to fetch and format country data from RestCountries API
const fetchCountryInfo = async (countryName) => {
  try {
    // Make request to the external API
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    // Check if the response contains valid data
    if (!response.data || response.data.length === 0) {
      return { error: "Country not found", data: null };
    }

    const country = response.data[0]; // Use the first match

    // Format the response to return only the necessary fields
    const formattedData = {
      name: country.name?.common || "Unknown",
      capital: country.capital?.[0] || "Unknown",
      currency: country.currencies
        ? Object.keys(country.currencies)[0]
        : "Unknown",
      languages: country.languages ? Object.values(country.languages) : [],
      flag: country.flags?.png || "No flag available",
    };

    // Return the formatted country data
    return { error: null, data: formattedData };
  } catch (error) {
    // Handle errors (e.g., network issues, bad requests)
    console.error("API error:", error.message);
    return { error: "Failed to fetch country data", data: null };
  }
};

module.exports = { fetchCountryInfo };
