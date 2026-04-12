// Get elements from the DOM
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');

// Load tasks from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task when button is clicked
addTaskButton.addEventListener('click', addTask);

// Add task when Enter key is pressed
taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Check if input is empty
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create a task object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    // Add task to the list
    displayTask(task);
    
    // Save to localStorage
    saveTasks();
    
    // Clear input field
    taskInput.value = '';
    taskInput.focus();
    
    // Update empty message
    updateEmptyMessage();
}

// Function to display a task in the list
function displayTask(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    
    if (task.completed) {
        li.classList.add('completed');
    }
    
    li.innerHTML = `
        <span class="task-text">${escapeHtml(task.text)}</span>
        <div class="task-buttons">
            <button class="complete-btn ${task.completed ? 'undo' : ''}">${task.completed ? 'Undo' : 'Complete'}</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    
    // Add event listeners to buttons
    const completeBtn = li.querySelector('.complete-btn');
    const deleteBtn = li.querySelector('.delete-btn');
    
    completeBtn.addEventListener('click', () => toggleComplete(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    taskList.appendChild(li);
}

// Function to toggle task completion
function toggleComplete(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateEmptyMessage();
    }
}

// Function to delete a task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        let tasks = getTasks();
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateEmptyMessage();
    }
}

// Function to get all tasks from localStorage
function getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Function to save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        const id = parseInt(li.getAttribute('data-id'));
        const text = li.querySelector('.task-text').textContent;
        const completed = li.classList.contains('completed');
        tasks.push({ id, text, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(task => displayTask(task));
    updateEmptyMessage();
}

// Function to render all tasks
function renderTasks() {
    taskList.innerHTML = '';
    const tasks = getTasks();
    tasks.forEach(task => displayTask(task));
}

// Function to update empty message visibility
function updateEmptyMessage() {
    const hasTasks = taskList.children.length > 0;
    emptyMessage.classList.toggle('show', !hasTasks);
}

// Function to escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>\