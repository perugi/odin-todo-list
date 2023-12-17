import { add, format, parse, parseISO } from "date-fns";
import priority from "./priority";
import Project from "./project";
import Todo from "./todo";
import { storeProjectManager } from "./local_storage";

import GhLogo from "./img/githublogo.png";

export function renderWebsite(projectManager) {
  renderUserProjects(projectManager);
  renderProjectTodoList(projectManager.getProject(0), projectManager);
  createStaticEventListeners(projectManager);
  createProjectModalEventListeners(projectManager);
  createTodoModalEventListeners(projectManager);

  const ghLogo = document.querySelector("#gh-logo");
  ghLogo.src = GhLogo;
}

function createStaticEventListeners(projectManager) {
  const inbox = document.querySelector("#inbox");
  inbox.addEventListener("click", () => {
    renderProjectTodoList(projectManager.getProject(0), projectManager);
  });

  const today = document.querySelector("#today");
  today.addEventListener("click", () => {
    renderTodoList("Today", projectManager.getAllTodosToday(), projectManager);
  });

  const thisWeek = document.querySelector("#this-week");
  thisWeek.addEventListener("click", () => {
    renderTodoList(
      "This Week",
      projectManager.getAllTodosThisWeek(),
      projectManager
    );
  });
}

function createProjectModalEventListeners(projectManager) {
  const newProject = document.querySelector("#new-project-button");
  newProject.addEventListener("click", showNewProjectModal);

  const createProject = document.querySelector("#create-project-button");
  createProject.addEventListener("click", () => {
    const projectName = document.querySelector("#new-project-name");
    projectManager.addProject(new Project(projectName.value));
    renderUserProjects(projectManager);
    storeProjectManager(projectManager);
    hideNewProjectModal();
  });

  const closeProjectModal = document.querySelector("#close-project-modal");
  closeProjectModal.addEventListener("click", hideNewProjectModal);

  const closeEditProjectModal = document.querySelector(
    "#close-edit-project-modal"
  );
  closeEditProjectModal.addEventListener("click", hideEditProjectModal);
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

function createTodoModalEventListeners() {
  const newTodo = document.querySelector("#new-todo-button");
  newTodo.addEventListener("click", showAddTodoModal);

  const closeTodoModal = document.querySelector("#close-todo-modal");
  closeTodoModal.addEventListener("click", hideAddTodoModal);

  const closeEditTodoModal = document.querySelector("#close-edit-todo-modal");
  closeEditTodoModal.addEventListener("click", hideEditTodoModal);
}

function showAddTodoModal() {
  const addTodo = document.querySelector("#add-todo-modal");
  addTodo.style.display = "block";
}

function hideAddTodoModal() {
  const addTodo = document.querySelector("#add-todo-modal");

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
      renderProjectTodoList(project, projectManager);
    });

    const editProject = document.createElement("button");
    editProject.textContent = "Edit";
    editProject.classList.add("edit-project-button");
    editProject.addEventListener("click", () =>
      showEditProjectModal(project, projectManager)
    );

    const deleteProject = document.createElement("button");
    deleteProject.textContent = "X";
    deleteProject.classList.add("delete-project-button");
    deleteProject.addEventListener("click", () => {
      projectManager.deleteProject(project);
      renderUserProjects(projectManager);
      renderProjectTodoList(projectManager.getProject(0), projectManager);
    });

    projectElement.appendChild(projectName);
    projectElement.appendChild(editProject);
    projectElement.appendChild(deleteProject);
    userProjects.appendChild(projectElement);
  });
}

function showEditProjectModal(project, projectManager) {
  const editProjectName = document.querySelector("#edit-project-name");
  editProjectName.value = project.displayName;

  const editProjectButtonDiv = document.querySelector(
    "#edit-project-button-div"
  );
  editProjectButtonDiv.innerHTML = "";

  const button = document.createElement("button");
  button.id = "confirm-edit-project-button";
  button.textContent = "Confirm";
  button.addEventListener("click", () => {
    project.displayName = editProjectName.value;
    renderUserProjects(projectManager);
    storeProjectManager(projectManager);
    hideEditProjectModal();
  });
  editProjectButtonDiv.appendChild(button);

  const editProject = document.querySelector("#edit-project-modal");
  editProject.style.display = "block";
}

function hideEditProjectModal() {
  const editProject = document.querySelector("#edit-project-modal");
  const editProjectName = document.querySelector("#edit-project-name");
  editProjectName.value = "";
  editProject.style.display = "none";
}

