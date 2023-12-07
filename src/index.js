import Todo from "./todo";
import Project from "./project";
import priority from "./priority";

let testProject = new Project("Test Project");

let testTodo = new Todo(
  "Test TODO",
  "This is a test TODO",
  new Date(),
  priority.HIGH
);

console.log(testTodo);

testProject.addTodo(testTodo);
console.log(testProject);
console.log(testProject.todos);
console.log(testProject.todos[0].title);

testProject.removeTodo(testTodo);
console.log(testProject);
console.log(testProject.todos);
