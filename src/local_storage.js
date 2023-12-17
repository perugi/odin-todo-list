import ProjectManager from "./project_manager";

export function retrieveProjectManager() {
  console.log("retrieve from local storage");
  console.log(localStorage.getItem("projectManager"));
  return new ProjectManager();
}

export function storeProjectManager(projectManager) {
  // console.log("Store to local storage");
  // let projectManagerForStorage = {};
  // projectManager.getAllProjects().forEach((project) => {
  //   projectManagerForStorage[project.displayName] = {
  //     todos: [],
  //     displayName: project.displayName,
  //   };
  //   project.todos.forEach((todo) => {
  //     projectManagerForStorage[project.displayName].todos.push(
  //       JSON.stringify(todo)
  //     );
  //   });
  // });
  // console.log(projectManagerForStorage);
  // localStorage.setItem(
  //   "projectManager",
  //   JSON.stringify(projectManagerForStorage)
  // );

  console.log(JSON.stringify(projectManager));
}
