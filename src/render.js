import { format } from "date-fns";
import priority from "./priority";

export function renderProjects(projectList) {
  const userProjects = document.querySelector("#user-projects>ul");

  projectList.forEach((project) => {
    const newProject = document.createElement("li");
    newProject.textContent = project.displayName;
    userProjects.appendChild(newProject);
  });

  const newProject = document.querySelector("#new-project");

  const name = document.createElement("input");
  name.id = "new-project-name";
  name.type = "text";
  name.placeholder = "Project Name";

  const button = document.createElement("button");
  button.id = "new-project-button";
  button.textContent = "New Project";

  newProject.appendChild(name);
  newProject.appendChild(button);
}

export function renderTodoList(todos) {
  const todoList = document.querySelector("#todo-list");

  todos.forEach((todo) => {
    const newTodo = document.createElement("div");
    newTodo.textContent = `${todo.title} ${todo.description} ${format(
      todo.dueDate,
      "d.M.yyyy"
    )} ${todo.priority} ${todo.completed}`;
    todoList.appendChild(newTodo);
  });
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
