const fnameEl = document.getElementById("firstname");
const lnameEl = document.getElementById("lastname");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const form = document.getElementById("register");
const response = document.getElementById("response");

const checkFirstname = () => {
  let valid = false;

  const min = 3,
    max = 25;

  const firstname = fnameEl.value.trim();

  if (!isRequired(firstname)) {
    showError(fnameEl, "firstname cannot be blank.");
  } else if (!isBetween(firstname.length, min, max)) {
    showError(
      fnameEl,
      `firstname must be between ${min} and ${max} characters.`
    );
  } else {
    showSuccess(fnameEl);
    valid = true;
  }
  return valid;
};
const checkLastname = () => {
  let valid = false;

  const min = 3,
    max = 25;

  const lastname = lnameEl.value.trim();

  if (!isRequired(lastname)) {
    showError(lnameEl, "lastname cannot be blank.");
  } else if (!isBetween(lastname.length, min, max)) {
    showError(
      lnameEl,
      `lastname must be between ${min} and ${max} characters.`
    );
  } else {
    showSuccess(lnameEl);
    valid = true;
  }
  return valid;
};
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

const checkPassword = () => {
  let valid = false;

  const password = passwordEl.value.trim();

  if (!isRequired(password)) {
    showError(passwordEl, "Password cannot be blank.");
  } else if (!isPasswordSecure(password)) {
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

const isPasswordSecure = (password) => {
  const re = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
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

  let firstnameValid = checkFirstname(),
    lastnameValid = checkLastname(),
    emailValid = checkemail(),
    isPasswordValid = checkPassword();

  let isFormValid =
    firstnameValid && lastnameValid && emailValid && isPasswordValid;

  if (isFormValid) {
    var formData = {
      firstname: fnameEl.value,
      lastname: lnameEl.value,
      email: emailEl.value,
      password: passwordEl.value,
    };
    document.querySelector(".loader").style.display = "block";
    document.querySelector("#register-btn").style.display = "none";
    fetch("https://mybrand-prince-be.onrender.com/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Sign Up failed");
        }
        return response.json();
      })
      .then((data) => {
        document.querySelector(".loader").style.display = "none";
        document.querySelector("#register-btn").style.display = "block";
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
        console.error(error);
        document.querySelector(".loader").style.display = "none";
        document.querySelector("#register-btn").style.display = "block";
        showError(response, "Data already exist ,Please try again.");
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
