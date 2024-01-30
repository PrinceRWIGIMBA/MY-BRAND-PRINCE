
      var tablinks = document.getElementsByClassName("dot");
      var tabcontents = document.getElementsByClassName("blog-container");

      function opentab(tabname) {
        for (tablink of tablinks) {
          tablink.classList.remove("active-slide");
        }
        for (tabcontent of tabcontents) {
          tabcontent.classList.remove("active-container");
        }
        event.currentTarget.classList.add("active-slide");
        document.getElementById(tabname).classList.add("active-container");
      }

      // Get the button
      var mybutton = document.getElementById("upArrow");

      // When the user scrolls down 20px from the top of the document, show the button
      window.onscroll = function () {
        scrollFunction();
      };

      function scrollFunction() {
        if (
          document.body.scrollTop > 20 ||
          document.documentElement.scrollTop > 20
        ) {
          mybutton.classList.add("show");
        } else {
          mybutton.classList.remove("show");
        }
      }

      // Scroll to the top of the document when the button is clicked
      function scrollToTop() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      }

      document.addEventListener("DOMContentLoaded", function () {
        const checkBtn = document.getElementById("check");
        const navList = document.querySelector("ul");

        checkBtn.addEventListener("change", function () {
          navList.classList.toggle("active", this.checked);
        });
      });

      document.addEventListener("DOMContentLoaded", function () {
        // Get all navigation links
        const navLinks = document.querySelectorAll("nav a");

        // Add click event listener to each link
        navLinks.forEach(function (link) {
          link.addEventListener("click", function () {
            // Remove 'clicked' class from all links
            navLinks.forEach(function (navLink) {
              navLink.classList.remove("clicked");
            });
            if (!link.classList.contains("active")) {
              // Remove 'active' class from all links
              navLinks.forEach(function (navLink) {
                  navLink.classList.remove("active");
              });
            }

            // Add 'clicked' class to the clicked link
            link.classList.add("clicked");
          });
        });
      });

      document.addEventListener("DOMContentLoaded", function () {
        const lineBtn = document.getElementById("line-check");
        const sideBar = document.querySelector(".sidebar-container");

        lineBtn.addEventListener("change", function () {
          sideBar.classList.toggle("active", this.checked);
        });
      });




      document.addEventListener("DOMContentLoaded", function () {
        // Get all navigation links
        const navLinks = document.querySelectorAll("nav a");

        // Add click event listener to each link
        navLinks.forEach(function (link) {
          link.addEventListener("click", function () {
            // Remove 'clicked' class from all links
            navLinks.forEach(function (navLink) {
              navLink.classList.remove("clicked");
            });

            // Add 'clicked' class to the clicked link
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

          // You can handle the comment data here (e.g., send it to a server)

          // For demonstration purposes, let's log the data to the console
          console.log("Username:", username);
          console.log("Comment:", comment);

          // Clear the form fields
          usernameInput.value = "";
          commentTextarea.value = "";
        });
      });
    
  // blog view on the side of admin script 
    
   //header burger
   var sidebarContainer = document.querySelector(".sidebar-container");
   var content = document.getElementById("content");

   function toggleSidebar() {
     sidebarContainer.classList.toggle("hidden"); 
     if (sidebarContainer.classList.contains("hidden")) {
       content.style.width = "100%";
       content.style.marginLeft = "0px";
     } else {
       content.style.width = "calc(100vw - 250px)";
       content.style.marginLeft = "200px";
     }
   }
 




   document.addEventListener("DOMContentLoaded", function () {
    
    const navLinks = document.querySelectorAll("sidebar a");
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


      
    