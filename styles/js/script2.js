window.onload = function () {
  const queryParams = new URLSearchParams(window.location.search);
  const index = queryParams.get("index");

  if (index !== null) {
   
  } else {
    fetchInfo();
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
      }" alt="Blog Image" class="table-image" rel="noopener noreferrer"></td>
      <td>${blog.title}</td>
      <td>${blog.description}</td>
      <td class="action-buttons">
      <button class="view-btn">
      <a href="blog.html?index=${blog._id}">View</a>
      </button>
        <button class="edit-btn" onclick="editBlog('${blog._id}')">Edit</button>
        <button class="delete-btn" id="delete-btn" onclick="deleteBlog('${
          blog._id
        }', this)">Delete</button> <span class="loader"></span>
       
      </td>
  `;
    });
  };
  displayBlogs();
};

const deleteBlog = async (blogId, deleteBtn) => {
  const confirmDelete = confirm("Are you sure you want to delete this blog?");
  if (confirmDelete) {
    deleteBtn.disabled = true;

    try {
      const authToken = localStorage.getItem("token");
      document.querySelector(".loader").style.display = "block";
      document.querySelector("#delete-btn").style.display = "none";
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
       
        document.querySelector(".loader").style.display = "block";
        document.querySelector("#delete-btn").style.display = "none";
        fetchInfo();

        fetchInfo(); // Refresh the blog list
      } else {
        alert(data.error || "Error deleting blog");
      }
    } catch (error) {
      console.error("Error:", error);
      document.querySelector(".loader").style.display = "block";
      document.querySelector("#delete-btn").style.display = "none";
      
    } finally {
      deleteBtn.disabled = false;
  
    }
  }
};

const editBlog = (blogId) => {
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
        responseText.innerText = "Blog updated successfully!";

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        quill.root.innerHTML = "";
      } else {
        responseText.innerText = data.error || "Error updating blog";
      }
    } catch (error) {
      console.error("Error:", error);
      responseText.innerText = "Error updating blog";
    } finally {
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
