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

  getTodo(index) {
    return this.todos[index];
  }

  getTodoIndex(todo) {
    return this.todos.indexOf(todo);
  }

  addTodo(todo) {
    if (this.todos.includes(todo)) return;

    this.todos.push(todo);
  }

  deleteTodo(todo) {
    if (!this.todos.includes(todo)) return;

    this.todos.splice(this.getTodoIndex(todo), 1);
  }
}
