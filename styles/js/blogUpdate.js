let quill = new Quill("#quill-editor", {
  theme: "snow",
  showCharCount: true,
  maxLength: 100,
  placeholder: "Type content here...",
});

const titleEl = document.querySelector("#title");
const imageEl = document.querySelector("#image");
const descriptionEl = document.querySelector("#description");
const contentEl = document.querySelector("#quill-editor");
const form = document.querySelector("#blogForm");
const isNotEmpty = (value) => (value.trim() === "" ? false : true);

const checkTitle = () => {
  let valid = false;
  const title = titleEl.value.trim();

  if (!isNotEmpty(title)) {
    document.querySelector("#title-error").textContent =
      "Title cannot be blank.";
  } else {
    document.querySelector("#title-error").textContent = "";
    valid = true;
  }

  return valid;
};

const checkImage = () => {
  let valid = false;

  const image = imageEl.value.trim();

  if (!isNotEmpty(image)) {
    document.querySelector("#image-error").textContent =
      "Image cannot be empty.";
  } else {
    document.querySelector("#image-error").textContent = "";
    valid = true;
  }

  return valid;
};

const checkDescription = () => {
  let valid = false;
  const description = document.querySelector("#description").value.trim();

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

const disableFormFields = () => {
  titleEl.setAttribute("readonly", true);
  imageEl.setAttribute("readonly", true);
  descriptionEl.setAttribute("readonly", true);
  contentEl.setAttribute("readonly", true);
};

const enableFormFields = () => {
  titleEl.removeAttribute("readonly");
  imageEl.removeAttribute("readonly");
  descriptionEl.removeAttribute("readonly");
  contentEl.removeAttribute("readonly");
};

const showLoadingSpinner = () => {
  const loadingSpinner = document.getElementById("loading-spinner");
  loadingSpinner.style.display = "block";
};

const hideLoadingSpinner = () => {
  const loadingSpinner = document.getElementById("loading-spinner");
  loadingSpinner.style.display = "none";
};

const showResponseMessage = (message, isSuccess) => {
  const responseDiv = document.getElementById("response");
  const responseText = document.getElementById("response-text");

  responseText.textContent = message;

  if (isSuccess) {
    responseDiv.classList.add("success");
  } else {
    responseDiv.classList.add("failure");
  }

  responseDiv.style.display = "block";

  setTimeout(() => {
    responseDiv.style.display = "none";
    responseDiv.classList.remove("success", "failure");
  }, 3000);
};

const submitForm = () => {
  if (
    !checkTitle() ||
    !checkImage() ||
    !checkDescription() ||
    !checkContent()
  ) {
    return;
  }

  const title = titleEl.value.trim();
  const imageInput = imageEl.files[0];
  const description = descriptionEl.value.trim();
  const contents = quill.root.innerHTML.trim();
  const blogId = document.getElementById("blogIndex").value;

  if (title && imageInput && description && contents && blogId) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", imageInput);
    formData.append("description", description);
    formData.append("contents", contents);

    showLoadingSpinner();
    disableFormFields();

    const authToken = localStorage.getItem("token");
    document.querySelector(".loader").style.display = "block";
    document.querySelector("#submitButton").style.display = "none";
    fetch(`https://mybrand-prince-be.onrender.com/api/blogs/${blogId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        document.querySelector(".loader").style.display = "block";
        document.querySelector("#submitButton").style.display = "none";
        if (data.error) {
          showResponseMessage(data.error, false);
        } else {
          showResponseMessage("Blog updated successfully!", true);
          titleEl.value = "";
          imageEl.value = "";
          descriptionEl.value = "";
          quill.root.innerHTML = "";
          window.location.href = "blogs.html";
        }
      })
      .catch((error) => {
        document.querySelector(".loader").style.display = "block";
        document.querySelector("#submitButton").style.display = "none";
        console.error("Error:", error);
        showResponseMessage("Error updating blog.", false);
      })
      .finally(() => {
        hideLoadingSpinner();
        enableFormFields();
      });
  } else {
    showResponseMessage = ("Please fill out all required fields.", true);
  }
};

// Call submitForm function when form is submitted
form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitForm();
});

const populateForm = async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const blogId = queryParams.get("blogId");

  if (!blogId) {
    console.error("No blog ID provided in URL");
    return;
  }

  const authToken = localStorage.getItem("token");
  const response = await fetch(
    `https://mybrand-prince-be.onrender.com/api/blogs/${blogId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    console.error("Error fetching blog data:", response.statusText);
    return;
  }

  const data = await response.json();
  const blog = data;

  document.getElementById("title").value = blog.title;
  document.getElementById("description").value = blog.description;
  document.getElementById("old-image").innerHTML = ` <img
  src="${blog.image}"
  style="width: 100px; height: 100px"
  alt="Blog Image"
  class="table-image"
/>`;
  quill.root.innerHTML = blog.contents;
  document.getElementById("blogIndex").value = blogId;

  //document.getElementById("blogId").value = blogId;
};
window.onload = populateForm;
