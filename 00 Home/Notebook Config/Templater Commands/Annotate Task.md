<%*
// Initialize dataview plugin variable
const dv = this.app.plugins.plugins["dataview"].api;
let annotation = await tp.user.annotateTask(tp, dv)
tR += annotation
_%>
