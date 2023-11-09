// select elements
const taskList = document.querySelector(".task-list");
const form = document.forms[0];
const wrapper = document.querySelector(".wrapper");
const formInput = document.getElementById("task");
const submitBtn = document.querySelector(".submit");
const alert = document.querySelector(".alert");
const task = document.querySelector(".task");
const clearBtn = document.querySelector(".clear");

// initial value
let canEdit = false;
let editID = "";
// events listener
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
// display items when load
window.addEventListener("DOMContentLoaded", displayItems);
// ------ functions --------
//add item
function addItem(e) {
  e.preventDefault();
  let id = new Date().getTime().toString();
  let value = formInput.value;
  if (value && !canEdit) {
    displayItemsStructure(id, value);
    taskList.classList.add("show");
    displayAlert("Task Added successfully", "alert-success");
    // add item to local storage
    addToLocalStorage(id, value);
    //back to default
    backToDefault();
  } else if (value && canEdit) {
    updateItem(editID, formInput.value);
    displayAlert("Task updated successfully", "alert-success");
    // window.location.reload();

    taskList.classList.add("show");
    backToDefault();
  } else {
    displayAlert("Invalid empty value", "alert-danger");
  }
}

// display alert
function displayAlert(text, alertClass) {
  alert.textContent = text;
  alert.classList.add(alertClass);
  // remove alert
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(alertClass);
  }, 1000);
}
// back to default
function backToDefault() {
  formInput.value = "";
  canEdit = false;
  editID = "";
  submitBtn.textContent = "Add";
}

// add task to local storage
function addToLocalStorage(key, value) {
  let list = getFromLocalStorage();

  const task = { key, value };
  list.push(task);
  localStorage.setItem("list", JSON.stringify(list));
  //   window.localStorage.setItem(key, value);
}

// clear items
function clearItems() {
  let tasks = document.querySelectorAll(".task");
  if (tasks.length > 0) {
    tasks.forEach((task) => {
      wrapper.removeChild(task);
    });
  }

  window.localStorage.removeItem("list");
  taskList.classList.remove("show");
  displayAlert("All tasks removed successfully", "alert-info");
  backToDefault();
}

// delete item
function deleteItem(e) {
  let el = e.currentTarget.parentElement.parentElement;
  wrapper.removeChild(el);
  // display alert
  displayAlert("Task removed successfully", "alert-success");

  // hide the tasks container if there is no items
  if (wrapper.children.length === 0) taskList.classList.remove("show");

  // delete item from local storage
  deleteFromLocalStorage(el.dataset.id);
  // back to default
  backToDefault();
}

function editItem(e) {
  let taskName = e.currentTarget.parentElement.previousElementSibling;
  formInput.value = taskName.textContent.trim();
  submitBtn.textContent = "Update";
  canEdit = true;
  editID = e.currentTarget.parentElement.parentElement.dataset.id;
}

// delete item from local storage
function deleteFromLocalStorage(id) {
  let items = getFromLocalStorage();
  items = items.filter((item) => {
    if (item.key !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// update item
function updateItem(id, value) {
  let items = getFromLocalStorage();
  items = items.map((item) => {
    if (item.key === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// get items from local storage
function getFromLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// display items
function displayItems() {
  const items = getFromLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      displayItemsStructure(item.key, item.value);
    });
    taskList.classList.add("show");
  }
}

function displayItemsStructure(key, value) {
  const itemEl = document.createElement("article");
  itemEl.classList.add("task");
  let idAttr = document.createAttribute("data-id");
  idAttr.value = key;
  itemEl.setAttributeNode(idAttr, key);
  itemEl.innerHTML = `<div class="task-name">${value}
      </div>
      <div class="btns-container">
          <button class="edit" type="button">
          <i class="fa-solid fa-edit"></i>
          </button>
          <button class="del" type="button">
          <i class="fa-solid fa-trash"></i>
          </button>
      </div>`;
  wrapper.appendChild(itemEl);
  const editBtn = itemEl.querySelector(".edit");
  editBtn.addEventListener("click", editItem);
  const delBtn = itemEl.querySelector(".del");
  delBtn.addEventListener("click", deleteItem);
}
