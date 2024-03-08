const emailEl = document.querySelector("#email");
const passwordEl = document.querySelector("#password");

const form = document.querySelector("#signin");

const checkemail = () => {
  let valid = false;

  const min = 3,
    max = 25;

  const email = emailEl.value.trim();

  if (!isRequired(email)) {
    showError(emailEl, "Email cannot be blank.");
  } else if (!isBetween(email.length, min, max)) {
    showError(emailEl, `Email must be between ${min} and ${max} characters.`);
  } else {
    showSuccess(emailEl);
    valid = true;
  }
  return valid;
};

const checkpassword = () => {
  let valid = false;

  const password = passwordEl.value.trim();

  if (!isRequired(password)) {
    showError(passwordEl, "Password cannot be blank.");
  } else if (!ispasswordSecure(password)) {
    showError(
      passwordEl,
      "Password must have at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  } else {
    showSuccess(passwordEl);
    valid = true;
  }

  return valid;
};

const ispasswordSecure = (password) => {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return re.test(password);
};

const isRequired = (value) => (value === "" ? false : true);
const isBetween = (length, min, max) =>
  length < min || length > max ? false : true;

const showError = (input, message) => {
  const formField = input.parentElement;
  formField.classList.remove("success");
  formField.classList.add("error");
  const error = formField.querySelector("small");
  error.textContent = message;
};

const showSuccess = (input) => {
  const formField = input.parentElement;
  formField.classList.remove("error");
  formField.classList.add("success");
  const error = formField.querySelector("small");
  error.textContent = "";
};

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let isEmailValid = checkemail();
  let isPasswordValid = checkpassword();
  let isFormValid = isEmailValid && isPasswordValid;

  if (isFormValid) {
    var formData = {
      email: emailEl.value,
      password: passwordEl.value,
    };
    document.querySelector(".loader").style.display = "block";
    document.querySelector("#login-btn").style.display = "none";
    // Make a POST request to the authentication API using fetch
    fetch("https://mybrand-prince-be.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Authentication failed");
        }
        return response.json();
      })
      .then((data) => {
        document.querySelector(".loader").style.display = "none";
        document.querySelector("#login-btn").style.display = "block";
        localStorage.setItem("token", data.token);
        console.log("Authentication successful:", data.data.role);
        let userType = data.data.role;
        if (userType === "admin") {
          window.location.href = "dashboard.html";
        } else {
          window.location.href = "index.html";
        }
      })
      .catch((error) => {
        console.error("Authentication failed:", error);
        showError(form, "Invalid email or password. Please try again.");
      });
  }
});

const debounce = (fn, delay = 500) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
};

form.addEventListener(
  "input",
  debounce(function (e) {
    switch (e.target.id) {
      case "email":
        checkemail();
        break;
      case "password":
        checkpassword();
        break;
    }
  })
);
