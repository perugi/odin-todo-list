import "./reset.css";
import "./styles.css";

import GhLogo from "./img/githublogo.png";

import Todo from "./todo";
import Project from "./project";
import ProjectManager from "./project_manager";
import priority from "./priority";

import { renderUserProjects, renderTodoList, renderNewProject } from "./render";

let projectManager = new ProjectManager();

projectManager.addProject(new Project("test"));
projectManager.addProject(new Project("test2"));

projectManager
  .getProject(1)
  .addTodo(new Todo("test", "this is a test", new Date(), priority.LOW));
projectManager
  .getProject(1)
  .addTodo(new Todo("test2", "this is a test", new Date(), priority.MEDIUM));
projectManager
  .getProject(1)
  .addTodo(new Todo("test3", "this is a test", new Date(), priority.HIGH));

let completedTodo = new Todo(
  "completed",
  "this is a test",
  new Date(),
  priority.HIGH
);
completedTodo.completed = true;
projectManager.getProject(2).addTodo(completedTodo);

console.log(projectManager.getProject(1));
console.log(projectManager.getProject(1).todos);

renderUserProjects(projectManager);
renderNewProject(projectManager);
renderTodoList(
  projectManager.getProject(1).todos,
  projectManager.getProject(1)
);

const ghLogo = document.querySelector("#gh-logo");
ghLogo.src = GhLogo;