export function renderTodoList(viewName, projectList, projectManager) {
  const viewNameElement = document.querySelector("#view-name");
  viewNameElement.textContent = viewName;

  const todoList = document.querySelector("#todo-list");
  removeChildren(todoList);

  projectList.forEach((projectElement) => {
    renderProject(viewName, projectElement, projectManager);
  });

  const newTodo = document.querySelector("#new-todo");
  if (viewName === "Project View") {
    newTodo.style.display = "block";
    renderNewTodoButton(projectList[0].project, projectManager);
  } else {
    newTodo.style.display = "none";
  }
}

function renderProject(viewName, projectElement, projectManager) {
  const todoList = document.querySelector("#todo-list");

  const projectName = document.createElement("h1");
  projectName.textContent = projectElement.project.displayName;
  todoList.appendChild(projectName);

  projectElement.todos.forEach((todo) => {
    const todoElement = document.createElement("div");
    todoElement.classList.add("todo-element");

    const todoOverview = document.createElement("div");
    todoOverview.classList.add("todo-overview", `priority-${todo.priority}`);
    todoOverview.setAttribute("data-expanded", "false");

    const check = document.createElement("input");
    check.checked = todo.completed;
    check.type = "checkbox";
    check.addEventListener("click", (event) => {
      todo.completed = check.checked;
      event.stopPropagation();
    });
    todoOverview.appendChild(check);

    const title = document.createElement("div");
    title.textContent = todo.title;
    todoOverview.appendChild(title);

    const dueDate = document.createElement("div");
    dueDate.textContent = format(todo.dueDate, "d.M.yyyy");
    todoOverview.appendChild(dueDate);

    if (viewName === "Project View") {
      const editTodo = document.createElement("button");
      editTodo.textContent = "Edit";
      editTodo.addEventListener("click", (event) => {
        showEditTodoModal(todo, projectElement, projectManager);
        event.stopPropagation();
      });
      todoOverview.appendChild(editTodo);

      const deleteTodo = document.createElement("button");
      deleteTodo.textContent = "X";
      deleteTodo.addEventListener("click", (event) => {
        projectElement.project.deleteTodo(todo);
        renderProjectTodoList(projectElement.project, projectManager);
        event.stopPropagation();
      });
      todoOverview.appendChild(deleteTodo);
    }

    todoElement.addEventListener("click", () => {
      todoOverview.setAttribute(
        "data-expanded",
        todoOverview.getAttribute("data-expanded") === "true" ? "false" : "true"
      );
    });

    todoElement.appendChild(todoOverview);

    const todoDetails = document.createElement("div");
    todoDetails.textContent = todo.description;
    todoDetails.classList.add("todo-details");

    todoElement.appendChild(todoDetails);

    todoList.appendChild(todoElement);
  });
}

function showEditTodoModal(todo, project, projectManager) {
  const editTodoTitle = document.querySelector("#edit-todo-title");
  editTodoTitle.value = todo.title;

  const editTodoDescription = document.querySelector("#edit-todo-description");
  editTodoDescription.value = todo.description;

  const editTodoDate = document.querySelector("#edit-todo-date");
  editTodoDate.value = format(todo.dueDate, "yyyy-MM-dd");

  const editTodoPriority = document.querySelector("#edit-todo-priority");
  editTodoPriority.value = todo.priority;

  const editTodoButtonDiv = document.querySelector("#edit-todo-button-div");
  editTodoButtonDiv.innerHTML = "";

  const button = document.createElement("button");
  button.id = "confirm-edit-todo-button";
  button.textContent = "Confirm";
  button.addEventListener("click", () => {
    todo.title = editTodoTitle.value;
    todo.description = editTodoDescription.value;
    todo.dueDate = parseISO(editTodoDate.value);
    todo.priority = editTodoPriority.value;
    renderProjectTodoList(project.project, projectManager);
    storeProjectManager(projectManager);
    hideEditTodoModal();
  });
  editTodoButtonDiv.appendChild(button);

  const editTodoModal = document.querySelector("#edit-todo-modal");
  editTodoModal.style.display = "block";
}

function hideEditTodoModal() {
  const editTodo = document.querySelector("#edit-todo-modal");

  const editTodoTitle = document.querySelector("#edit-todo-title");
  editTodoTitle.value = "";

  const editTodoDescription = document.querySelector("#edit-todo-description");
  editTodoDescription.value = "";

  const editTodoDate = document.querySelector("#edit-todo-date");
  editTodoDate.value = "";

  const editTodoPriority = document.querySelector("#edit-todo-priority");
  editTodoPriority.value = "";

  editTodo.style.display = "none";
}

function renderNewTodoButton(project, projectManager) {
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
    renderProjectTodoList(project, projectManager);
    storeProjectManager(projectManager);
    hideAddTodoModal();
  });
  addTodo.appendChild(button);
}

function renderProjectTodoList(project, projectManager) {
  renderTodoList(
    "Project View",
    [
      {
        project: project,
        todos: project.todos,
      },
    ],
    projectManager
  );
}

function removeChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
