import Project from "./project";
import { isThisWeek, isToday } from "date-fns";

export default class ProjectManager {
  #projects;

  constructor() {
    this.#projects = [new Project("Inbox")];
  }

  get projects() {
    return this.#projects;
  }

  addProject(project) {
    if (this.#projects.includes(project)) return;

    this.#projects.push(project);
  }

  deleteProject(project) {
    if (!this.#projects.includes(project)) return;

    this.#projects.splice(this.#projects.indexOf(project), 1);
  }

  getAllTasksThisWeek() {
    return this.#getAllTasks().filter((todo) =>
      isThisWeek(todo.dueDate, { weekStartsOn: 1 })
    );
  }

  getAllTasksToday() {
    return this.#getAllTasks().filter((todo) => isToday(todo.dueDate));
  }

  #getAllTasks() {
    return this.#projects.flatMap((project) => project.todos);
  }
}
