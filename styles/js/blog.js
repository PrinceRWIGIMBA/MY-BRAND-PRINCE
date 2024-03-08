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
  event.preventDefault();
  let blogForm = document.getElementById("blogForm");
  let contentError = document.getElementById("contentError");
  contentError.innerHTML = "";

  let contentSuccess = document.getElementById("contentSuccess");
  contentSuccess.innerHTML = "";

  let authToken = localStorage.getItem("token");
  if (!authToken) {
    console.error("Authentication token not found.");
    contentError.innerHTML = "Authentication token not found.";

    return;
  }

  let description = quill.root.innerHTML.trim();
  if (description === "") {
    contentError.innerHTML = "Content is required.";
    contentError.style.backgroundColor = "red";
    return;
  }

  console.log(blogId);

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
      console.log("Comment submitted successfully:", result);

      contentSuccess.innerHTML = "Comment submitted successfully!";
      contentSuccess.style.color = "var(--success-color)";
      blogForm.reset();
    })
    .catch((error) => {
      if (error.response) {
        error.response.json().then((errorData) => {
          console.error("Error from backend:", errorData);
          contentError.innerHTML = errorData.error;
          contentError.style.backgroundColor = "red";
        });
      } else {
        console.error("Network error or unexpected response:", error);
        contentError.innerHTML = "An error occurred. Please try again later.";
      }
    });
}

const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get("index");

fetch(`https://mybrand-prince-be.onrender.com/api/blogs/${blogId}`)
  .then((response) => response.json())
  .then((viewedBlog) => {
    document.getElementById("blogTitle").textContent = viewedBlog.title;

    const blogImage = document.getElementById("blogImage");
    blogImage.src = viewedBlog.image;
    blogImage.alt = viewedBlog.title;

    document.getElementById(
      "blogDate"
    ).textContent = `Date: ${viewedBlog.createdAt}`;
    document.getElementById("blogContent").innerHTML = viewedBlog.contents;

    const commentsContainer = document.getElementById("commentsContainer");
    if (viewedBlog.comments && viewedBlog.comments.length > 0) {
      viewedBlog.comm  ents.forEach((commentId) => {
        fetch(
          `https://mybrand-prince-be.onrender.com/api/comments/${commentId}`
        )
          .then((response) => response.json())
          .then((comment) => {
            if (comment.data.user) {
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
