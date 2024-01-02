import { format } from "date-fns";
import Project from "./project";
import Todo from "./todo";
import Storage from "./local_storage";

import NoteLogo from "./img/list.svg";
import GhLogo from "./img/githublogo.png";

export function renderWebsite(projectManager) {
  renderUserProjects(projectManager);
  renderProjectView(0, projectManager.getProject(0));
  createStaticEventListeners(projectManager);
  createProjectModalEventListeners(projectManager);
  createTodoModalEventListeners(projectManager);
  renderImages();
}

function renderImages() {
  const noteLogo = document.querySelector("#logo");
  noteLogo.src = NoteLogo;

  const ghLogo = document.querySelector("#gh-logo");
  ghLogo.src = GhLogo;
}

function createStaticEventListeners(projectManager) {
  const inbox = document.querySelector("#inbox");
  inbox.addEventListener("click", () => {
    renderProjectView(0, projectManager.getProject(0));
    addSelectedClass(inbox);
  });

  const today = document.querySelector("#today");
  today.addEventListener("click", () => {
    renderView("Today", projectManager.getAllTodosToday());
    addSelectedClass(today);
  });

  const thisWeek = document.querySelector("#this-week");
  thisWeek.addEventListener("click", () => {
    renderView("This Week", projectManager.getAllTodosThisWeek());
    addSelectedClass(thisWeek);
  });
}

function renderUserProjects(projectManager) {
  const userProjects = document.querySelector("#user-projects");
  removeChildren(userProjects);

  projectManager.getUserProjects().forEach((project) => {
    const projectIndex = projectManager.getProjectIndex(project);

    const projectElement = document.createElement("div");
    projectElement.classList.add("project-list-element");

    const projectName = document.createElement("div");
    projectName.textContent = project.getDisplayName();
    projectName.classList.add("project-name");
    projectName.addEventListener("click", () => {
      renderProjectView(projectIndex, project);
      addSelectedClass(projectElement);
    });

    const editProject = document.createElement("div");
    editProject.classList.add("edit-project-button");
    editProject.addEventListener("click", () =>
      showEditProjectModal(project, projectManager)
    );

    const deleteProject = document.createElement("div");
    deleteProject.classList.add("delete-project-button");
    deleteProject.addEventListener("click", () => {
      showDeleteProjectModal(project, projectManager);
    });

    projectElement.appendChild(projectName);
    projectElement.appendChild(editProject);
    projectElement.appendChild(deleteProject);
    userProjects.appendChild(projectElement);
  });
}

function addSelectedClass(element) {
  const staticElements = [
    ...document.querySelectorAll("#static-selection>div"),
  ];

  const projectListElements = [
    ...document.querySelectorAll(".project-list-element"),
  ];

  const allElements = [...staticElements, ...projectListElements];
  allElements.forEach((element) => {
    element.classList.remove("selected");
  });

  element.classList.add("selected");
}

