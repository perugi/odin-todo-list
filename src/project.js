export default class Project {
  displayName;
  todos;

  constructor(displayName) {
    this.displayName = displayName;
    this.todos = [];
  }

  setDisplayName(displayName) {
    this.displayName = displayName;
  }

  getDisplayName() {
    return this.displayName;
  }

  setTodos(todos) {
    this.todos = todos;
  }

  getTodos() {
    return this.todos;
  }

  addTodo(todo) {
    if (this.todos.includes(todo)) return;

    this.todos.push(todo);
  }

  deleteTodo(todo) {
    if (!this.todos.includes(todo)) return;

    this.todos.splice(this.todos.indexOf(todo), 1);
  }
}
