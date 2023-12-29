import "./reset.css";
import "./styles.css";

import ProjectManager from "./project_manager";
import Project from "./project";
import Todo from "./todo";
import priority from "./priority";
import Storage from "./local_storage";

import { renderWebsite } from "./render";

let projectManager;
if (Storage.getProjectManager()) {
  projectManager = Storage.getProjectManager();
} else {
  projectManager = new ProjectManager();
}

renderWebsite(projectManager);
