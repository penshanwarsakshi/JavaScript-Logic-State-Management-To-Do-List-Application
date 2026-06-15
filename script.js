// DOM Elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

// Application State
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Save data to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks based on filter
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>

            <div class="actions">
                <button class="toggle-btn">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// CREATE
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();

    taskInput.value = "";
}

// Event: Add Task
addBtn.addEventListener("click", addTask);

// Event: Enter Key
taskInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
        addTask();
    }
});

// Delegated Event Listener
taskList.addEventListener("click", function (e) {

    const li = e.target.closest("li");

    if (!li) {
        return;
    }

    const id = Number(li.dataset.id);

    // DELETE
    if (e.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();

        renderTasks();
    }

    // TOGGLE COMPLETE
    if (e.target.classList.contains("toggle-btn")) {

        tasks = tasks.map(task => {

            if (task.id === id) {
                task.completed = !task.completed;
            }

            return task;
        });

        saveTasks();

        renderTasks();
    }

    // UPDATE
    if (e.target.classList.contains("edit-btn")) {

        const task = tasks.find(task => task.id === id);

        const updatedText = prompt("Edit task:", task.text);

        if (updatedText && updatedText.trim() !== "") {

            task.text = updatedText.trim();

            saveTasks();

            renderTasks();
        }
    }
});

// FILTERING
filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        currentFilter = this.dataset.filter;

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        renderTasks();
    });
});

// Initial Render
renderTasks();
