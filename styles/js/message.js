const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("email");
const querieEl = document.getElementById("querie");

const form = document.querySelector("form");

const checkUsername = () => {
  let valid = false;
  const name = usernameEl.value.trim();

  if (!isRequired(name)) {
    showError(usernameEl, "Username cannot be blank.");
  } else {
    showSuccess(usernameEl);
    valid = true;
  }

  return valid;
};

const checkEmail = () => {
  let valid = false;
  const email = emailEl.value.trim();

  if (!isRequired(email)) {
    showError(emailEl, "Email cannot be blank.");
  } else if (!isEmailValid(email)) {
    showError(emailEl, "Email is not valid.");
  } else {
    showSuccess(emailEl);
    valid = true;
  }

  return valid;
};

const checkQuerie = () => {
  let valid = false;
  const querie = querieEl.value.trim();

  if (!isRequired(querie)) {
    showError(querieEl, "Message cannot be blank.");
  } else {
    showSuccess(querieEl);
    valid = true;
  }

  return valid;
};

const isEmailValid = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const isRequired = (value) => (value === "" ? false : true);

const showError = (input, message) => {
  const small = input.parentElement.querySelector("small");
  input.classList.add("error");
  small.textContent = message;
};

const showSuccess = (input) => {
  const small = input.parentElement.querySelector("small");
  input.classList.remove("error");
  small.textContent = "";
};

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let isUsernameValid = checkUsername();
  let isEmailValid = checkEmail();
  let isQuerieValid = checkQuerie();
  let isFormValid = isUsernameValid && isEmailValid && isQuerieValid;

  if (isFormValid) {
    var formData = {
      username: usernameEl.value,
      email: emailEl.value,
      querie: querieEl.value,
    };

    console.log(formData);

    fetch("https://mybrand-prince-be.onrender.com/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Message sent successfully:", data);
        form.reset();
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  }
});

//capture the data from the contact form
