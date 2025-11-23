const taskInput  = document.getElementById("task-input");
const dateInput  = document.getElementById("date-input");
const addBtn  = document.getElementById("add-btn");
const editBtn  = document.getElementById("edit-btn");
const alertMessage = document.getElementById("alert-message");
const tBody = document.querySelector("tbody");
const deleteAllBtn = document.getElementById("delete-all-btn");
const filterBtn = document.querySelectorAll(".filter-todos");
let todos = JSON.parse(localStorage.getItem("todos")) || [];


const generateId = () => {
    return Math.round(Math.random() * Math.random() * Math.pow(10, 15)).toString();
};

const saveToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
};

const showAlert = (message, type) => {
    alertMessage.innerHTML = "";
    const alert = document.createElement("p");
    alert.innerText = message;
    alert.classList.add("alert");
    alert.classList.add(`alert-${type}`);
    alertMessage.appendChild(alert);

    setTimeout(() => {
        alert.style.display = "none";
    }, 2000)
};

const displayTodos = (data) => {
    const dataList = data || todos;
    tBody.innerHTML = "";
    if(!dataList.length) {
        tBody.innerHTML = "<tr><td colspan='5'>No Task Found!</td></tr>";
        return;
    }

    dataList.forEach((todo, index) => {
        tBody.innerHTML += `
            <tr>
                <td>${index +1}</td>
                <td>${todo.task}</td>
                <td>${todo.date || "No Date"}</td> 
                <td>${todo.completed ? "Completed" : "Pending"}</td>
                <td>
                    <button onclick="editHandler('${todo.id}')">Edit</button>
                    <button onclick="toggleHandler('${todo.id}')">${todo.completed ? "Undo" : "Do"}</button>
                    <button onclick="deleteHandler('${todo.id}')">Delete</button>
                </td>
            </tr>
        `
    })
};

const addHandler = () => {
    const task = taskInput.value;
    const date = dateInput.value;
    const todo = {
        id: generateId(),
        completed: false,
        task,
        date,
    };
    if(task) {
        todos.push(todo);
        saveToLocalStorage();
        displayTodos();
        taskInput.value = "";
        dateInput.value = "";
        showAlert("Todo added successfully!", "success") 
    } else (
        showAlert("Please enter a todo!", "error")
    );
};

const deleteAllHandeler = () => {
    if(todos.length) {
        todos = [];
        saveToLocalStorage();
        displayTodos();
        showAlert("All todos cleared successfully!", "success")
    } else {
        showAlert("No todos to clear!", "error")
    }
};

const deleteHandler = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    todos = newTodos;
    saveToLocalStorage();
    displayTodos();
    showAlert("Todo deleted successfully!", "success")
};

const toggleHandler = (id) => {
    const todo = todos.find(todo => todo.id === id);
    todo.completed = !todo.completed;
    saveToLocalStorage();
    displayTodos();
    showAlert("Todo status changed successfully!", "success");
};

const editHandler = (id) => {
    const todo = todos.find(todo => todo.id === id);
    taskInput.value = todo.task;
    dateInput.value = todo.date;
    addBtn.style.display = "none";
    editBtn.style.display = "inline-block";
    editBtn.dataset.id = id;
};

const applyEditHandler = (event) => {
    const id = event.target.dataset.id;
    const todo = todos.find(todo => todo.id === id);
    todo.task = taskInput.value;
    todo.date = dateInput.value;
    taskInput.value = "";
    dateInput.value = "";
    addBtn.style.display = "inline-block";
    editBtn.style.display = "none";
    saveToLocalStorage();
    displayTodos();
    showAlert("Todo edited successfully!", "success");
};

const filterHandler = event => {
    let filterTodos = null;
    const filter = event.target.dataset.filter;
    switch (filter) {
        case "pending":
            filterTodos = todos.filter(todo => todo.completed === false)
            break;

        case "completed":
            filterTodos = todos.filter(todo => todo.completed === true)
            break;

        default:
            filterTodos = todos;
            break;
    };

    displayTodos(filterTodos);
};


window.addEventListener("load", () => displayTodos());
addBtn.addEventListener("click", addHandler);
deleteAllBtn.addEventListener("click", deleteAllHandeler);
editBtn.addEventListener("click", applyEditHandler);
filterBtn.forEach(button => {
    button.addEventListener("click", filterHandler);
});