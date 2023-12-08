import Todo from "./todo";
import Project from "./project";
import ProjectManager from "./project_manager";
import priority from "./priority";

let projectManager = new ProjectManager();

let testProject = new Project("Test Project");
projectManager.addProject(testProject);
projectManager.addProject(testProject);
let testProject2 = new Project("Test Project 2");
projectManager.addProject(testProject2);

let testTodo = new Todo(
  "Test TODO",
  "This is a test TODO",
  new Date(2023, 11, 8),
  priority.HIGH
);

let testTodo2 = new Todo(
  "Test TODO 2",
  "This is a test TODO",
  new Date(2023, 11, 9),
  priority.MEDIUM
);

let testTodo3 = new Todo(
  "Test TODO 3",
  "This is a test TODO",
  new Date(2023, 11, 10),
  priority.MEDIUM
);

testProject.addTodo(testTodo);
testProject.addTodo(testTodo2);
testProject.addTodo(testTodo2);
testProject2.addTodo(testTodo3);

testProject.todos.forEach((todo) => {
  console.log(todo.title);
  console.log(todo.dueDate);
});

console.log(projectManager.projects);
console.log(projectManager.getAllTasksToday());
console.log(projectManager.getAllTasksThisWeek());
