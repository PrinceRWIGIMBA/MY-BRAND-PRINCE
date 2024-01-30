let navigation_bar = document.querySelector(".navbar");
let menus_btn =document.querySelector(".menu-btn");
let close_btn =document.querySelector(".close-btn");

menus_btn.addEventListener("click",function(){
    navigation_bar.classList.add("active2");
});


menus_btn.addEventListener("click",function(){
    navigation_bar.classList.add("active2");
});

close_btn.addEventListener("click",function(){
    navigation_bar.classList.remove("active2");
});




document.addEventListener("DOMContentLoaded", function () {
    
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
       
        navLinks.forEach(function (navLink) {
          navLink.classList.remove("clicked");
        });
        if (!link.classList.contains("active")) {
        
          navLinks.forEach(function (navLink) {
              navLink.classList.remove("active");
          });
        }

      
        link.classList.add("clicked");
      });
    });
  });

  //blog 

  let slideIndex = 1;
  showSlides(slideIndex);

  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  function currentSlide(n) {
    showSlides((slideIndex = n));
  }

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
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
  }




  // post script



  document.addEventListener("DOMContentLoaded", function () {
  
    const navLinks = document.querySelectorAll("nav a");

    
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
      
        navLinks.forEach(function (navLink) {
          navLink.classList.remove("clicked");
        });

    
        link.classList.add("clicked");
      });
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const commentForm = document.getElementById("commentForm");

    commentForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const usernameInput = document.getElementById("username");
      const commentTextarea = document.getElementById("comment");

      const username = usernameInput.value;
      const comment = commentTextarea.value;

    
      console.log("Username:", username);
      console.log("Comment:", comment);

      
      usernameInput.value = "";
      commentTextarea.value = "";
    });
  });


  var quill = new Quill("#editor", {
    theme: "snow",
  });

  function toggleForm() {
    var editorContainer = document.getElementById("editor-container");
    editorContainer.style.display =
      editorContainer.style.display === "none" ? "block" : "none";
  }

 

  function toggleComments() {
    var commentsContainer = document.querySelector(".comments");
    var seeAllLink = document.querySelector(".see-all a");
  
    if (commentsContainer.style.maxHeight === "150px" || commentsContainer.style.maxHeight === "") {
      
      commentsContainer.style.maxHeight = "none";
      seeAllLink.textContent = "Collapse";
    } else {
    
      commentsContainer.style.maxHeight = "150px";
      seeAllLink.textContent = "See all";
    }
  }
  
