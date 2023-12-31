import { format } from "date-fns";
import Project from "./project";
import Todo from "./todo";
import Storage from "./local_storage";

import GhLogo from "./img/githublogo.png";

export function renderWebsite(projectManager) {
  renderUserProjects(projectManager);
  renderProjectView(0, projectManager.getProject(0));
  renderNewTodoButton(projectManager.getProject(0));
  createStaticEventListeners(projectManager);
  createProjectModalEventListeners(projectManager);
  createTodoModalEventListeners(projectManager);

  const ghLogo = document.querySelector("#gh-logo");
  ghLogo.src = GhLogo;
}

function createStaticEventListeners(projectManager) {
  const inbox = document.querySelector("#inbox");
  inbox.addEventListener("click", () => {
    renderProjectView(0, projectManager.getProject(0));
  });

  const today = document.querySelector("#today");
  today.addEventListener("click", () => {
    renderNonProjectView("Today", projectManager.getAllTodosToday());
  });

  const thisWeek = document.querySelector("#this-week");
  thisWeek.addEventListener("click", () => {
    renderNonProjectView("This Week", projectManager.getAllTodosThisWeek());
  });
}

function createProjectModalEventListeners(projectManager) {
  const newProject = document.querySelector("#new-project-button");
  newProject.addEventListener("click", showNewProjectModal);

  const createProject = document.querySelector("#create-project-button");
  createProject.addEventListener("click", () => {
    const projectName = document.querySelector("#new-project-name");
    const newProject = new Project(projectName.value);
    projectManager.addProject(newProject);
    Storage.addProject(newProject);
    renderUserProjects(projectManager);
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

function renderUserProjects(projectManager) {
  const userProjects = document.querySelector("#user-projects");
  removeChildren(userProjects);

  projectManager.getUserProjects().forEach((project) => {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project-element");

    const projectName = document.createElement("div");
    projectName.textContent = project.getDisplayName();
    projectName.classList.add("project-name");
    projectName.addEventListener("click", () => {
      renderProjectView(projectManager.getProjectIndex(project), project);
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
      const projectIndex = projectManager.getProjectIndex(project);
      projectManager.deleteProject(projectIndex);
      Storage.deleteProject(projectIndex);
      renderUserProjects(projectManager);
      renderProjectView(0, projectManager.getProject(0));
    });

    projectElement.appendChild(projectName);
    projectElement.appendChild(editProject);
    projectElement.appendChild(deleteProject);
    userProjects.appendChild(projectElement);
  });
}

function showEditProjectModal(project, projectManager) {
  const editProjectName = document.querySelector("#edit-project-name");
  editProjectName.value = project.getDisplayName();

  const editProjectButtonDiv = document.querySelector(
    "#edit-project-button-div"
  );
  editProjectButtonDiv.innerHTML = "";

  const button = document.createElement("button");
  button.id = "confirm-edit-project-button";
  button.textContent = "Confirm";
  button.addEventListener("click", () => {
    project.setDisplayName(editProjectName.value);
    Storage.editProject(
      projectManager.getProjectIndex(project),
      editProjectName.value
    );
    renderUserProjects(projectManager);
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

function renderProjectView(projectIndex, project) {
  const viewNameElement = document.querySelector("#view-name");
  viewNameElement.textContent = "Project View";

  const projectIndexElement = document.querySelector("#project-index");
  projectIndexElement.setAttribute("data-index", projectIndex);

  const todoList = document.querySelector("#todo-list");
  removeChildren(todoList);

  renderProject(project, true);

  const newTodo = document.querySelector("#new-todo");
  renderNewTodoButton(project);
  newTodo.style.display = "block";
}

function renderNonProjectView(viewName, projectList) {
  console.log(projectList);

  const viewNameElement = document.querySelector("#view-name");
  viewNameElement.textContent = viewName;

  const projectIndex = document.querySelector("#project-index");
  projectIndex.setAttribute("data-index", "");

  const todoList = document.querySelector("#todo-list");
  removeChildren(todoList);

  projectList.forEach((projectElement) => {
    renderProject(projectElement, false);
  });

  const newTodo = document.querySelector("#new-todo");
  newTodo.style.display = "none";
}

function renderProject(project, isProjectView) {
  const todoList = document.querySelector("#todo-list");

  const projectName = document.createElement("h1");
  projectName.textContent = project.getDisplayName();
  todoList.appendChild(projectName);

  project.todos.forEach((todo) => {
    const todoElement = document.createElement("div");
    todoElement.classList.add("todo-element");

    const todoOverview = document.createElement("div");
    todoOverview.classList.add(
      "todo-overview",
      `priority-${todo.getPriority()}`
    );
    todoOverview.setAttribute("data-expanded", "false");

    const check = document.createElement("input");
    check.checked = todo.getCompleted();
    check.type = "checkbox";
    check.addEventListener("click", (event) => {
      todo.setCompleted(check.checked);
      const projectIndexElement = document.querySelector("#project-index");
      Storage.setCompleted(
        projectIndexElement.dataset.index,
        project.getTodoIndex(todo),
        check.checked
      );

      event.stopPropagation();
    });
    todoOverview.appendChild(check);

    const title = document.createElement("div");
    title.textContent = todo.getTitle();
    todoOverview.appendChild(title);

    const dueDate = document.createElement("div");
    dueDate.textContent = format(todo.getDueDate(), "d.M.yyyy");
    todoOverview.appendChild(dueDate);

    if (isProjectView) {
      const editTodo = document.createElement("button");
      editTodo.textContent = "Edit";
      editTodo.addEventListener("click", (event) => {
        showEditTodoModal(todo, project);
        event.stopPropagation();
      });
      todoOverview.appendChild(editTodo);

      const deleteTodo = document.createElement("button");
      deleteTodo.textContent = "X";
      deleteTodo.addEventListener("click", (event) => {
        const todoIndex = project.getTodoIndex(todo);
        project.deleteTodo(todoIndex);

        const projectIndexElement = document.querySelector("#project-index");
        Storage.deleteTodo(projectIndexElement.dataset.index, todoIndex);

        renderProjectView(projectIndexElement.dataset.index, project);
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
    todoDetails.textContent = todo.getDescription();
    todoDetails.classList.add("todo-details");

    todoElement.appendChild(todoDetails);

    todoList.appendChild(todoElement);
  });
}

function showEditTodoModal(todo, project) {
  const editTodoCompleted = document.querySelector("#edit-todo-completed");
  editTodoCompleted.checked = todo.getCompleted();

  const editTodoTitle = document.querySelector("#edit-todo-title");
  editTodoTitle.value = todo.getTitle();

  const editTodoDescription = document.querySelector("#edit-todo-description");
  editTodoDescription.value = todo.getDescription();

  const editTodoDate = document.querySelector("#edit-todo-date");
  editTodoDate.value = format(todo.getDueDate(), "yyyy-MM-dd");

  const editTodoPriority = document.querySelector("#edit-todo-priority");
  editTodoPriority.value = todo.getPriority();

  const editTodoButtonDiv = document.querySelector("#edit-todo-button-div");
  editTodoButtonDiv.innerHTML = "";

  const button = document.createElement("button");
  button.id = "confirm-edit-todo-button";
  button.textContent = "Confirm";
  button.addEventListener("click", () => {
    const editedTodo = new Todo(
      editTodoTitle.value,
      editTodoDescription.value,
      editTodoDate.value,
      editTodoPriority.value
    );
    editedTodo.setCompleted(editTodoCompleted.checked);
    console.log(editedTodo);

    const projectIndexElement = document.querySelector("#project-index");
    todo.editTodo(editedTodo);
    Storage.editTodo(
      projectIndexElement.dataset.index,
      project.getTodoIndex(todo),
      editedTodo
    );

    renderProjectView(projectIndexElement.dataset.index, project);
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

function renderNewTodoButton(project) {
  const addTodo = document.querySelector("#add-todo-button-div");
  addTodo.innerHTML = "";

  const button = document.createElement("button");
  button.id = "add-todo-button";
  button.textContent = "Add Todo";
  button.addEventListener("click", () => {
    console.log("click");
    const todoTitle = document.querySelector("#new-todo-title");
    const todoDescription = document.querySelector("#new-todo-description");
    const todoDate = document.querySelector("#new-todo-date");
    const todoPriority = document.querySelector("#new-todo-priority");

    const newTodo = new Todo(
      todoTitle.value,
      todoDescription.value,
      todoDate.value,
      todoPriority.value
    );
    project.addTodo(newTodo);

    const projectIndexElement = document.querySelector("#project-index");
    Storage.addTodo(projectIndexElement.dataset.index, newTodo);

    renderProjectView(projectIndexElement.dataset.index, project);
    hideAddTodoModal();
  });
  addTodo.appendChild(button);
}

function removeChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
