const dateEl = document.querySelector("#date");
const quill = new Quill("#editor", {
  theme: "snow",
  showCharCount: true,
  maxLength: 100,
  placeholder: "Type Reminder here...",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link", "image", "video"],
      ["clean"],
    ],
  },
});

const checkDate = () => {
  const dateInput = dateEl.value.trim();
  const valid = isRequired(dateInput);

  if (!valid) {
    showError(dateEl, "Please select a date.");
  } else {
    showSuccess(dateEl);
  }

  return valid;
};

const checkReminder = () => {
  const reminderContent = quill.root.innerText.trim();
  const valid = !(reminderContent === "<p><br></p>" || reminderContent === "");

  if (!valid) {
    showError(
      document.getElementById("editor"),
      "Reminder content cannot be empty."
    );
  } else {
    showSuccess(document.getElementById("editor"));
  }

  return valid;
};

const isRequired = (value) => (value === "" ? false : true);

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

window.onload = function () {
  displayReminders();
};

const saveReminder = () => {
  checkDate();
  checkReminder();

  const getRemindersFromLocalStorage = () => {
    const remindersString = localStorage.getItem("reminders");
    return remindersString ? JSON.parse(remindersString) : [];
  };

  const date = document.getElementById("date").value.trim();
  const task = quill.root.innerText.trim();
  const form = document.querySelector("#reminderForm");

  if (date && task) {
    const reminders = getRemindersFromLocalStorage();

    if (reminderIndex === "") {
      const newReminder = { date, task };
      reminders.push(newReminder);
    } else {
      const index = parseInt(reminderIndex, 10);
      if (index >= 0 && index < reminders.length) {
        reminders[index] = { date, task };
      }
    }

    localStorage.setItem("reminders", JSON.stringify(reminders));
    resetForm();
  }
};

const resetForm = () => {
  document.getElementById("date").value = "";

  quill.root.innerHTML = "";
  document.getElementById("reminderIndex").value = "";
  document.getElementById("submitButton").textContent = "Create Reminder";
};

const displayReminders = () => {
  const reminders = getRemindersFromLocalStorage();
  const tableBody = document.getElementById("remindersList");

  tableBody.innerHTML = "";

  reminders.forEach((reminder, index) => {
    const newRow = tableBody.insertRow();

    newRow.innerHTML = `
        <td><i class="fas fa-bell"></i></td>
        <td>${reminder.date}</td>
        <td>${reminder.task}</td>
        <td class="action-buttons">
            <button class="view-btn" onclick="viewBlog(${index})">View</button>
            <button class="edit-btn" onclick="editReminder(${index})">Edit</button>
            <button class="delete-btn" onclick="deleteReminder(${index})">Delete</button>
        </td>
    `;
  });
};

const viewReminder = (index) => {
  const blogs = getRemindersFromLocalStorage();
  const blog = blogs[index];

  console.log("Viewing Reminder:", blog);
};

const deleteReminder = (index) => {
  const reminders = getRemindersFromLocalStorage();
  reminders.splice(index, 1);
  localStorage.setItem("reminders", JSON.stringify(reminders));
  displayReminders();
};
