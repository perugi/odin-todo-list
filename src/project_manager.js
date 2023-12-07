import Project from "./project";

export default class ProjectManager {
  #projects;

  constructor() {
    this.#projects = new Set([new Project("Inbox")]);
  }

  get projects() {
    return this.#projects;
  }

  addProject(project) {
    this.#projects.add(project);
  }

  deleteProject(project) {
    this.#projects.delete(project);
  }
}
