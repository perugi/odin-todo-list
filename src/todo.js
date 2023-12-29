export default class Todo {
  title;
  description;
  dueDate;
  priority;
  completed;

  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
  }

  setTitle(title) {
    this.title = title;
  }

  getTitle() {
    return this.title;
  }

  setDescription(description) {
    this.description = description;
  }

  getDescription() {
    return this.description;
  }

  setDueDate(dueDate) {
    this.dueDate = dueDate;
  }

  getDueDate() {
    return this.dueDate;
  }

  setPriority(priority) {
    this.priority = priority;
  }

  getPriority() {
    return this.priority;
  }

  setCompleted(completed) {
    this.completed = completed;
  }

  getCompleted() {
    return this.completed;
  }

  editTodo(editedTodo) {
    this.setTitle(editedTodo.getTitle);
    this.setDescription(editedTodo.getDescription);
    this.setDueDate(editedTodo.getDueDate);
    this.setPriority(editedTodo.getPriority);
    this.setCompleted(editedTodo.getCompleted);
  }
}
