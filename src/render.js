import { format } from "date-fns";
import priority from "./priority";
import Project from "./project";

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
      renderTodoList(project.todos);
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

export function renderNewProject(projectManager) {
  const newProject = document.querySelector("#new-project");

  const name = document.createElement("input");
  name.id = "new-project-name";
  name.type = "text";
  name.placeholder = "Project Name";

  const button = document.createElement("button");
  button.id = "new-project-button";
  button.textContent = "New Project";
  button.addEventListener("click", () => {
    projectManager.addProject(new Project(name.value));
    renderUserProjects(projectManager);
  });

  newProject.appendChild(name);
  newProject.appendChild(button);
}

export function renderTodoList(todos) {
  const todoList = document.querySelector("#todo-list");

  removeChildren(todoList);

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
}

function removeChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export function renderNewTodoForm() {
  const todoList = document.querySelector("#new-todo");

  const title = document.createElement("input");
  title.id = "new-todo-title";
  title.type = "text";
  title.placeholder = "Title";

  const description = document.createElement("textarea");
  description.id = "new-todo-description";
  description.placeholder = "Description";

  const dueDate = document.createElement("input");
  dueDate.id = "new-todo-date";
  dueDate.type = "date";

  const prioritySelector = document.createElement("select");
  prioritySelector.id = "new-todo-priority";
  Object.values(priority).forEach((option) => {
    const priorityOption = document.createElement("option");
    priorityOption.textContent = option;
    priorityOption.value = option;
    prioritySelector.appendChild(priorityOption);
  });

  const button = document.createElement("button");
  button.id = "new-todo-button";
  button.textContent = "Add Todo";

  todoList.appendChild(title);
  todoList.appendChild(description);
  todoList.appendChild(dueDate);
  todoList.appendChild(prioritySelector);
  todoList.appendChild(button);
}