function createProjectModalEventListeners(projectManager) {
  // New Project button listener
  const newProject = document.querySelector("#new-project-button");
  newProject.addEventListener("click", showNewProjectModal);

  // New Project modal listeners
  const newProjectModal = document.querySelector("#new-project-modal");

  const confirmNewProject = newProjectModal.querySelector(
    "#confirm-new-project-button"
  );
  confirmNewProject.addEventListener("click", () => {
    const projectName = newProjectModal.querySelector("#new-project-name");
    const newProject = new Project(projectName.value);
    projectManager.addProject(newProject);
    Storage.addProject(newProject);
    renderUserProjects(projectManager);
    hideNewProjectModal();
  });

  const closeNewProjectModal = newProjectModal.querySelector(
    "#close-project-modal"
  );
  closeNewProjectModal.addEventListener("click", hideNewProjectModal);

  // Edit Project modal listeners
  const editProjectModal = document.querySelector("#edit-project-modal");

  const confirmEditProject = editProjectModal.querySelector(
    "#confirm-edit-project-button"
  );
  confirmEditProject.addEventListener("click", () => {
    const editProjectName =
      editProjectModal.querySelector("#edit-project-name");
    const projectIndex = confirmEditProject.dataset.projectIndex;

    projectManager
      .getProject(projectIndex)
      .setDisplayName(editProjectName.value);
    Storage.editProject(projectIndex, editProjectName.value);

    renderUserProjects(projectManager);
    renderProjectView(projectIndex, projectManager.getProject(projectIndex));
    hideEditProjectModal();
  });

  const closeEditProjectModal = editProjectModal.querySelector(
    "#close-edit-project-modal"
  );
  closeEditProjectModal.addEventListener("click", hideEditProjectModal);

  // Delete Project modal listeners
  const deleteProjectModal = document.querySelector("#delete-project-modal");

  const closeDeleteProjectModal = deleteProjectModal.querySelector(
    "#close-delete-project-modal"
  );
  closeDeleteProjectModal.addEventListener("click", hideDeleteProjectModal);

  const confirmDeleteProject = deleteProjectModal.querySelector(
    "#confirm-delete-project-button"
  );
  confirmDeleteProject.addEventListener("click", () => {
    const projectIndex = confirmDeleteProject.dataset.projectIndex;
    projectManager.deleteProject(projectIndex);
    Storage.deleteProject(projectIndex);
    renderUserProjects(projectManager);
    renderProjectView(0, projectManager.getProject(0));
    hideDeleteProjectModal();
  });
}

function showNewProjectModal() {
  const newProject = document.querySelector("#new-project-modal");
  newProject.style.display = "block";
}

function hideNewProjectModal() {
  const newProject = document.querySelector("#new-project-modal");
  const projectName = newProject.querySelector("#new-project-name");
  projectName.value = "";
  newProject.style.display = "none";
}

function showEditProjectModal(project, projectManager) {
  const editProject = document.querySelector("#edit-project-modal");

  const editProjectName = editProject.querySelector("#edit-project-name");
  editProjectName.value = project.getDisplayName();

  const confirmButton = editProject.querySelector(
    "#confirm-edit-project-button"
  );
  confirmButton.setAttribute(
    "data-project-index",
    projectManager.getProjectIndex(project)
  );

  editProject.style.display = "block";
}

function hideEditProjectModal() {
  const editProject = document.querySelector("#edit-project-modal");
  editProject.style.display = "none";
}

function showDeleteProjectModal(project, projectManager) {
  const deleteProjectModal = document.querySelector("#delete-project-modal");
  const deleteProjectName = deleteProjectModal.querySelector(
    "#delete-project-name"
  );

  deleteProjectName.textContent = project.getDisplayName();
  deleteProjectModal.style.display = "block";

  const confirmButton = deleteProjectModal.querySelector(
    "#confirm-delete-project-button"
  );
  confirmButton.setAttribute(
    "data-project-index",
    projectManager.getProjectIndex(project)
  );
}

function hideDeleteProjectModal() {
  const deleteProject = document.querySelector("#delete-project-modal");
  deleteProject.style.display = "none";
}

