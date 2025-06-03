
// Initialize Supabase
const { createClient } = supabase;
const SUPABASE_URL = "https://grtwugkiektpjeearnxb.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydHd1Z2tpZWt0cGplZWFybnhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTY0NTMsImV4cCI6MjA2NDQ5MjQ1M30.86L2KBUfq9ecL4whgDsyI5I86xkhNLwoCk3LfVjRz88"; 
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// Utility Functions
const createTaskElement = (task) => {
  const listItem = document.createElement("li");
  listItem.dataset.id = task.id;

  const taskDetails = document.createElement("div");
  taskDetails.classList.add("task-details");
  const taskName = document.createElement("span");
  taskName.textContent = task.task;

  const taskPriority = document.createElement("span");
  taskPriority.textContent = task.priority.toUpperCase();
  taskPriority.classList.add("task-priority", task.priority);

  taskDetails.appendChild(taskName);
  taskDetails.appendChild(taskPriority);

  const taskActions = document.createElement("div");
  taskActions.classList.add("task-actions");

  const completeBtn = document.createElement("button");
  completeBtn.innerHTML = "✔";
  completeBtn.addEventListener("click", () => toggleTaskCompletion(task.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  taskActions.appendChild(completeBtn);
  taskActions.appendChild(deleteBtn);

  listItem.appendChild(taskDetails);
  listItem.appendChild(taskActions);

  return listItem;
};

const renderTasks = (tasks) => {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });
};

// Supabase Functions
const fetchTasks = async () => {
  const { data, error } = await supabaseClient.from("tasks").select("*");
  if (error) {
    console.error("Error fetching tasks:", error);
  } else {
    renderTasks(data);
  }
};

const addTask = async (task, priority) => {
  const { data, error } = await supabaseClient
    .from("tasks")
    .insert([{ task, priority, is_completed: false }]);
  if (error) {
    console.error("Error adding task:", error);
  } else {
    fetchTasks();
  }
};

const deleteTask = async (id) => {
  const { error } = await supabaseClient.from("tasks").delete().eq("id", id);
  if (error) {
    console.error("Error deleting task:", error);
  } else {
    fetchTasks();
  }
};

const toggleTaskCompletion = async (id) => {
  const { error } = await supabaseClient
    .from("tasks")
    .update({ is_completed: true })
    .eq("id", id);
  if (error) {
    console.error("Error toggling completion:", error);
  } else {
    fetchTasks();
  }
};

// Event Listeners
addTaskBtn.addEventListener("click", () => {
  const task = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (task) {
    addTask(task, priority);
    taskInput.value = "";
    prioritySelect.value = "low";
  } else {
    alert("Please enter a task.");
  }
});

// Initial Fetch
fetchTasks();

