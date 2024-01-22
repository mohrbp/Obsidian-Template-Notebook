<%*
// Initialize dataview plugin variable
const dv = this.app.plugins.plugins["dataview"].api;
// Select a projectCategory
selected_project = await tp.user.selectProject(tp, dv, false);
console.log(selected_project);
await tp.user.newBoard(tp, dv, selected_project)
_%>


