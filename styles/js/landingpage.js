const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

let blogs;
const fetchInfo = async () => {
  const response = await fetch(
    "https://mybrand-prince-be.onrender.com/api/blogs"
  );
  const data_blog = await response.json();
  blogs = await data_blog.data;

  function showSlides(n) {
    let i;

    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    console.log(blogs);
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    console.log(n);

    const currentSlide = slides[slideIndex - 1];
    const blogContainer = currentSlide.querySelector(".blog-container");

    blogContainer.innerHTML = "";

    for (let j = (n - 1) * 3; j < n * 3 && j < blogs.length; j++) {
      const blog = blogs[j];
      const blogPost = document.createElement("div");
      blogPost.className = "blog-post";

      blogPost.innerHTML = `
        <img src="${blog.image}" alt="${blog.title}" />
        <h3>${blog.title}</h3>
        <p>${blog.description}</p>
        <p><span>${formatDate(blog.createdAt)}</span></p>
        <br />
        <br />
        <div class="blog-actions">
          <a href="#"><i class="far fa-thumbs-up" style="color: #ffd43b"></i><span class="badge">1</span><h4>likes</h4></a>
          <a href="#"><i class="far fa-comments" style="color: #ffd43b"></i><span class="badge">3</span><h4>comments</h4></a>
          <a href="post.html?index=${
            blog._id
          }"><i class="fab fa-readme" style="color: #ffd43b"></i><h4>Read more</h4></a>
          
        </div>`;

      blogContainer.appendChild(blogPost);
    }
  }

  let slideIndex = 1;
  showSlides(slideIndex);
  document
    .getElementById("leftButton_id")
    .addEventListener("click", function () {
      showSlides((slideIndex += -1));
    });
  document
    .getElementById("rightButton_id")
    .addEventListener("click", function () {
      showSlides((slideIndex += 1));
    });
};

fetchInfo();
