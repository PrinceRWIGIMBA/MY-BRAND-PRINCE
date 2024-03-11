let authToken = localStorage.getItem("token");

const getBlogIdFromUrl = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get("index");
};

const displayErrorMessage = (message) => {
  const errorMessageContainer = document.getElementById("errorMessage");
  errorMessageContainer.textContent = message;
  errorMessageContainer.style.display = "block";

  setTimeout(() => {
    errorMessageContainer.style.display = "none";
  }, 3000);
};
const displaySuccessMessage = (message) => {
  const successMessageContainer = document.getElementById("successMessage");
  successMessageContainer.textContent = message;
  successMessageContainer.style.display = "block";

  setTimeout(() => {
    successMessageContainer.style.display = "none";
  }, 3000);
};

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

    document.getElementById("like").textContent = data.likes;

    displaySuccessMessage("Blog Liked!");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error("Error liking blog:", error.message);
    displayErrorMessage(error.message);
  }
};

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

    document.getElementById("dislike").textContent = data.dislikes;

    displaySuccessMessage("Blog Disliked!");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error("Error disliking blog:", error.message);
    displayErrorMessage(error.message);
  }
};
