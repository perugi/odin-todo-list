import { format } from "date-fns";
import Project from "./project";
import Todo from "./todo";
import Storage from "./local_storage";

import NoteLogo from "./img/list.svg";
import GhLogo from "./img/githublogo.png";

export default class RenderWebsite {
  projectManager;

  constructor(projectManager) {
    this.projectManager = projectManager;
  }

  render() {
    this.#renderUserProjects();
    this.#showInbox();
    this.#createStaticEventListeners();
    this.#createProjectModalEventListeners();
    this.#createTodoModalEventListeners();
    this.#renderImages();
  }

  #showInbox() {
    this.#renderProjectView(this.projectManager.getProject(0));
  }

  #renderImages() {
    const noteLogo = document.querySelector("#logo");
    noteLogo.src = NoteLogo;

    const ghLogo = document.querySelector("#gh-logo");
    ghLogo.src = GhLogo;
  }

  #createStaticEventListeners() {
    const staticSelection = document.querySelector("#static-selection");

    const inbox = staticSelection.querySelector("#inbox");
    inbox.addEventListener("click", () => {
      this.#showInbox();
      this.#addSelectedClass(inbox);
    });

    const today = staticSelection.querySelector("#today");
    today.addEventListener("click", () => {
      this.#renderView("Today", this.projectManager.getAllTodosToday());
      this.#addSelectedClass(today);
    });

    const thisWeek = staticSelection.querySelector("#this-week");
    thisWeek.addEventListener("click", () => {
      this.#renderView("This Week", this.projectManager.getAllTodosThisWeek());
      this.#addSelectedClass(thisWeek);
    });
  }

  #renderUserProjects() {
    const userProjects = document.querySelector("#user-projects");
    this.#removeChildren(userProjects);

    this.projectManager.getUserProjects().forEach((project) => {
      const projectElement = document.createElement("div");
      projectElement.classList.add("project-list-element");

      const projectName = document.createElement("div");
      projectName.textContent = project.getDisplayName();
      projectName.classList.add("project-name");
      projectName.addEventListener("click", () => {
        this.#renderProjectView(project);
        this.#addSelectedClass(projectElement);
      });

      const editProject = document.createElement("div");
      editProject.classList.add("edit-project-button");
      editProject.addEventListener("click", () =>
        this.#showEditProjectModal(project)
      );

      const deleteProject = document.createElement("div");
      deleteProject.classList.add("delete-project-button");
      deleteProject.addEventListener("click", () => {
        this.#showDeleteProjectModal(project);
      });

      projectElement.appendChild(projectName);
      projectElement.appendChild(editProject);
      projectElement.appendChild(deleteProject);
      userProjects.appendChild(projectElement);
    });
  }

  #addSelectedClass(element) {
    const selectElements = [
      ...document.querySelectorAll("#static-selection>div"),
      ...document.querySelectorAll(".project-list-element"),
    ];
    selectElements.forEach((element) => {
      element.classList.remove("selected");
    });

    element.classList.add("selected");
  }

  #createProjectModalEventListeners() {
    // New Project button listener
    const newProject = document.querySelector("#new-project-button");
    newProject.addEventListener("click", this.#showNewProjectModal);

    // New Project modal listeners
    const newProjectModal = document.querySelector("#new-project-modal");

    const confirmNewProject = newProjectModal.querySelector(
      "#confirm-new-project-button"
    );
    confirmNewProject.addEventListener(
      "click",
      this.#newProjectEventHandler.bind(this)
    );

    const closeNewProjectModal = newProjectModal.querySelector(
      "#close-project-modal"
    );
    const newProjectModalContent =
      newProjectModal.querySelector(".modal-content");
    closeNewProjectModal.addEventListener("click", this.#hideNewProjectModal);
    newProjectModalContent.addEventListener("mousedown", (event) => {
      event.stopPropagation();
    });
    newProjectModal.addEventListener("mousedown", this.#hideNewProjectModal);

    const newProjectName = newProjectModal.querySelector("#new-project-name");
    newProjectName.addEventListener("input", () => {
      if (newProjectName.value === "") {
        confirmNewProject.disabled = true;
      } else {
        confirmNewProject.disabled = false;
      }
    });

    // Edit Project modal listeners
    const editProjectModal = document.querySelector("#edit-project-modal");
    const closeEditProjectModal = editProjectModal.querySelector(
      "#close-edit-project-modal"
    );
    const editProjectModalContent =
      editProjectModal.querySelector(".modal-content");
    closeEditProjectModal.addEventListener("click", this.#hideEditProjectModal);
    editProjectModalContent.addEventListener("mousedown", (event) => {
      event.stopPropagation();
    });
    editProjectModal.addEventListener("mousedown", this.#hideEditProjectModal);

    const editProjectName =
      editProjectModal.querySelector("#edit-project-name");
    editProjectName.addEventListener("input", () => {
      const confirmEditProject = editProjectModal.querySelector(
        "#confirm-edit-project-button"
      );

      if (editProjectName.value === "") {
        confirmEditProject.disabled = true;
      } else {
        confirmEditProject.disabled = false;
      }
    });

    // Delete Project modal listeners
    const deleteProjectModal = document.querySelector("#delete-project-modal");
    const closeDeleteProjectModal = deleteProjectModal.querySelector(
      "#close-delete-project-modal"
    );
    const deleteProjectModalContent =
      deleteProjectModal.querySelector(".modal-content");
    closeDeleteProjectModal.addEventListener(
      "click",
      this.#hideDeleteProjectModal
    );
    deleteProjectModalContent.addEventListener("mousedown", (event) => {
      event.stopPropagation();
    });
    deleteProjectModal.addEventListener(
      "mousedown",
      this.#hideDeleteProjectModal
    );
  }

  #showNewProjectModal() {
    const newProject = document.querySelector("#new-project-modal");
    newProject.style.display = "flex";

    const projectName = newProject.querySelector("#new-project-name");
    projectName.value = "";

    const newProjectConfirm = newProject.querySelector(
      "#confirm-new-project-button"
    );
    newProjectConfirm.disabled = true;
  }

  #newProjectEventHandler() {
    const projectName = document.querySelector("#new-project-name");
    const newProject = new Project(projectName.value);
    this.projectManager.addProject(newProject);
    Storage.addProject(newProject);
    this.#renderUserProjects(this.projectManager);
    this.#hideNewProjectModal();
  }

  #hideNewProjectModal() {
    const newProject = document.querySelector("#new-project-modal");
    newProject.style.display = "none";
  }

  #showEditProjectModal(project) {
    const editProject = document.querySelector("#edit-project-modal");

    const editProjectName = editProject.querySelector("#edit-project-name");
    editProjectName.value = project.getDisplayName();

    const confirmButton = editProject.querySelector(
      "#confirm-edit-project-button"
    );
    const newConfirmButton = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);

    newConfirmButton.addEventListener("click", () => {
      this.#editProjectEventHandler(project);
    });

    editProject.style.display = "flex";
  }

  #editProjectEventHandler(project) {
    const editProjectName = document.querySelector("#edit-project-name");

    Storage.editProject(
      this.projectManager.getProjectIndex(project),
      editProjectName.value
    );
    project.setDisplayName(editProjectName.value);

    this.#renderUserProjects();
    this.#renderProjectView(project);
    this.#hideEditProjectModal();
  }

  #hideEditProjectModal() {
    const editProject = document.querySelector("#edit-project-modal");
    editProject.style.display = "none";
  }

  #showDeleteProjectModal(project) {
    const deleteProjectModal = document.querySelector("#delete-project-modal");
    const deleteProjectName = deleteProjectModal.querySelector(
      "#delete-project-name"
    );

    deleteProjectName.textContent = project.getDisplayName();
    deleteProjectModal.style.display = "flex";

    const confirmButton = deleteProjectModal.querySelector(
      "#confirm-delete-project-button"
    );
    const newConfirmButton = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);

    newConfirmButton.addEventListener("click", () => {
      this.#deleteProjectEventHandler(project);
    });
  }

  #deleteProjectEventHandler(project) {
    Storage.deleteProject(this.projectManager.getProjectIndex(project));
    this.projectManager.deleteProject(project);

    this.#renderUserProjects();
    this.#showInbox();

    this.#hideDeleteProjectModal();
  }

  #hideDeleteProjectModal() {
    const deleteProject = document.querySelector("#delete-project-modal");
    deleteProject.style.display = "none";
  }

  #renderProjectView(project) {
    // Prepare project for rendering (turn into a Map with project as a key and with
    // the array of todos as the value.This mirrors the structure that is returned
    // from the ProjectManager getAllTodosToday and getAllTodosThisWeek methods),
    // which allows to use the same render function for all the views.

    let projectForRendering = new Map();

    projectForRendering.set(project, new Array());

    project.getTodos().forEach((todo) => {
      projectForRendering.get(project).push(todo);
    });

    this.#renderView("", projectForRendering);
  }

  #renderView(viewName, projectMap) {
    const viewNameElement = document.querySelector("#view-name");
    if (viewName === "") {
      viewNameElement.style.display = "none";
    } else {
      viewNameElement.textContent = viewName;
      viewNameElement.style.display = "block";
    }

    const todoList = document.querySelector("#todo-list");
    this.#removeChildren(todoList);

    projectMap.forEach((todos, project) => {
      const projectElement = document.createElement("div");
      projectElement.classList.add("project-element");
      todoList.appendChild(projectElement);

      this.#renderProject(projectElement, project, todos);

      const projectDivider = document.createElement("div");
      projectDivider.classList.add("project-divider");
      projectElement.appendChild(projectDivider);

      const addTodoButton = document.createElement("div");
      addTodoButton.textContent = "Add task";
      addTodoButton.classList.add("add-todo-button");
      projectElement.appendChild(addTodoButton);

      addTodoButton.addEventListener("click", () => {
        this.#showAddTodoModal(project);
      });
    });
  }

  #renderProject(projectElement, project, todos) {
    const projectName = document.createElement("h1");
    projectName.textContent = project.displayName;
    projectName.classList.add("todo-panel-project-name");
    projectElement.appendChild(projectName);

    todos.forEach((todo) => {
      const todoElement = document.createElement("div");
      todoElement.classList.add("todo-element");
      if (todo.getCompleted()) {
        todoElement.classList.add("completed");
      }

      const todoOverview = document.createElement("div");
      todoOverview.classList.add(
        "todo-overview",
        `priority-${todo.getPriority()}`
      );
      todoOverview.setAttribute("data-expanded", "false");

      const firstRow = document.createElement("div");
      firstRow.classList.add("todo-overview-first-row");

      const check = document.createElement("input");
      check.checked = todo.getCompleted();
      check.type = "checkbox";
      check.addEventListener("click", (event) => {
        this.#toggleCompletedEventHandler(
          project,
          todo,
          event.target.checked,
          todoElement
        );
        event.stopPropagation();
      });
      firstRow.appendChild(check);

      const title = document.createElement("div");
      title.textContent = todo.getTitle();
      title.classList.add("todo-title");
      firstRow.appendChild(title);

      const editTodo = document.createElement("div");
      editTodo.classList.add("edit-todo-button");
      editTodo.addEventListener("click", (event) => {
        this.#showEditTodoModal(project, todo);
        event.stopPropagation();
      });
      firstRow.appendChild(editTodo);

      const deleteTodo = document.createElement("div");
      deleteTodo.classList.add("delete-todo-button");
      deleteTodo.addEventListener("click", (event) => {
        this.#deleteTodoEventHandler(project, todo);
        event.stopPropagation();
      });
      firstRow.appendChild(deleteTodo);

      const secondRow = document.createElement("div");
      secondRow.classList.add("todo-overview-second-row");

      const dueDate = document.createElement("div");
      dueDate.textContent = format(todo.getDueDate(), "iii, d MMM yyyy");
      dueDate.classList.add("todo-due-date");
      secondRow.appendChild(dueDate);

      todoElement.addEventListener("click", () => {
        todoOverview.setAttribute(
          "data-expanded",
          todoOverview.getAttribute("data-expanded") === "true"
            ? "false"
            : "true"
        );
      });

      todoOverview.appendChild(firstRow);
      todoOverview.appendChild(secondRow);
      todoElement.appendChild(todoOverview);

      const todoDetails = document.createElement("div");
      todoDetails.textContent = todo.getDescription();
      todoDetails.classList.add("todo-details");

      todoElement.appendChild(todoDetails);

      projectElement.appendChild(todoElement);
    });
  }

  #toggleCompletedEventHandler(project, todo, isChecked, todoElement) {
    todo.setCompleted(isChecked);

    Storage.setCompleted(
      this.projectManager.getProjectIndex(project),
      project.getTodoIndex(todo),
      isChecked
    );

    todoElement.classList.toggle("completed");
  }

  #deleteTodoEventHandler(project, todo) {
    Storage.deleteTodo(
      this.projectManager.getProjectIndex(project),
      project.getTodoIndex(todo)
    );
    project.deleteTodo(todo);

    const viewName = document.querySelector("#view-name");
    if (viewName.textContent === "Today") {
      this.#renderView("Today", this.projectManager.getAllTodosToday());
    } else if (viewName.textContent === "This Week") {
      this.#renderView("This Week", this.projectManager.getAllTodosThisWeek());
    } else {
      this.#renderProjectView(project);
    }
  }

  #createTodoModalEventListeners() {
    const addTodoModal = document.querySelector("#add-todo-modal");
    const closeTodoModal = addTodoModal.querySelector("#close-todo-modal");
    const addTodoModalContent = addTodoModal.querySelector(".modal-content");
    closeTodoModal.addEventListener("click", this.#hideAddTodoModal);
    addTodoModalContent.addEventListener("mousedown", (event) => {
      event.stopPropagation();
    });
    addTodoModal.addEventListener("mousedown", this.#hideAddTodoModal);

    const newTodoTitle = addTodoModal.querySelector("#new-todo-title");
    newTodoTitle.addEventListener("input", () => {
      const confirmAddTodo = addTodoModal.querySelector(
        "#confirm-add-todo-button"
      );

      if (newTodoTitle.value === "") {
        confirmAddTodo.disabled = true;
      } else {
        confirmAddTodo.disabled = false;
      }
    });

    const editTodoModal = document.querySelector("#edit-todo-modal");
    const closeEditTodoModal = document.querySelector("#close-edit-todo-modal");
    const editTodoModalContent = editTodoModal.querySelector(".modal-content");
    closeEditTodoModal.addEventListener("click", this.#hideEditTodoModal);
    editTodoModalContent.addEventListener("mousedown", (event) => {
      event.stopPropagation();
    });
    editTodoModal.addEventListener("mousedown", this.#hideEditTodoModal);

    const editTodoTitle = editTodoModal.querySelector("#edit-todo-title");
    editTodoTitle.addEventListener("input", () => {
      const confirmEditTodo = editTodoModal.querySelector(
        "#confirm-edit-todo-button"
      );

      if (editTodoTitle.value === "") {
        confirmEditTodo.disabled = true;
      } else {
        confirmEditTodo.disabled = false;
      }
    });
  }

  #showAddTodoModal(project) {
    const addTodoModal = document.querySelector("#add-todo-modal");
    const projectName = addTodoModal.querySelector("#add-todo-project-name");
    const dueDate = addTodoModal.querySelector("#new-todo-date");
    const todoPriority = addTodoModal.querySelector("#new-todo-priority");

    projectName.textContent = project.getDisplayName();
    dueDate.value = format(new Date(), "yyyy-MM-dd");
    todoPriority.value = "LOW";

    const confirmButton = addTodoModal.querySelector(
      "#confirm-add-todo-button"
    );
    const newConfirmButton = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);

    newConfirmButton.addEventListener("click", () => {
      this.#addTodoEventHandler(project);
    });
    newConfirmButton.disabled = true;

    addTodoModal.style.display = "flex";
  }

  #addTodoEventHandler(project) {
    const addTodoModal = document.querySelector("#add-todo-modal");
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

    project.addTodo(newTodo);
    Storage.addTodo(this.projectManager.getProjectIndex(project), newTodo);

    this.#renderProjectView(project);

    this.#hideAddTodoModal();
  }

  #hideAddTodoModal() {
    const addTodoModal = document.querySelector("#add-todo-modal");
    const todoTitle = addTodoModal.querySelector("#new-todo-title");
    const todoDescription = addTodoModal.querySelector("#new-todo-description");

    todoTitle.value = "";
    todoDescription.value = "";

    addTodoModal.style.display = "none";
  }

  #showEditTodoModal(project, todo) {
    const editTodoModal = document.querySelector("#edit-todo-modal");
    const editTodoProjectName = editTodoModal.querySelector(
      "#edit-todo-project-name"
    );
    const editTodoCompleted = editTodoModal.querySelector(
      "#edit-todo-completed"
    );
    const editTodoTitle = editTodoModal.querySelector("#edit-todo-title");
    const editTodoDescription = editTodoModal.querySelector(
      "#edit-todo-description"
    );
    const editTodoDate = editTodoModal.querySelector("#edit-todo-date");
    const editTodoPriority = editTodoModal.querySelector("#edit-todo-priority");

    editTodoProjectName.textContent = project.getDisplayName();
    editTodoCompleted.checked = todo.getCompleted();
    editTodoTitle.value = todo.getTitle();
    editTodoDescription.value = todo.getDescription();
    editTodoDate.value = format(todo.getDueDate(), "yyyy-MM-dd");
    editTodoPriority.value = todo.getPriority();

    const confirmButton = editTodoModal.querySelector(
      "#confirm-edit-todo-button"
    );
    const newConfirmButton = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);

    newConfirmButton.addEventListener("click", () => {
      this.#editTodoEventHandler(project, todo);
    });

    editTodoModal.style.display = "flex";
  }

  #editTodoEventHandler(project, todo) {
    const editTodoModal = document.querySelector("#edit-todo-modal");
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

    todo.editTodo(editedTodo);

    Storage.editTodo(
      this.projectManager.getProjectIndex(project),
      project.getTodoIndex(todo),
      editedTodo
    );

    const viewName = document.querySelector("#view-name");
    if (viewName.textContent === "Today") {
      this.#renderView("Today", this.projectManager.getAllTodosToday());
    } else if (viewName.textContent === "This Week") {
      this.#renderView("This Week", this.projectManager.getAllTodosThisWeek());
    } else {
      this.#renderProjectView(project);
    }

    this.#hideEditTodoModal();
  }

  #hideEditTodoModal() {
    const editTodoModal = document.querySelector("#edit-todo-modal");
    const editTodoTitle = editTodoModal.querySelector("#edit-todo-title");
    const editTodoDescription = editTodoModal.querySelector(
      "#edit-todo-description"
    );
    const editTodoDate = editTodoModal.querySelector("#edit-todo-date");
    const editTodoPriority = editTodoModal.querySelector("#edit-todo-priority");

    editTodoTitle.value = "";
    editTodoDescription.value = "";
    editTodoDate.value = "";
    editTodoPriority.value = "";

    editTodoModal.style.display = "none";
  }

  #removeChildren(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
}
