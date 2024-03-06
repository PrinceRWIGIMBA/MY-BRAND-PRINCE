// your_script.js

// Load data from local storage on page load
window.onload = function () {
  const queryParams = new URLSearchParams(window.location.search);
  const index = queryParams.get("index");

  if (index !== null) {
    populateFormFromQueryParams(index);
  } else {
    displayBlogs();
  }
};

const saveBlog = (blog) => {
  const blogs = getBlogsFromLocalStorage();

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    blog.image = reader.result;

    blogs.push(blog);
    localStorage.setItem("blogs", JSON.stringify(blogs));
    displayBlogs();
  });

  reader.readAsDataURL(blog.image);
};

const getBlogsFromLocalStorage = () => {
  try {
    const storedData = localStorage.getItem("blogs");

    if (storedData) {
      return JSON.parse(storedData) || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error parsing JSON from local storage:", error);
    return [];
  }
};
const fetchInfo = async () => {
  const response = await fetch(
    "https://mybrand-prince-be.onrender.com/api/blogs"
  );
  const data_blog = await response.json();
  blogs = await data_blog.data;
  const tableBody = document.getElementById("blogTableBody");

  const displayBlogs = () => {
    // const blogs = getBlogsFromLocalStorage();
    const tableBody = document.getElementById("blogTableBody");

    tableBody.innerHTML = "";

    blogs.forEach((blog, index) => {
      const newRow = tableBody.insertRow();

      newRow.innerHTML = `
        <td>${blog.date}</td>
     
        <td class="image-cell"><img src="${blog.image}" alt="Blog Image" class="table-image"></td>
         <td>${blog.title}</td>
         <td>${blog.description}</td>
        
        <td class="action-buttons">
            <button class="view-btn" onclick="viewBlog(${index})">View</button>
            <button class="edit-btn" onclick="editBlog(${index})">Edit</button>
            <button class="delete-btn" onclick="deleteBlog(${index})">Delete</button>
        </td>
    `;
    });
  };
  displayBlogs();
};
fetchInfo();
//iyi nayo niyo ndigukoresha nkora save
const submitForm = () => {
  checkTitle();
  checkImage();
  checkDescription();
  checkContent();

  const title = document.getElementById("title").value.trim();
  const imageInput = document.getElementById("image");
  const description = document.getElementById("description").value.trim();
  const content = quill.root.innerText.trim();
  const blogIndex = document.getElementById("blogIndex").value;
  const responseDiv = document.getElementById("response");

  if (title && imageInput.files.length > 0 && content) {
    const blog = {
      title: title,
      image: imageInput.files[0],
      description: description,
      content: content,
      date: new Date().toLocaleDateString(),
    };

    let blogs = getBlogsFromLocalStorage();

    if (blogIndex === "") {
      saveBlog(blog);
      response_message();
    } else {
      const index = parseInt(blogIndex, 10);
      if (index >= 0 && index < blogs.length) {
        const file = imageInput.files[0];

        const reader = new FileReader();
        reader.addEventListener("load", function () {
          blog.image = reader.result;
          //document.getElementById('imgPreview').setAttribute('src', reader.result);
          blogs[index] = blog;

          console.log(blogs);
          localStorage.setItem("blogs", JSON.stringify(blogs));
          //displayBlogs();

          saveBlogsToLocalStorage(getBlogsFromLocalStorage());
        });

        reader.readAsDataURL(file);
      }
    }
    update_message();
  }
};

function response_message() {
  responseDiv.textContent = "Successfully created!";
  responseDiv.className = "success";
  responseDiv.style.display = "block";
  setTimeout(function () {
    responseDiv.style.display = "none";
    resetForm();
  }, 3000);
}

function update_message() {
  responseDiv.textContent = "Successfully Updated!";
  responseDiv.className = "success";
  responseDiv.style.display = "block";
  setTimeout(function () {
    responseDiv.style.display = "none";
    resetForm();
  }, 3000);
}

const resetForm = () => {
  document.getElementById("title").value = "";
  document.getElementById("image").value = "";
  document.getElementById("description").value = "";
  quill.root.innerHTML = "";
  document.getElementById("blogIndex").value = "";
};

const viewBlog = (index) => {
  const blogs = getBlogsFromLocalStorage();
  const blog = blogs[index];
  localStorage.setItem("viewed-blog", JSON.stringify(blog));

  window.location.href = "blog.html";
};

let blogs = [];
//iyi sfunction niyo ndigukoresha nnshyira data muri from ngiye kuzikorera update
const populateFormFromQueryParams = (index) => {
  blogs = getBlogsFromLocalStorage();

  if (index >= 0 && index < blogs.length) {
    const blog = blogs[index];

    document.getElementById("title").value = blog.title;
    document.getElementById("description").value = blog.description;
    document.getElementById("blogIndex").value = index;
    quill.root.innerHTML = blog.content;

    // const imageInput = document.getElementById('image');

    // if (blog.image) {
    //     document.getElementById('imgPreview').setAttribute('src', blog.image);
    // }
  }
};

// aha nahoniho noherereza index ya blog kuri update page
const updateBlogImage = (file, blog) => {
  const reader = new FileReader();
  reader.addEventListener("load", function () {
    blogs = getBlogsFromLocalStorage();
    blog.image = reader.result;
    blog.title = document.getElementById("title").value;

    //console.log(blog);
    document.getElementById("imgPreview").setAttribute("src", reader.result);

    //saveBlogsToLocalStorage(getBlogsFromLocalStorage());
  });

  reader.readAsDataURL(file);
};

const editBlog = (index) => {
  const editUrl = `form.html?index=${index}`;
  window.location.href = editUrl;
};

const deleteBlog = (index) => {
  const blogs = getBlogsFromLocalStorage();
  blogs.splice(index, 1);
  localStorage.setItem("blogs", JSON.stringify(blogs));
  displayBlogs();
};
