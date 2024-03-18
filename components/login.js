function Form() {
  const { useState } = React;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseError, setResponseError] = useState("");

  const isRequired = (value) => (value === "" ? false : true);
  const isBetween = (length, min, max) =>
    length < min || length > max ? false : true;

  const checkEmail = () => {
    let valid = false;
    const min = 3,
      max = 25;
    const trimmedEmail = email.trim();

    if (!isRequired(trimmedEmail)) {
      setResponseError("Email cannot be blank.");
    } else if (!isBetween(trimmedEmail.length, min, max)) {
      setResponseError(`Email must be between ${min} and ${max} characters.`);
    } else {
      setResponseError("");
      valid = true;
    }
    return valid;
  };

  const checkPassword = () => {
    let valid = false;
    const trimmedPassword = password.trim();

    if (!isRequired(trimmedPassword)) {
      setResponseError("Password cannot be blank.");
    } else {
      setResponseError("");
      valid = true;
    }

    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isEmailValid = checkEmail();
    let isPasswordValid = checkPassword();
    let isFormValid = isEmailValid && isPasswordValid;

    if (isFormValid) {
      const formData = {
        email: email,
        password: password,
      };

      document.querySelector(".loader").style.display = "block";
      document.querySelector("#login-btn").style.display = "none";

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
          document.querySelector(".loader").style.display = "none";
          document.querySelector("#login-btn").style.display = "block";
          setResponseError("Invalid email or password. Please try again.");
        });
    }
  };

  return (
    <>
      <div className="login-form">
        <h1>Login</h1>
        <div className="response" id="response">
          <small style={{ color: "red" }}>{responseError}</small>
        </div>
        <form id="signin" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="...email.."
              autoComplete="off"
              value={email}
              onInput={(e) => setEmail(e.target.value)}
            />
            <small></small>
          </div>

          <div className="form-field">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="...password..."
              autoComplete="off"
              value={password}
              onInput={(e) => setPassword(e.target.value)}
            />
            <small></small>
          </div>

          <button type="submit" id="login-btn">
            Login
          </button>
          <span className="loader"></span>

          <span className="register-link">
            Don't have an account?
            <a href="register.html">Sign Up here !</a>
          </span>
        </form>
      </div>
    </>
  );
}

ReactDOM.render(<Form />, document.querySelector("#form"));
