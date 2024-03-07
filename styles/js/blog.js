var quill = new Quill("#editor", {
  theme: "snow",
  placeholder: "Add Comment...",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link", "image", "video"],
      ["clean"],
    ],
  },
});

function getParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function toggleForm() {
  var editorContainer = document.getElementById("editor-container");
  editorContainer.style.display =
    editorContainer.style.display === "none" ? "block" : "none";
}
function toggleComments() {
  var commentsContainer = document.querySelector(".comments");
  var seeAllLink = document.querySelector(".see-all a");

  if (
    commentsContainer.style.maxHeight === "150px" ||
    commentsContainer.style.maxHeight === ""
  ) {
    commentsContainer.style.maxHeight = "none";
    seeAllLink.textContent = "Collapse";
  } else {
    commentsContainer.style.maxHeight = "150px";
    seeAllLink.textContent = "See all";
  }
}

function validateForm(event) {
  event.preventDefault(); // Always prevent the default form submission behavior
  let blogForm = document.getElementById("blogForm");
  let contentError = document.getElementById("contentError");
  contentError.innerHTML = ""; // Clear previous content error message

  let contentSuccess = document.getElementById("contentSuccess");
  contentSuccess.innerHTML = "";
  // Check for authentication token
  let authToken = localStorage.getItem("token");
  if (!authToken) {
    console.error("Authentication token not found.");
    contentError.innerHTML = "Authentication token not found.";
    // tokenError.style.backgroundColor = "red";
    return;
  }

  let description = quill.root.innerHTML.trim();
  if (description === "") {
    contentError.innerHTML = "Content is required.";
    contentError.style.backgroundColor = "red";
    return;
  }

  // Get the blogId from the URL

  console.log(blogId);
  // Submit only the description to the backend API
  fetch(`https://mybrand-prince-be.onrender.com/api/comments/${blogId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      description: description,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      // Handle the result from the backend
      console.log("Comment submitted successfully:", result);

      // Optionally, you can do something after successful submission
      // For example, show a success message
      contentSuccess.innerHTML = "Comment submitted successfully!";
      contentSuccess.style.color = "var(--success-color)";
      blogForm.reset();

      //   alert("Comment submitted successfully!");
    })
    .catch((error) => {
      // Log the error response from the backend
      if (error.response) {
        error.response.json().then((errorData) => {
          console.error("Error from backend:", errorData);
          contentError.innerHTML = errorData.error; // Display the backend error message
          contentError.style.backgroundColor = "red"; // Set red background
        });
      } else {
        console.error("Network error or unexpected response:", error);
        contentError.innerHTML = "An error occurred. Please try again later.";
        // contentError.style.backgroundColor = "red";
      }
    });
}

//blog display

const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get("index");

fetch(`https://mybrand-prince-be.onrender.com/api/blogs/${blogId}`)
  .then((response) => response.json())
  .then((viewedBlog) => {
    // Set the values to the HTML elements
    document.getElementById("blogTitle").textContent = viewedBlog.title;

    const blogImage = document.getElementById("blogImage");
    blogImage.src = viewedBlog.image;
    blogImage.alt = viewedBlog.title;

    document.getElementById(
      "blogDate"
    ).textContent = `Date: ${viewedBlog.createdAt}`;
    document.getElementById("blogContent").innerHTML = viewedBlog.contents;

    // Display the comments
    const commentsContainer = document.getElementById("commentsContainer");
    if (viewedBlog.comments && viewedBlog.comments.length > 0) {
      viewedBlog.comments.forEach((commentId) => {
        // Fetch each comment using its ID
        fetch(
          `https://mybrand-prince-be.onrender.com/api/comments/${commentId}`
        )
          .then((response) => response.json())
          .then((comment) => {
            // Check if userId is present in the comment object
            if (comment.data.user) {
              // Fetch user details for the commenter
              fetch(
                `https://mybrand-prince-be.onrender.com/api/auth/Users/${comment.data.user}`
              )
                .then((userResponse) => userResponse.json())
                .then((user) => {
                  let names = user.data;
                  const commentHTML = `
                          <div class="comment">
                            <div class="profile-p">
                              <img src="images/icons/PersonCircle.png" alt=""/>
                            </div>
                            <div class="comment-contents">
                              <h1 id="username">${names.firstname} ${names.lastname}</h1>
                              <span id="createdAt">${comment.data.createdAt}</span>
                              <p id="description">${comment.data.description}</p>
                            </div>
                          </div>
                        `;
                  commentsContainer.insertAdjacentHTML(
                    "beforeend",
                    commentHTML
                  );
                })
                .catch((error) => console.error("Error fetching user:", error));
            } else {
              // Handle the case where userId is undefined
              console.error("Comment does not have a userId:", comment);
            }
          })
          .catch((error) => console.error("Error fetching comment:", error));
      });
    } else {
      commentsContainer.innerHTML = "<p>No comments available.</p>";
    }
  })
  .catch((error) => console.error("Error fetching blog:", error));