function createTodoModalEventListeners(projectManager) {
  const addTodoModal = document.querySelector("#add-todo-modal");

  const closeTodoModal = addTodoModal.querySelector("#close-todo-modal");
  closeTodoModal.addEventListener("click", hideAddTodoModal);

  const newTodoButton = addTodoModal.querySelector("#confirm-add-todo-button");
  newTodoButton.addEventListener("click", () => {
    const todoTitle = addTodoModal.querySelector("#new-todo-title");
    const todoDescription = addTodoModal.querySelector("#new-todo-description");
    const todoDate = addTodoModal.querySelector("#new-todo-date");
    const todoPriority = addTodoModal.querySelector("#new-todo-priority");

    const newTodo = new Todo(
      todoTitle.value,
      todoDescription.value,
      todoDate.value,
      todoPriority.value
    );

    projectManager
      .getProject(newTodoButton.dataset.projectIndex)
      .addTodo(newTodo);
    Storage.addTodo(newTodoButton.dataset.projectIndex, newTodo);

    renderProjectView(
      newTodoButton.dataset.projectIndex,
      projectManager.getProject(newTodoButton.dataset.projectIndex)
    );
    hideAddTodoModal();
  });

  const editTodoModal = document.querySelector("#edit-todo-modal");

  const closeEditTodoModal = editTodoModal.querySelector(
    "#close-edit-todo-modal"
  );
  closeEditTodoModal.addEventListener("click", hideEditTodoModal);

  const editTodoButton = editTodoModal.querySelector(
    "#confirm-edit-todo-button"
  );
  editTodoButton.addEventListener("click", () => {
    const editTodoTitle = editTodoModal.querySelector("#edit-todo-title");
    const editTodoDescription = editTodoModal.querySelector(
      "#edit-todo-description"
    );
    const editTodoDate = editTodoModal.querySelector("#edit-todo-date");
    const editTodoPriority = editTodoModal.querySelector("#edit-todo-priority");
    const editTodoCompleted = editTodoModal.querySelector(
      "#edit-todo-completed"
    );

    const editedTodo = new Todo(
      editTodoTitle.value,
      editTodoDescription.value,
      editTodoDate.value,
      editTodoPriority.value
    );
    editedTodo.setCompleted(editTodoCompleted.checked);

    projectManager
      .getProject(editTodoButton.dataset.projectIndex)
      .getTodo(editTodoButton.dataset.todoIndex)
      .editTodo(editedTodo);

    Storage.editTodo(
      editTodoButton.dataset.projectIndex,
      editTodoButton.dataset.todoIndex,
      editedTodo
    );

    const viewName = document.querySelector("#view-name");
    if (viewName.textContent === "Today") {
      renderView("Today", projectManager.getAllTodosToday());
    } else if (viewName.textContent === "This Week") {
      renderView("This Week", projectManager.getAllTodosThisWeek());
    } else {
      renderProjectView(
        editTodoButton.dataset.projectIndex,
        projectManager.getProject(editTodoButton.dataset.projectIndex)
      );
    }

    hideEditTodoModal();
  });
}

function showAddTodoModal(projectIndex, project) {
  const addTodoModal = document.querySelector("#add-todo-modal");

  const projectName = addTodoModal.querySelector("#add-todo-project-name");
  projectName.textContent = project.displayName;

  const confirmButton = addTodoModal.querySelector("#confirm-add-todo-button");
  confirmButton.setAttribute("data-project-index", projectIndex);

  addTodoModal.style.display = "block";
}

function hideAddTodoModal() {
  const addTodoModal = document.querySelector("#add-todo-modal");

  const todoTitle = addTodoModal.querySelector("#new-todo-title");
  const todoDescription = addTodoModal.querySelector("#new-todo-description");
  const todoDate = addTodoModal.querySelector("#new-todo-date");
  const todoPriority = addTodoModal.querySelector("#new-todo-priority");
  todoTitle.value = "";
  todoDescription.value = "";
  todoDate.value = "";
  todoPriority.value = "";

  addTodoModal.style.display = "none";
}

function showEditTodoModal(projectIndex, projectName, todoIndex, todo) {
  const editTodoModal = document.querySelector("#edit-todo-modal");

  const editTodoProjectName = editTodoModal.querySelector(
    "#edit-todo-project-name"
  );
  editTodoProjectName.textContent = projectName;

  const editTodoCompleted = editTodoModal.querySelector("#edit-todo-completed");
  editTodoCompleted.checked = todo.getCompleted();

  const editTodoTitle = editTodoModal.querySelector("#edit-todo-title");
  editTodoTitle.value = todo.getTitle();

  const editTodoDescription = editTodoModal.querySelector(
    "#edit-todo-description"
  );
  editTodoDescription.value = todo.getDescription();

  const editTodoDate = editTodoModal.querySelector("#edit-todo-date");
  editTodoDate.value = format(todo.getDueDate(), "yyyy-MM-dd");

  const editTodoPriority = editTodoModal.querySelector("#edit-todo-priority");
  editTodoPriority.value = todo.getPriority();

  const button = editTodoModal.querySelector("#confirm-edit-todo-button");
  button.setAttribute("data-project-index", projectIndex);
  button.setAttribute("data-todo-index", todoIndex);

  editTodoModal.style.display = "block";
}

