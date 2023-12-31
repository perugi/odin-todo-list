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

  static addProject(project) {
    const projectManager = Storage.getProjectManager();
    projectManager.addProject(project);
    Storage.saveProjectManager(projectManager);
  }

  static deleteProject(projectIndex) {
    console.log(projectIndex);
    const projectManager = Storage.getProjectManager();
    projectManager.deleteProject(projectManager.getProject(projectIndex));
    Storage.saveProjectManager(projectManager);
  }

  static editProject(projectIndex, displayName) {
    const projectManager = Storage.getProjectManager();
    projectManager.getProject(projectIndex).setDisplayName(displayName);
    Storage.saveProjectManager(projectManager);
  }

  static addTodo(projectIndex, todo) {
    const projectManager = Storage.getProjectManager();
    projectManager.getProject(projectIndex).addTodo(todo);
    Storage.saveProjectManager(projectManager);
  }

  static deleteTodo(projectIndex, todoIndex) {
    const projectManager = Storage.getProjectManager();
    projectManager
      .getProject(projectIndex)
      .deleteTodo(projectManager.getProject(projectIndex).getTodo(todoIndex));
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

  static setCompleted(projectIndex, todoIndex, completed) {
    const projectManager = Storage.getProjectManager();
    projectManager
      .getProject(projectIndex)
      .getTodo(todoIndex)
      .setCompleted(completed);

    Storage.saveProjectManager(projectManager);
  }
}
