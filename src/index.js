import "./reset.css";
import "./styles.css";

import ProjectManager from "./project_manager";
import Storage from "./local_storage";

import RenderWebsite from "./render";

let projectManager;
if (Storage.getProjectManager()) {
  projectManager = Storage.getProjectManager();
} else {
  projectManager = new ProjectManager();
}

let renderWebsite = new RenderWebsite(projectManager);
renderWebsite.render();
