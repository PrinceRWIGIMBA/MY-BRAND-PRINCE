const toggleFormButton = document.getElementById("toggleForm");
const registerForm = document.querySelector(".register-form");
const loginForm = document.querySelector(".login-form");

toggleFormButton.addEventListener("click", function () {
  registerForm.classList.toggle("hidden");
  loginForm.classList.toggle("hidden");

  if (registerForm.classList.contains("hidden")) {
    toggleFormButton.textContent =
      "Don't have an account? Click here to register";
  } else {
    toggleFormButton.textContent =
      "Already have an account? Click here to login";
  }
});

const checkFirstName = () => {
  // Implement your validation for first name
};

const checkLastName = () => {
  // Implement your validation for last name
};

const checkEmail = () => {
  // Implement your validation for email
};

const checkRegisterPassword = () => {
  // Implement your validation for registration password
};

const registerFormEl = document.querySelector("#register");

registerFormEl.addEventListener("submit", function (e) {
  e.preventDefault();

  let isFirstNameValid = checkFirstName();
  let isLastNameValid = checkLastName();
  let isEmailValid = checkEmail();
  let isRegisterPasswordValid = checkRegisterPassword();

  let isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isRegisterPasswordValid;

  if (isFormValid) {
    var registerFormData = {
      FirstName: document.querySelector("#firstname").value,
      LastName: document.querySelector("#lastname").value,
      Email: document.querySelector("#email").value,
      Password: document.querySelector("#registerpassword").value,
    };

    // Send data to Swagger API
    fetch("https://your-swagger-api-endpoint.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any other headers if needed
      },
      body: JSON.stringify(registerFormData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Registration successful:", data);
        // You can add any success handling here, like redirecting to another page
      })
      .catch((error) => {
        console.error("Error registering:", error);
        // You can add error handling here, such as displaying an error message to the user
      });
  }
});
