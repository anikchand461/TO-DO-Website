document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const dueDateInput = document.getElementById("due-date-input");
  const categoryInput = document.getElementById("category-input");
  const addTaskButton = document.getElementById("add-task-button");
  const taskList = document.getElementById("task-list");
  const filterCategory = document.getElementById("filter-category");
  const filterStatus = document.getElementById("filter-status");
  const sortButton = document.getElementById("sort-button");

  // Load tasks from local storage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Display tasks
  function displayTasks() {
	taskList.innerHTML = "";
	const filteredTasks = tasks
	  .filter(task => 
		(filterCategory.value === "All" || task.category === filterCategory.value) &&
		(filterStatus.value === "All" || 
		 (filterStatus.value === "Completed" && task.completed) || 
		 (filterStatus.value === "Pending" && !task.completed))
	  )
	  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

	filteredTasks.forEach(task => {
	  const li = document.createElement("li");
	  li.className = task.completed ? "completed" : "";

	  const taskDetails = document.createElement("div");
	  taskDetails.className = "task-details";
	  taskDetails.innerHTML = `
		<strong>${task.text}</strong>
		<span class="task-category">${task.category}</span>
		<span class="task-due-date">${task.dueDate}</span>
	  `;
	  li.appendChild(taskDetails);

	  const doneButton = document.createElement("button");
	  doneButton.textContent = "Done";
	  doneButton.className = "done-button";
	  doneButton.addEventListener("click", () => toggleTaskCompletion(task));
	  li.appendChild(doneButton);

	  const editButton = document.createElement("button");
	  editButton.textContent = "Edit";
	  editButton.className = "edit-button";
	  editButton.addEventListener("click", () => editTask(task));
	  li.appendChild(editButton);

	  const deleteButton = document.createElement("button");
	  deleteButton.textContent = "Delete";
	  deleteButton.className = "delete-button";
	  deleteButton.addEventListener("click", () => deleteTask(task));
	  li.appendChild(deleteButton);

	  taskList.appendChild(li);
	});
  }

  // Add a new task
  addTaskButton.addEventListener("click", () => {
	const taskText = taskInput.value.trim();
	const dueDate = dueDateInput.value;
	const category = categoryInput.value;

	if (taskText && dueDate) {
	  const newTask = { text: taskText, dueDate, category, completed: false };
	  tasks.push(newTask);
	  saveTasks();
	  taskInput.value = "";
	  dueDateInput.value = "";
	  categoryInput.value = "Work";
	  displayTasks();
	}
  });

  // Save tasks to local storage
  function saveTasks() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Toggle task completion status
  function toggleTaskCompletion(task) {
	task.completed = !task.completed;
	saveTasks();
	displayTasks();
  }

  // Delete a task
  function deleteTask(task) {
	tasks = tasks.filter(t => t !== task);
	saveTasks();
	displayTasks();
  }

  // Edit a task
  function editTask(task) {
	taskInput.value = task.text;
	dueDateInput.value = task.dueDate;
	categoryInput.value = task.category;
	deleteTask(task);
  }

  // Filter and sort tasks
  filterCategory.addEventListener("change", displayTasks);
  filterStatus.addEventListener("change", displayTasks);
  sortButton.addEventListener("click", () => {
	tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
	displayTasks();
  });

  // Initial display of tasks
  displayTasks();
});
