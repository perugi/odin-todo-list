import "./reset.css";
import "./styles.css";

import GhLogo from "./img/githublogo.png";

import ProjectManager from "./project_manager";

import {
  renderUserProjects,
  renderTodoList,
  createStaticEventListeners,
} from "./render";

let projectManager = new ProjectManager();

createStaticEventListeners(projectManager);
renderUserProjects(projectManager);
renderTodoList(
  projectManager.getProject(0).todos,
  projectManager.getProject(0)
);

const ghLogo = document.querySelector("#gh-logo");
ghLogo.src = GhLogo;
