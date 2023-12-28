import ProjectManager from "./project_manager";
import Project from "./project";
import Todo from "./todo";

export default class Storage {
  static saveProjectManager(projectManager) {
    localStorage.setItem("projectManager", JSON.stringify(projectManager));
  }

  static getProjectManager() {
    const projectManager = Object.assign(
      new ProjectManager(),
      JSON.parse(localStorage.getItem("projectManager"))
    );

    projectManager.setProjects(
      projectManager
        .getProjects()
        .map((project) => Object.assign(new Project(), project))
    );

    projectManager
      .getProjects()
      .forEach((project) =>
        project.setTodos(
          project.getTodos().map((todo) => Object.assign(new Todo(), todo))
        )
      );

    return projectManager;
  }
}
