<%*
// Initialize dataview plugin variable
const dv = this.app.plugins.plugins["dataview"].api;
links = await tp.user.linkFolderOfNotes(tp, dv)
_%>
<%links%>

