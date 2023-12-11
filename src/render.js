import { add, format, parse, parseISO } from "date-fns";
import priority from "./priority";
import Project from "./project";
import Todo from "./todo";

export function createStaticEventListeners(projectManager) {
  const inbox = document.querySelector("#inbox");
  inbox.addEventListener("click", () => {
    renderTodoList(
      projectManager.getProject(0).todos,
      projectManager.getProject(0)
    );
  });

  const today = document.querySelector("#today");
  today.addEventListener("click", () => {
    renderTodoList(projectManager.getAllTodosToday(), {
      displayName: "Today",
    });
  });

  const thisWeek = document.querySelector("#this-week");
  thisWeek.addEventListener("click", () => {
    renderTodoList(projectManager.getAllTodosThisWeek(), {
      displayName: "This Week",
    });
  });

  const newProject = document.querySelector("#new-project-button");
  newProject.addEventListener("click", showNewProjectModal);

  const createProject = document.querySelector("#create-project-button");
  createProject.addEventListener("click", () => {
    const projectName = document.querySelector("#new-project-name");
    projectManager.addProject(new Project(projectName.value));
    renderUserProjects(projectManager);
    hideNewProjectModal();
  });

  const closeProjectModal = document.querySelector("#close-project-modal");
  closeProjectModal.addEventListener("click", hideNewProjectModal);

  const newTodo = document.querySelector("#new-todo-button");
  newTodo.addEventListener("click", showAddTodoModal);

  const closeTodoModal = document.querySelector("#close-todo-modal");
  closeTodoModal.addEventListener("click", hideAddTodoModal);
}

function showNewProjectModal() {
  const newProject = document.querySelector("#new-project-modal");
  newProject.style.display = "block";
}

function hideNewProjectModal() {
  const newProject = document.querySelector("#new-project-modal");
  const projectName = document.querySelector("#new-project-name");
  projectName.value = "";
  newProject.style.display = "none";
}

function showAddTodoModal() {
  const addTodo = document.querySelector("#add-todo-modal");
  addTodo.style.display = "block";
}

function hideAddTodoModal() {
  const addTodo = document.querySelector("#add-todo-modal");

  console.log("hide");
  const todoTitle = document.querySelector("#new-todo-title");
  const todoDescription = document.querySelector("#new-todo-description");
  const todoDate = document.querySelector("#new-todo-date");
  const todoPriority = document.querySelector("#new-todo-priority");
  todoTitle.value = "";
  todoDescription.value = "";
  todoDate.value = "";
  todoPriority.value = "";
  addTodo.style.display = "none";
}

export function renderUserProjects(projectManager) {
  const userProjects = document.querySelector("#user-projects");
  removeChildren(userProjects);

  projectManager.getUserProjects().forEach((project) => {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project-element");

    const projectName = document.createElement("div");
    projectName.textContent = project.displayName;
    projectName.classList.add("project-name");
    projectName.addEventListener("click", () => {
      renderTodoList(project.todos, project);
    });

    const deleteProject = document.createElement("button");
    deleteProject.textContent = "X";
    deleteProject.classList.add("delete-project-button");
    deleteProject.addEventListener("click", () => {
      projectManager.deleteProject(project);
      renderUserProjects(projectManager);
    });

    projectElement.appendChild(projectName);
    projectElement.appendChild(deleteProject);
    userProjects.appendChild(projectElement);
  });
}

export function renderTodoList(todos, project) {
  const todoList = document.querySelector("#todo-list");
  removeChildren(todoList);

  const projectName = document.createElement("h1");
  projectName.textContent = project.displayName;
  todoList.appendChild(projectName);

  todos.forEach((todo) => {
    const newTodo = document.createElement("div");
    newTodo.classList.add("todo-element");

    const check = document.createElement("input");
    check.checked = todo.completed;
    check.type = "checkbox";
    check.addEventListener("change", () => {
      todo.completed = check.checked;
    });
    newTodo.appendChild(check);

    const todoDescription = document.createElement("div");
    todoDescription.textContent = `${todo.title} ${todo.description} ${format(
      todo.dueDate,
      "d.M.yyyy"
    )} ${todo.priority}`;
    newTodo.appendChild(todoDescription);

    todoList.appendChild(newTodo);
  });

  const newTodo = document.querySelector("#new-todo");
  if (project instanceof Project) {
    newTodo.style.display = "block";
    renderNewTodoButton(project);
  } else {
    newTodo.style.display = "none";
  }
}

function renderNewTodoButton(project) {
  const addTodo = document.querySelector("#add-todo-button-div");
  addTodo.innerHTML = "";

  const button = document.createElement("button");
  button.id = "add-todo-button";
  button.textContent = "Add Todo";
  button.addEventListener("click", () => {
    const todoTitle = document.querySelector("#new-todo-title");
    const todoDescription = document.querySelector("#new-todo-description");
    const todoDate = document.querySelector("#new-todo-date");
    const todoPriority = document.querySelector("#new-todo-priority");
    project.addTodo(
      new Todo(
        todoTitle.value,
        todoDescription.value,
        parseISO(todoDate.value),
        todoPriority.value
      )
    );
    renderTodoList(project.todos, project);
    hideAddTodoModal();
  });
  addTodo.appendChild(button);
}

function removeChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
