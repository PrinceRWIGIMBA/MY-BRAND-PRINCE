const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token ? true : false;
};

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("JWT Token not found in localStorage");
    return null;
  }

  try {
    const tokenParts = token.split(".");
    const decodedPayload = atob(tokenParts[1]);
    const payloadObj = JSON.parse(decodedPayload);
    const userId = payloadObj.id; // Assuming the user ID is stored as "id" in the payload
    return userId;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null;
  }
};

const fetchUserData = async () => {
  const userId = getUserIdFromToken();
  if (!userId) {
    console.error("Unable to get userId from token");
    return;
  }

  try {
    const response = await fetch(
      `https://mybrand-prince-be.onrender.com/api/auth/users/${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const userData = await response.json();
    displayUserInfo(userData);
  } catch (error) {
    console.error("Error fetching user data:", error.message);
  }
};

const displayUserInfo = (userData) => {
  const nameElement = document.getElementById("name");
  const name1Element = document.getElementById("name1");
  const name2Element = document.getElementById("name2");
  const emailElement = document.getElementById("email1");
  const roleElement = document.getElementById("role");

  // Update the DOM elements with user data
  name1Element.textContent = `${userData.data.firstname} ${userData.data.lastname}`;
  name2Element.textContent = `${userData.data.firstname} ${userData.data.lastname}`;
  nameElement.textContent = `${userData.data.firstname} ${userData.data.lastname}`;
  emailElement.textContent = userData.data.email;
  roleElement.textContent = userData.data.role;
};

// Call fetchUserData when the page loads or whenever needed
fetchUserData();
