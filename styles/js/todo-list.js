document.addEventListener("DOMContentLoaded", function() {
  loadTasks();
});

function addTask() {
  var taskInput = document.getElementById("taskInput");

  if (taskInput.value.trim() === "") {
      alert("Please enter a task.");
      return;
  }

  var tasks = getTasks();
  tasks.push(taskInput.value);

  saveTasks(tasks);
  loadTasks();

  taskInput.value = "";
}

function removeTask(index) {
  var tasks = getTasks();
  tasks.splice(index, 1);

  saveTasks(tasks);
  loadTasks();
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  var storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
}

function loadTasks() {
  var taskListBody = document.getElementById("taskListBody");
  taskListBody.innerHTML = "";

  var tasks = getTasks();

  tasks.forEach(function(task, index) {
      var row = document.createElement("tr");

      // Task column
      var taskColumn = document.createElement("td");
      taskColumn.textContent = task;
      row.appendChild(taskColumn);

      // Action column
      var actionColumn = document.createElement("td");
      var removeButton = document.createElement("button");
      removeButton.innerHTML = "Remove";
      removeButton.onclick = function() {
          removeTask(index);
      };
      actionColumn.appendChild(removeButton);
      row.appendChild(actionColumn);

      taskListBody.appendChild(row);
  });
}