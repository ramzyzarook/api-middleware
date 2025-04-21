export const isTokenExpired = () => {
  const exp = localStorage.getItem("exp"); // Retrieve the expiration time from localStorage,
  if (!exp) return true; // If expiration time is not found, the token is expired

  const expiryTime = parseInt(exp) * 1000; 
  return Date.now() >= expiryTime; // Check if the current time has surpassed the expiration time
};
