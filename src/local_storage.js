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

    console.log(projectManager);

    return projectManager;
  }

  static addProject(project) {
    const projectManager = Storage.getProjectManager();
    projectManager.addProject(project);
    Storage.saveProjectManager(projectManager);
  }

  static deleteProject(projectIndex) {
    const projectManager = Storage.getProjectManager();
    projectManager.deleteProject(projectIndex);
    Storage.saveProjectManager(projectManager);
  }

  static editProject(projectIndex, displayName) {
    const projectManager = Storage.getProjectManager();
    projectManager.getProject(projectIndex).setDisplayName(displayName);
    Storage.saveProjectManager(projectManager);
  }

  static addTodo(projectIndex, todo) {
    const projectManager = Storage.getProjectManager();
    console.log(projectIndex);
    projectManager.getProject(projectIndex).addTodo(todo);
    Storage.saveProjectManager(projectManager);
  }

  static deleteTodo(projectIndex, todo) {
    const projectManager = Storage.getProjectManager();
    projectManager.getProject(projectIndex).deleteTodo(todo);
    Storage.saveProjectManager(projectManager);
  }

  static editTodo(projectIndex, todoIndex, editedTodo) {
    const projectManager = Storage.getProjectManager();
    projectManager
      .getProject(projectIndex)
      .getTodo(todoIndex)
      .editTodo(editedTodo);

    Storage.saveProjectManager(projectManager);
  }
}
