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

let testTodo2 = new Todo(
  "Test TODO 2",
  "This is a test TODO",
  new Date(),
  priority.MEDIUM
);
console.log(testTodo);

testProject.addTodo(testTodo);
console.log(testProject);
console.log(testProject.todos);
testProject.addTodo(testTodo2);
console.log(testProject);
console.log(testProject.todos);

testProject.todos.forEach((todo) => {
  console.log(todo.title);
});

testProject.deleteTodo(testTodo);
console.log(testProject);
console.log(testProject.todos);

testProject.deleteTodo(testTodo);
console.log(testProject);
console.log(testProject.todos);