function hideEditTodoModal() {
  const editTodoModal = document.querySelector("#edit-todo-modal");

  const editTodoTitle = editTodoModal.querySelector("#edit-todo-title");
  editTodoTitle.value = "";

  const editTodoDescription = editTodoModal.querySelector(
    "#edit-todo-description"
  );
  editTodoDescription.value = "";

  const editTodoDate = editTodoModal.querySelector("#edit-todo-date");
  editTodoDate.value = "";

  const editTodoPriority = editTodoModal.querySelector("#edit-todo-priority");
  editTodoPriority.value = "";

  editTodoModal.style.display = "none";
}

function renderProjectView(projectIndex, project) {
  // Prepare project for rendering (turn into an object with project indexes for keys
  // and with the todos as an object with todo indexes for keys.

  let projectForRendering = {};

  projectForRendering["displayName"] = project.getDisplayName();
  projectForRendering["originalProject"] = project;

  project.getTodos().forEach((todo) => {
    projectForRendering[project.getTodoIndex(todo)] = todo;
  });

  renderView("Project View", { [projectIndex]: projectForRendering });
}

function renderView(viewName, projectList) {
  const viewNameElement = document.querySelector("#view-name");
  if (viewName === "Project View") {
    viewNameElement.textContent = "";
  } else {
    viewNameElement.textContent = viewName;
  }

  const todoList = document.querySelector("#todo-list");
  removeChildren(todoList);

  for (let projectIndex in projectList) {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project-element");
    projectElement.setAttribute("data-index", projectIndex);
    todoList.appendChild(projectElement);

    renderProject(projectElement, projectList[projectIndex], projectIndex);

    const addTodoButton = document.createElement("button");
    addTodoButton.classList.add("add-todo-button");
    addTodoButton.textContent = "Add Todo";
    projectElement.appendChild(addTodoButton);

    addTodoButton.addEventListener("click", () => {
      showAddTodoModal(projectIndex, projectList[projectIndex]);
    });
  }
}

function renderProject(projectElement, projectObject, projectIndex) {
  const projectName = document.createElement("h1");
  projectName.textContent = projectObject.displayName;
  projectElement.appendChild(projectName);

  for (let todoIndex in projectObject) {
    if (todoIndex === "displayName" || todoIndex === "originalProject")
      continue;

    const todo = projectObject[todoIndex];

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
    check.addEventListener("click", (e) => {
      todo.setCompleted(check.checked);

      Storage.setCompleted(
        e.target.closest(".project-element").dataset.index,
        project.getTodoIndex(todo),
        check.checked
      );

      e.stopPropagation();
    });
    todoOverview.appendChild(check);

    const title = document.createElement("div");
    title.textContent = todo.getTitle();
    todoOverview.appendChild(title);

    const dueDate = document.createElement("div");
    dueDate.textContent = format(todo.getDueDate(), "d.M.yyyy");
    todoOverview.appendChild(dueDate);

    const editTodo = document.createElement("button");
    editTodo.textContent = "Edit";
    editTodo.addEventListener("click", (event) => {
      showEditTodoModal(
        projectIndex,
        projectObject.displayName,
        todoIndex,
        todo
      );
      event.stopPropagation();
    });
    todoOverview.appendChild(editTodo);

    const deleteTodo = document.createElement("button");
    deleteTodo.textContent = "X";
    deleteTodo.addEventListener("click", (event) => {
      projectObject["originalProject"].deleteTodo(todoIndex);
      Storage.deleteTodo(projectIndex, todoIndex);

      const projectManager = Storage.getProjectManager();

      const viewName = document.querySelector("#view-name");
      if (viewName.textContent === "Today") {
        renderView("Today", projectManager.getAllTodosToday());
      } else if (viewName.textContent === "This Week") {
        renderView("This Week", projectManager.getAllTodosThisWeek());
      } else {
        renderProjectView(
          projectIndex,
          projectManager.getProject(projectIndex)
        );
      }

      event.stopPropagation();
    });
    todoOverview.appendChild(deleteTodo);

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

    projectElement.appendChild(todoElement);
  }
}

function removeChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
