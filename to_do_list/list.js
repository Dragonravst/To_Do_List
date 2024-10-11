const todoValue = document.getElementById("todo-input"); 
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

let todo = JSON.parse(localStorage.getItem("todo-list"));
let updateText = null; 
if (!todo) {
  todo = [];
}

function CreateToDoItems() {
    if (todoValue.value === "") {
      todoAlert.innerText = "Please enter your todo text!";
      todoValue.focus();
    } else {
      let IsPresent = todo.some(element => element.item === todoValue.value);
  
      if (IsPresent) {
        setAlertMessage("This item already present in the list!");
        return;
      }
  
      let li = document.createElement("li");
      const todoItems = `<div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${todoValue.value}</div>
                        <div>
                        <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="pencil.png" />
                        <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="delete.png" /></div>`;
      li.innerHTML = todoItems;
      listItems.appendChild(li);
  
      todo.push({ item: todoValue.value, status: false });
      setLocalStorage();
    }
    todoValue.value = "";
    setAlertMessage("Todo item Created Successfully!");
}

function ReadToDoItems() {
    todo.forEach((element) => {
      let li = document.createElement("li");
      let style = element.status ? "style='text-decoration: line-through'" : "";
      const todoItems = `<div ${style} title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${element.item}
                        ${element.status ? '<img class="todo-controls" src="check-mark.png" />' : ""}
                        </div><div>
                        ${!element.status ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="pencil.png" />' : ""}
                        <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="delete.png" /></div>`;
      li.innerHTML = todoItems;
      listItems.appendChild(li);
    });
}
ReadToDoItems();

function UpdateToDoItems(e) {
    if (e.parentElement.parentElement.querySelector("div").style.textDecoration === "") {
      todoValue.value = e.parentElement.parentElement.querySelector("div").innerText;
      updateText = e.parentElement.parentElement.querySelector("div");
      addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
      addUpdate.setAttribute("src","refresh.png");
      todoValue.focus();
    }
}

function UpdateOnSelectionItems() {
    let IsPresent = todo.some(element => element.item === todoValue.value);
  
    if (IsPresent) {
      setAlertMessage("This item already present in the list!");
      return;
    }
  
    todo.forEach(element => {
      if (element.item === updateText.innerText.trim()) {
        element.item = todoValue.value;
      }
    });
    setLocalStorage();
  
    updateText.innerText = todoValue.value;
    addUpdate.setAttribute("onclick", "CreateToDoItems()");
    addUpdate.setAttribute("src", "add.png");
    todoValue.value = "";
    setAlertMessage("Todo item Updated Successfully!");
}

function DeleteToDoItems(e) {
    let deleteValue = e.parentElement.parentElement.querySelector("div").innerText;
  
    if (confirm(`Are you sure you want to delete this ${deleteValue}?`)) {
      e.parentElement.parentElement.classList.add("deleted-item");
  
      let index = todo.findIndex(element => element.item.trim() === deleteValue.trim());
      if (index > -1) {
        todo.splice(index, 1); 
      }
  
      setTimeout(() => {
        e.parentElement.parentElement.remove();
      }, 1000);
  
      setLocalStorage();
    }
}

function CompletedToDoItems(e) {
    if (e.parentElement.querySelector("div").style.textDecoration === "") {
      const img = document.createElement("img");
      img.src = "check.png";
      img.className = "todo-controls";
      e.parentElement.querySelector("div").style.textDecoration = "line-through";
      e.parentElement.querySelector("div").appendChild(img);
      e.parentElement.querySelector("img.edit").remove();
  
      todo.forEach(element => {
        if (e.parentElement.querySelector("div").innerText.trim() === element.item) {
          element.status = true;
        }
      });
      setLocalStorage();
      setAlertMessage("Todo item Completed Successfully!");
    }
}

function setLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
    todoAlert.classList.remove("toggleMe");
    todoAlert.innerText = message;
    setTimeout(() => {
      todoAlert.classList.add("toggleMe");
    }, 1000);
}
