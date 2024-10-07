// State variables
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Cached element references
const taskForm = document.getElementById("taskForm");
const taskTable = document.querySelector("#taskTable tbody");
const filter = document.getElementById('filter');

// Functions

// Handle form submission
function handleSubmission(event) {
    event.preventDefault();

    // Get form input values
    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskDeadline = document.getElementById('taskDeadline').value;
    const taskPriority = document.getElementById('taskPriority').value;

    // Validate input fields
    if (!taskName || !taskDeadline) {
        alert('Task name and deadline are required!');
        return;
    }

    // Update tasks array
    tasks.push({ 
        name: taskName, 
        description: taskDescription, 
        deadline: taskDeadline,
        priority: taskPriority,
        completed: false
    });

    // Clear form inputs after submission
    taskForm.reset();

    // Save to localStorage
    saveTasks();

    // Render the tasks table
    render();
}

// Render tasks in the table
function render() {
    // Clear current table rows
    taskTable.innerHTML = '';

    // Filter tasks based on selection
    let filteredTasks = tasks;
    const filterValue = filter.value;
    if (filterValue === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filterValue === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Use array methods to create a new table row for each task
    filteredTasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.className = task.completed ? 'completed' : '';

        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.description || 'No description'}</td>
            <td>${task.deadline}</td>
            <td class="${task.priority.toLowerCase()}-priority">${task.priority}</td>
            <td>
                <button onclick="markTaskComplete(${index})">Complete</button>
                <button onclick="editTask(${index})">Edit</button>
                <button onclick="removeTask(${index})">Remove</button>
            </td>
        `;
        taskTable.appendChild(row);
    });
}

// Mark task as complete
function markTaskComplete(index) {
    tasks[index].completed = true;
    saveTasks();
    render();
}

// Edit task
function editTask(index) {
    const task = tasks[index];
    document.getElementById('taskName').value = task.name;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskDeadline').value = task.deadline;
    document.getElementById('taskPriority').value = task.priority;

    removeTask(index);  // Remove the old task before updating
}

// Remove task
function removeTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    render();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initialize app
function init() {
    render();
}

// Event listener for form submission
taskForm.addEventListener('submit', handleSubmission);

// Event listener for filter change
filter.addEventListener('change', render);

// Call the init function to set up the initial state of the app
init();
