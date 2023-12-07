export default class Project {
  #displayName;
  #todos;

  constructor(displayName) {
    this.#displayName = displayName;
    this.#todos = new Set();
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
    this.#todos.add(todo);
  }

  deleteTodo(todo) {
    this.#todos.delete(todo);
  }
}
