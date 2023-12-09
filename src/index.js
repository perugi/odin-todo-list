import "./reset.css";
import "./styles.css";

import GhLogo from "./img/githublogo.png";

import Todo from "./todo";
import Project from "./project";
import ProjectManager from "./project_manager";
import priority from "./priority";

import { renderPriorityList, renderProjects, renderTodos } from "./render";

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

console.log(projectManager.getProject(1));
console.log(projectManager.getProject(1).todos);

renderProjects(projectManager.getUserProjects());
renderTodos(projectManager.getProject(1));
renderPriorityList();

const ghLogo = document.querySelector("#gh-logo");
ghLogo.src = GhLogo;
