import Project from "./project";
import { isThisWeek, isToday } from "date-fns";

export default class ProjectManager {
  #projects;

  constructor() {
    this.#projects = [new Project("Inbox")];
  }

  getProject(index) {
    return this.#projects[index];
  }

  getUserProjects() {
    return [...this.#projects.slice(1)];
  }

  addProject(project) {
    if (this.#projects.includes(project)) return;

    this.#projects.push(project);
  }

  deleteProject(project) {
    if (
      !this.#projects.includes(project) ||
      this.#projects.indexOf(project) === 0
    )
      return;

    this.#projects.splice(this.#projects.indexOf(project), 1);
  }

  getAllTodosThisWeek() {
    return this.#getAllTodos().filter((todo) =>
      isThisWeek(todo.dueDate, { weekStartsOn: 1 })
    );
  }

  getAllTodosToday() {
    return this.#getAllTodos().filter((todo) => isToday(todo.dueDate));
  }

  #getAllTodos() {
    return this.#projects.flatMap((project) => project.todos);
  }
}
