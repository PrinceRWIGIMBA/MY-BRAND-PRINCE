var data = anychart.data.set([
  ["Likes", 34],
  ["DislikeS", 21],
  ["Comments", 15],

  ["Others", 13],
]);
var chart = anychart.pie(data);
chart.innerRadius("55%");

chart.title("Blogs Statiistics");
chart.container("container");
chart.draw();

function addTask() {
  var newTaskInput = document.getElementById("newTask");
  var task = newTaskInput.value.trim();

  if (task !== "") {
    var tableBody = document.querySelector(".todolist table tbody");
    var newRow = tableBody.insertRow();

    var taskCell = newRow.insertCell(0);
    taskCell.textContent = task;

    var actionCell = newRow.insertCell(1);
    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", function () {
      removeTask(this);
    });
    actionCell.appendChild(removeButton);

    newTaskInput.value = "";
  }
}

function removeTask(button) {
  var row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
