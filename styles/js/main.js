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
