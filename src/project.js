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

  deleteTodo(index) {
    if (index < 0 || index > this.todos.length) return;

    this.todos.splice(index, 1);
  }
}
