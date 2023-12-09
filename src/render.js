import { format } from "date-fns";
import priority from "./priority";

export function renderProjects(projectList) {
  const userProjects = document.querySelector("#user-projects>ul");

  projectList.forEach((project) => {
    const newProject = document.createElement("li");
    newProject.textContent = project.displayName;
    userProjects.appendChild(newProject);
  });
}

export function renderTodos(project) {
  const todoList = document.querySelector("#todo-list");

  project.todos.forEach((todo) => {
    const newTodo = document.createElement("div");
    newTodo.textContent = `${todo.title} ${todo.description} ${format(
      todo.dueDate,
      "d.M.yyyy"
    )} ${todo.priority} ${todo.completed}`;
    todoList.appendChild(newTodo);
  });
}

export function renderPriorityList() {
  const priorityList = document.querySelector("#new-todo-priority");

  Object.values(priority).forEach((priority) => {
    const newPriority = document.createElement("option");
    newPriority.textContent = priority;
    newPriority.value = priority;
    priorityList.appendChild(newPriority);
  });
}
