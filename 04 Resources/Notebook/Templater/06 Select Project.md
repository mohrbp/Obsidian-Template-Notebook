<%* 
const dv = this.app.plugins.plugins["dataview"].api;
let project = await tp.user.selectProject(tp, dv, true)
_%>

<%project.folder%>