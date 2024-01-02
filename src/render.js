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
    this.#renderProjectView(this.projectManager.getProject(0));
    this.#createStaticEventListeners();
    this.#createProjectModalEventListeners();
    this.#createTodoModalEventListeners();
    this.#renderImages();
  }

  #renderImages() {
    const noteLogo = document.querySelector("#logo");
    noteLogo.src = NoteLogo;

    const ghLogo = document.querySelector("#gh-logo");
    ghLogo.src = GhLogo;
  }

  #createStaticEventListeners() {
    const inbox = document.querySelector("#inbox");
    inbox.addEventListener("click", () => {
      this.#renderProjectView(this.projectManager.getProject(0));
      this.#addSelectedClass(inbox);
    });

    const today = document.querySelector("#today");
    today.addEventListener("click", () => {
      this.#renderView("Today", this.projectManager.getAllTodosToday());
      this.#addSelectedClass(today);
    });

    const thisWeek = document.querySelector("#this-week");
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

  #createProjectModalEventListeners() {
    // New Project button listener
    const newProject = document.querySelector("#new-project-button");
    newProject.addEventListener("click", this.#showNewProjectModal);

    // New Project modal listeners
    const newProjectModal = document.querySelector("#new-project-modal");

    const confirmNewProject = newProjectModal.querySelector(
      "#confirm-new-project-button"
    );
    confirmNewProject.addEventListener("click", () => {
      const projectName = newProjectModal.querySelector("#new-project-name");
      const newProject = new Project(projectName.value);
      this.projectManager.addProject(newProject);
      Storage.addProject(newProject);
      this.#renderUserProjects(this.projectManager);
      this.#hideNewProjectModal();
    });

    const closeNewProjectModal = newProjectModal.querySelector(
      "#close-project-modal"
    );
    closeNewProjectModal.addEventListener("click", this.#hideNewProjectModal);

    // Edit Project modal listeners
    const editProjectModal = document.querySelector("#edit-project-modal");

    const confirmEditProject = editProjectModal.querySelector(
      "#confirm-edit-project-button"
    );
    confirmEditProject.addEventListener("click", () => {
      const editProjectName =
        editProjectModal.querySelector("#edit-project-name");
      const projectIndex = confirmEditProject.dataset.projectIndex;

      this.projectManager
        .getProject(projectIndex)
        .setDisplayName(editProjectName.value);
      Storage.editProject(projectIndex, editProjectName.value);

      this.#renderUserProjects();
      this.#renderProjectView(this.projectManager.getProject(projectIndex));
      this.#hideEditProjectModal();
    });

    const closeEditProjectModal = editProjectModal.querySelector(
      "#close-edit-project-modal"
    );
    closeEditProjectModal.addEventListener("click", this.#hideEditProjectModal);

    // Delete Project modal listeners
    const deleteProjectModal = document.querySelector("#delete-project-modal");

    const closeDeleteProjectModal = deleteProjectModal.querySelector(
      "#close-delete-project-modal"
    );
    closeDeleteProjectModal.addEventListener(
      "click",
      this.#hideDeleteProjectModal
    );

    const confirmDeleteProject = deleteProjectModal.querySelector(
      "#confirm-delete-project-button"
    );
    confirmDeleteProject.addEventListener("click", () => {
      const projectIndex = confirmDeleteProject.dataset.projectIndex;
      this.projectManager.deleteProject(projectIndex);
      Storage.deleteProject(projectIndex);
      this.#renderUserProjects();
      this.#renderProjectView(this.projectManager.getProject(0));
      this.#hideDeleteProjectModal();
    });
  }

  #showNewProjectModal() {
    const newProject = document.querySelector("#new-project-modal");
    newProject.style.display = "block";
  }

  #hideNewProjectModal() {
    const newProject = document.querySelector("#new-project-modal");
    const projectName = newProject.querySelector("#new-project-name");
    projectName.value = "";
    newProject.style.display = "none";
  }

  #showEditProjectModal(project) {
    const editProject = document.querySelector("#edit-project-modal");

    const editProjectName = editProject.querySelector("#edit-project-name");
    editProjectName.value = project.getDisplayName();

    const confirmButton = editProject.querySelector(
      "#confirm-edit-project-button"
    );
    confirmButton.setAttribute(
      "data-project-index",
      this.projectManager.getProjectIndex(project)
    );

    editProject.style.display = "block";
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
    deleteProjectModal.style.display = "block";

    const confirmButton = deleteProjectModal.querySelector(
      "#confirm-delete-project-button"
    );
    confirmButton.setAttribute(
      "data-project-index",
      this.projectManager.getProjectIndex(project)
    );
  }

  #hideDeleteProjectModal() {
    const deleteProject = document.querySelector("#delete-project-modal");
    deleteProject.style.display = "none";
  }

  #createTodoModalEventListeners() {
    const addTodoModal = document.querySelector("#add-todo-modal");

    const closeTodoModal = addTodoModal.querySelector("#close-todo-modal");
    closeTodoModal.addEventListener("click", this.#hideAddTodoModal);

    const newTodoButton = addTodoModal.querySelector(
      "#confirm-add-todo-button"
    );
    newTodoButton.addEventListener("click", () => {
      const todoTitle = addTodoModal.querySelector("#new-todo-title");
      const todoDescription = addTodoModal.querySelector(
        "#new-todo-description"
      );
      const todoDate = addTodoModal.querySelector("#new-todo-date");
      const todoPriority = addTodoModal.querySelector("#new-todo-priority");

      const newTodo = new Todo(
        todoTitle.value,
        todoDescription.value,
        todoDate.value,
        todoPriority.value
      );

      this.projectManager
        .getProject(newTodoButton.dataset.projectIndex)
        .addTodo(newTodo);
      Storage.addTodo(newTodoButton.dataset.projectIndex, newTodo);

      this.#renderProjectView(
        this.projectManager.getProject(newTodoButton.dataset.projectIndex)
      );
      this.#hideAddTodoModal();
    });

    const editTodoModal = document.querySelector("#edit-todo-modal");

    const closeEditTodoModal = editTodoModal.querySelector(
      "#close-edit-todo-modal"
    );
    closeEditTodoModal.addEventListener("click", this.#hideEditTodoModal);

    const editTodoButton = editTodoModal.querySelector(
      "#confirm-edit-todo-button"
    );
    editTodoButton.addEventListener("click", () => {
      const editTodoTitle = editTodoModal.querySelector("#edit-todo-title");
      const editTodoDescription = editTodoModal.querySelector(
        "#edit-todo-description"
      );
      const editTodoDate = editTodoModal.querySelector("#edit-todo-date");
      const editTodoPriority = editTodoModal.querySelector(
        "#edit-todo-priority"
      );
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

      this.projectManager
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
        this.#renderView("Today", this.projectManager.getAllTodosToday());
      } else if (viewName.textContent === "This Week") {
        this.#renderView(
          "This Week",
          this.projectManager.getAllTodosThisWeek()
        );
      } else {
        this.#renderProjectView(
          this.projectManager.getProject(editTodoButton.dataset.projectIndex)
        );
      }

      this.#hideEditTodoModal();
    });
  }

  #showAddTodoModal(projectIndex, project) {
    const addTodoModal = document.querySelector("#add-todo-modal");

    const projectName = addTodoModal.querySelector("#add-todo-project-name");
    projectName.textContent = project.displayName;

    const confirmButton = addTodoModal.querySelector(
      "#confirm-add-todo-button"
    );
    confirmButton.setAttribute("data-project-index", projectIndex);

    addTodoModal.style.display = "block";
  }

  #hideAddTodoModal() {
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

  #showEditTodoModal(projectIndex, projectName, todoIndex, todo) {
    const editTodoModal = document.querySelector("#edit-todo-modal");

    const editTodoProjectName = editTodoModal.querySelector(
      "#edit-todo-project-name"
    );
    editTodoProjectName.textContent = projectName;

    const editTodoCompleted = editTodoModal.querySelector(
      "#edit-todo-completed"
    );
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

  #hideEditTodoModal() {
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

  #renderProjectView(project) {
    // Prepare project for rendering (turn into an object with project indexes for keys
    // and with the todos as an object with todo indexes for keys.

    let projectForRendering = {};

    projectForRendering["originalProject"] = project;

    project.getTodos().forEach((todo) => {
      projectForRendering[project.getTodoIndex(todo)] = todo;
    });

    this.#renderView("Project View", {
      [this.projectManager.getProjectIndex(project)]: projectForRendering,
    });
  }

  #renderView(viewName, projectList) {
    const viewNameElement = document.querySelector("#view-name");
    if (viewName === "Project View") {
      viewNameElement.textContent = "";
    } else {
      viewNameElement.textContent = viewName;
    }

    const todoList = document.querySelector("#todo-list");
    this.#removeChildren(todoList);

    for (let projectIndex in projectList) {
      const projectElement = document.createElement("div");
      projectElement.classList.add("project-element");
      projectElement.setAttribute("data-index", projectIndex);
      todoList.appendChild(projectElement);

      this.#renderProject(
        projectElement,
        projectList[projectIndex],
        projectIndex
      );

      const addTodoButton = document.createElement("button");
      addTodoButton.classList.add("add-todo-button");
      addTodoButton.textContent = "Add Todo";
      projectElement.appendChild(addTodoButton);

      addTodoButton.addEventListener("click", () => {
        this.#showAddTodoModal(projectIndex, projectList[projectIndex]);
      });
    }
  }

  #renderProject(projectElement, projectObject, projectIndex) {
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
        this.#showEditTodoModal(
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

        const viewName = document.querySelector("#view-name");
        if (viewName.textContent === "Today") {
          this.#renderView("Today", this.projectManager.getAllTodosToday());
        } else if (viewName.textContent === "This Week") {
          this.#renderView(
            "This Week",
            this.projectManager.getAllTodosThisWeek()
          );
        } else {
          this.#renderProjectView(this.projectManager.getProject(projectIndex));
        }

        event.stopPropagation();
      });
      todoOverview.appendChild(deleteTodo);

      todoElement.addEventListener("click", () => {
        todoOverview.setAttribute(
          "data-expanded",
          todoOverview.getAttribute("data-expanded") === "true"
            ? "false"
            : "true"
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

  #removeChildren(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
}
