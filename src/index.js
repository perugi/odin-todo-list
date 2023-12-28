import "./reset.css";
import "./styles.css";

import ProjectManager from "./project_manager";
import Project from "./project";
import Todo from "./todo";
import priority from "./priority";
import Storage from "./local_storage";

import { renderWebsite } from "./render";

let projectManager = new ProjectManager();

projectManager
  .getProject(0)
  .addTodo(
    new Todo("Inbox Todo", "Description of Todo", new Date(), priority.LOW)
  );

projectManager.addProject(new Project("Test Project"));
projectManager
  .getProject(1)
  .addTodo(
    new Todo("Test Todo 1", "Description of Todo 1", new Date(), priority.LOW)
  );
projectManager
  .getProject(1)
  .addTodo(
    new Todo(
      "Test Todo 2",
      "Description of Todo 2",
      new Date(2023, 11, 13),
      priority.MEDIUM
    )
  );
projectManager
  .getProject(1)
  .addTodo(
    new Todo(
      "Test Todo 3",
      "Description of Todo 3",
      new Date(2023, 11, 20),
      priority.HIGH
    )
  );

renderWebsite(projectManager);
Storage.saveProjectManager(projectManager);
console.log(projectManager);
console.log(Storage.getProjectManager());
