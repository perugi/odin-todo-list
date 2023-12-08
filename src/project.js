export default class Project {
  #displayName;
  #todos;

  constructor(displayName) {
    this.#displayName = displayName;
    this.#todos = [];
  }

  set displayName(displayName) {
    this.#displayName = displayName;
  }

  get displayName() {
    return this.#displayName;
  }

  get todos() {
    return this.#todos;
  }

  addTodo(todo) {
    if (this.#todos.includes(todo)) return;

    this.#todos.push(todo);
  }

  deleteTodo(todo) {
    if (!this.#todos.includes(todo)) return;

    this.#todos.splice(this.#todos.indexOf(todo), 1);
  }
}
