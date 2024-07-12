let toDoList = document.querySelector("#todolist");
let finishedList = document.querySelector("#finishedlist");
let taskNameInput = document.querySelector(".taskNameInput");

let toDoTasks = localStorage.getItem("toDoTasks")? JSON.parse(localStorage.getItem("toDoTasks")) : [];
let finishedTasks = localStorage.getItem("finishedTasks")? JSON.parse(localStorage.getItem("finishedTasks")) : [];

if (toDoList)
    render(toDoList);
else
    render(finishedList);

function addTask (e) {
    //to prevent going to another page or refresh
    e.preventDefault();

    //adding a new task
    if (taskNameInput.value.trim() !== "") {
        toDoTasks.push({name: taskNameInput.value.trim(), finished: false});
        //reload the tasks
        render(toDoList);
        //reset value of the input field
        taskNameInput.value = "";
    }
    else{
        alert("Enter the name of your task !");
    }
    //update local storage
    localStorage.setItem("toDoTasks", JSON.stringify(toDoTasks));
};

function render (list) {
    list.innerHTML="";
    let listTasks = list.id === "todolist" ? toDoTasks : finishedTasks;
    listTasks.forEach((task, index) => {
        let newTask = document.createElement('div');
        newTask.classList.add('task');
        newTask.id = `t${index}`;
        newTask.innerHTML = `
            <input id="task${index}" type="checkbox" ${list.id === "todolist" ? "" : "checked"} 
            onchange="changeCompletionOfTask(this, ${index}, ${task.finished})">
            <label id="taskLabel${index}" for="task${index}">${task.name}</label>
            <button 
            onclick="editTask('taskLabel${index}', '${task.name}', ${list.id === "todolist" ? "toDoTasks" : "finishedTasks"}, '${index}')" 
            class="edit">
                <img  width="15px" src="https://www.svgrepo.com/show/93338/pencil-black-gross-tool.svg" alt="edit">
            </button>
            <button onclick="return deleteTask(${index}, ${task.finished})" class="delete">
                <img src="https://www.svgrepo.com/show/380138/x-close-delete.svg" width="15px" alt="delete">
            </button>
        `;
        list.appendChild(newTask);
    });    
}

function deleteTask (index, finished) {
    if (finished) {
        finishedTasks.splice(index, 1);
        render(finishedList);
    }
    else {    
        toDoTasks.splice(index, 1);
        render(toDoList);
    }

    localStorage.setItem("toDoTasks", JSON.stringify(toDoTasks));
    localStorage.setItem("finishedTasks", JSON.stringify(finishedTasks));
}

let i = 0;

function changeCompletionOfTask (obj, index, finished) {
    if (i === 1) {
        obj.checked = !obj.checked;
        return;
    }
    
    i++;

    setTimeout(function () {
        if (!finished) {
            toDoTasks[index].finished = true;
            finishedTasks.push(toDoTasks[index]);
            toDoTasks.splice(index, 1);
            render(toDoList);
        }

        else {
            finishedTasks[index].finished = false;
            toDoTasks.push(finishedTasks[index]);
            finishedTasks.splice(index, 1);
            render(finishedList);
        }

        localStorage.setItem("finishedTasks", JSON.stringify(finishedTasks));
        localStorage.setItem("toDoTasks", JSON.stringify(toDoTasks));
        i = 0;
    }, 2000);
}

function editTask (id, name, tasksArrayId, index) {
    let newName = prompt("Enter the name of your task:", name);
    
    if (newName) {
        document.getElementById(id).innerHTML = newName;
        
        if (tasksArrayId === "toDoTasks")
            toDoTasks[index].name = newName;
        else
            finishedTasks[index].name = newName;    
        
        localStorage.setItem("finishedTasks", JSON.stringify(finishedTasks));
        localStorage.setItem("toDoTasks", JSON.stringify(toDoTasks));
    }
    else
        document.getElementById(id).innerHTML = name;
}
