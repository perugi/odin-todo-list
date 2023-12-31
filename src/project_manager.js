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

  deleteProject(projectIndex) {
    if (projectIndex > this.projects.length || projectIndex === 0) return;

    this.projects.splice(projectIndex, 1);
  }

  getAllTodosThisWeek() {
    return this.filterTodos((todo) =>
      isThisWeek(todo.getDueDate(), { weekStartsOn: 1 })
    );
  }

  getAllTodosToday() {
    return this.filterTodos((todo) => isToday(todo.getDueDate()));
  }

  filterTodos(filterFunction) {
    let filteredProjects = {};
    for (const project of this.projects) {
      let filteredProject = {};

      filteredProject["displayName"] = project.getDisplayName();
      filteredProject["originalProject"] = project;

      project
        .getTodos()
        .filter(filterFunction)
        .forEach((todo) => {
          filteredProject[project.getTodoIndex(todo)] = todo;
        });

      if (Object.keys(filteredProject).length === 2) continue;
      filteredProjects[this.getProjectIndex(project)] = filteredProject;
    }

    return filteredProjects;
  }
}
