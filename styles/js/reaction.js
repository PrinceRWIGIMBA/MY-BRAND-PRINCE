// reaction.js

// let contentError = document.getElementById("contentError");
// contentError.innerHTML = "";
let authToken = localStorage.getItem("token");
// if (!authToken) {
//   console.error("Authentication token not found.");
//   contentError.innerHTML = "Please login before to add comment.";

//   return;
// }
// Function to get the blogId from the URL
const getBlogIdFromUrl = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get("index");
};

const displayErrorMessage = (message) => {
  const errorMessageContainer = document.getElementById("errorMessage");
  errorMessageContainer.textContent = message;
  errorMessageContainer.style.display = "block";

  // Hide after 3 seconds
  setTimeout(() => {
    errorMessageContainer.style.display = "none";
  }, 3000);
};

// Function to like a blog
const likeBlog = async () => {
  const blogId = getBlogIdFromUrl();

  if (!blogId) {
    console.error("blogId not found.");
    return;
  }

  try {
    const response = await fetch(
      `https://mybrand-prince-be.onrender.com/api/blogs/like/${blogId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const data = await response.json();
    console.log("Blog Liked:", data);

    // Update UI with new likes count
    document.getElementById("likes").textContent = data.likes;
  } catch (error) {
    console.error("Error liking blog:", error.message);
    displayErrorMessage(error.message);
    // Handle error display or logging
  }
};

// Function to dislike a blog
const dislikeBlog = async () => {
  const blogId = getBlogIdFromUrl();

  if (!blogId) {
    console.error("blogId not found.");
    return;
  }

  try {
    const response = await fetch(
      `https://mybrand-prince-be.onrender.com/api/blogs/dislike/${blogId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const data = await response.json();
    console.log("Blog Disliked:", data);

    // Update UI with new dislikes count
    document.getElementById("dislikes").textContent = data.dislikes;
  } catch (error) {
    console.error("Error disliking blog:", error.message);
    displayErrorMessage(error.message);
    // Handle error display or logging
  }
};
