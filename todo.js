document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.getElementById("addBtn");
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const filter = document.getElementById("filter");
  const clearBtn = document.getElementById("clearBtn");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks();

  addBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTask();
  });
  filter.addEventListener("change", renderTasks);
  clearBtn.addEventListener("click", clearAll);

  function addTask() {
    const text = taskInput.value.trim();
    if (text === "") {
      alert("Please enter a task!");
      return;
    }

    const now = new Date();
    const dateTime = now.toLocaleString(); 

    tasks.push({ text, completed: false, time: dateTime });
    saveTasks();
    renderTasks();
    taskInput.value = "";
  }

  function renderTasks() {
    taskList.innerHTML = "";
    const selected = filter.value;

    tasks.forEach((task, index) => {
      if (selected === "completed" && !task.completed) return;
      if (selected === "pending" && task.completed) return;

      const li = document.createElement("li");

      // Create a container for text + time
      const taskInfo = document.createElement("div");
      const taskText = document.createElement("span");
      taskText.textContent = task.text;
      const timeStamp = document.createElement("small");
      timeStamp.textContent = `Added on: ${task.time}`;
      timeStamp.style.display = "block";
      timeStamp.style.fontSize = "11px";
      timeStamp.style.color = "#666";

      taskInfo.appendChild(taskText);
      taskInfo.appendChild(timeStamp);

      if (task.completed) li.classList.add("completed");

      li.appendChild(taskInfo);

      li.addEventListener("click", () => toggleComplete(index));

      const del = document.createElement("button");
      del.textContent = "Delete";
      del.classList.add("delete-btn");
      del.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTask(index);
      });

      li.appendChild(del);
      taskList.appendChild(li);
    });
  }

  function toggleComplete(i) {
    tasks[i].completed = !tasks[i].completed;
    saveTasks();
    renderTasks();
  }

  function deleteTask(i) {
    tasks.splice(i, 1);
    saveTasks();
    renderTasks();
  }

  function clearAll() {
    if (confirm("Are you sure you want to clear all tasks?")) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
