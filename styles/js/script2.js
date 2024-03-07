// your_script.js

// Load data from local storage on page load
window.onload = function () {
  const queryParams = new URLSearchParams(window.location.search);
  const index = queryParams.get("index");

  if (index !== null) {
    populateFormFromQueryParams(index);
  } else {
    fetchInfo(); // Fetch and display blogs
  }
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

const fetchInfo = async () => {
  const response = await fetch(
    "https://mybrand-prince-be.onrender.com/api/blogs"
  );
  const data_blog = await response.json();
  blogs = await data_blog.data;
  const tableBody = document.getElementById("blogTableBody");

  const displayBlogs = () => {
    tableBody.innerHTML = "";

    blogs.forEach((blog, index) => {
      const newRow = tableBody.insertRow();
      newRow.innerHTML = `
        <td>${formatDate(blog.createdAt)}</td>
        <td class="image-cell"><img src="${
          blog.image
        }" alt="Blog Image" class="table-image"></td>
        <td>${blog.title}</td>
        <td>${blog.description}</td>
        <td class="action-buttons">
          <a href="blog.html?index=${blog._id}"><h4>View</h4></a>
          <button class="edit-btn" onclick="editBlog('${
            blog._id
          }')">Edit</button>
          <button class="delete-btn" onclick="deleteBlog('${
            blog._id
          }', this)">Delete</button>
        </td>
      `;
    });
  };
  displayBlogs();
};

const deleteBlog = async (blogId, deleteBtn) => {
  const confirmDelete = confirm("Are you sure you want to delete this blog?");
  if (confirmDelete) {
    // Disable the delete button and show loading spinner
    deleteBtn.disabled = true;
    const spinner = document.createElement("div");
    spinner.className = "loading-spinner";
    deleteBtn.appendChild(spinner);

    try {
      const authToken = localStorage.getItem("token");
      const response = await fetch(
        `https://mybrand-prince-be.onrender.com/api/blogs/${blogId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Blog successfully deleted

        fetchInfo(); // Refresh the blog list
      } else {
        // Display error message
        alert(data.error || "Error deleting blog");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting blog");
    } finally {
      // Enable the delete button and hide the loading spinner
      deleteBtn.disabled = false;
      spinner.remove();
    }
  }
};

const editBlog = (blogId) => {
  // Redirect to edit page with blogId as query parameter
  window.location.href = `edit-blog.html?blogId=${blogId}`;
};

const updateBlog = async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const blogId = queryParams.get("index");

  try {
    const response = await fetch(
      `https://mybrand-prince-be.onrender.com/api/blogs/${blogId}`
    );
    const data = await response.json();

    if (response.ok) {
      const blogData = data.data;
      // Populate form with blog data
      document.getElementById("title").value = blogData.title;
      document.getElementById("description").value = blogData.description;
      quill.root.innerHTML = blogData.contents;

      const updateButton = document.getElementById("submitButton");
      updateButton.textContent = "Update";
      updateButton.onclick = () => submitUpdate(blogId);
    } else {
      alert(data.error || "Error fetching blog data");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error fetching blog data");
  }
};

const submitUpdate = async (blogId) => {
  checkTitle();
  checkDescription();
  checkContent();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const contents = quill.root.innerHTML.trim();
  const responseDiv = document.getElementById("response");
  const loadingSpinner = document.getElementById("loading-spinner");
  const responseText = document.getElementById("response-text");

  if (title && description && contents) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("contents", contents);

    // Show loading spinner and disable form fields
    showLoadingSpinner();
    disableFormFields();

    try {
      const authToken = localStorage.getItem("token");
      const response = await fetch(
        `https://mybrand-prince-be.onrender.com/api/blogs/${blogId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Blog successfully updated
        responseText.innerText = "Blog updated successfully!";
        // Reset form fields
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        quill.root.innerHTML = "";
      } else {
        // Display error message
        responseText.innerText = data.error || "Error updating blog";
      }
    } catch (error) {
      console.error("Error:", error);
      responseText.innerText = "Error updating blog";
    } finally {
      // Hide loading spinner and enable form fields
      hideLoadingSpinner();
      enableFormFields();
    }
  } else {
    responseText.innerText = "Please fill out all required fields.";
  }
};

const checkTitle = () => {
  let valid = false;
  const title = document.getElementById("title").value.trim();

  if (!isNotEmpty(title)) {
    document.querySelector("#title-error").textContent =
      "Title cannot be blank.";
  } else {
    document.querySelector("#title-error").textContent = "";
    valid = true;
  }

  return valid;
};

const checkDescription = () => {
  let valid = false;
  const description = document.getElementById("description").value.trim();

  if (!isNotEmpty(description)) {
    document.querySelector("#description-error").textContent =
      "Description cannot be blank.";
  } else if (description.length < 10) {
    document.querySelector("#description-error").textContent =
      "Description should be at least 10 characters long.";
  } else if (description.length > 200) {
    document.querySelector("#description-error").textContent =
      "Description should not exceed 200 characters.";
  } else {
    document.querySelector("#description-error").textContent = "";
    valid = true;
  }

  return valid;
};

const checkContent = () => {
  let valid = false;
  const contents = quill.root.innerText;

  if (!isNotEmpty(contents)) {
    document.querySelector("#content-error").textContent =
      "Content cannot be blank.";
  } else {
    document.querySelector("#content-error").textContent = "";
    valid = true;
  }

  return valid;
};

const isNotEmpty = (value) => (value.trim() === "" ? false : true);

const quill = new Quill("#quill-editor", {
  theme: "snow",
  showCharCount: true,
  maxLength: 100,
  placeholder: "Type content here...",
});

const populateFormFromQueryParams = async (blogId) => {
  try {
    const response = await fetch(
      `https://mybrand-prince-be.onrender.com/api/blogs/${blogId}`
    );
    const data = await response.json();
    if (response.ok) {
      const blogData = data.data;
      // Populate form with blog data
      document.getElementById("title").value = blogData.title;
      document.getElementById("description").value = blogData.description;
      quill.root.innerHTML = blogData.contents;

      const updateButton = document.getElementById("submitButton");
      updateButton.textContent = "Update";
      updateButton.onclick = () => submitUpdate(blogId);
    } else {
      alert(data.error || "Error fetching blog data");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error fetching blog data");
  }
};
