import Project from "./project";
import { isThisWeek, isToday } from "date-fns";

export default class ProjectManager {
  projects;

  constructor() {
    this.projects = [new Project("Inbox")];
  }

  setProjects(projects) {
    this.projects = projects;
  }

  getProjects() {
    return this.projects;
  }

  getProject(index) {
    return this.projects[index];
  }

  getProjectIndex(project) {
    return this.projects.indexOf(project);
  }

  getUserProjects() {
    return [...this.projects.slice(1)];
  }

  addProject(project) {
    if (this.projects.includes(project)) return;

    this.projects.push(project);
  }

  deleteProject(project) {
    if (!this.projects.includes(project)) return;

    this.projects.splice(this.getProjectIndex(project), 1);
  }

  getAllTodosThisWeek() {
    return this.#filterTodos((todo) =>
      isThisWeek(todo.getDueDate(), { weekStartsOn: 1 })
    );
  }

  getAllTodosToday() {
    return this.#filterTodos((todo) => isToday(todo.getDueDate()));
  }

  #filterTodos(filterFunction) {
    let filteredProjects = new Map();

    for (const project of this.projects) {
      let filteredTodos = project.getTodos().filter(filterFunction);

      if (filteredTodos.length == 0) continue;
      filteredProjects.set(project, filteredTodos);
    }

    return filteredProjects;
  }
}
