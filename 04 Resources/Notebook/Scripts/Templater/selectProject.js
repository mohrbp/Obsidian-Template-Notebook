async function selectProject (tp, dv, topLevel = false){

let all_projects = dv.pages()
  .where(p => p.note_type == "projectCategory")
  .where(p => p.file.name != "!Inbox")
  .file
    .sort(n => n.name);
let suggestions1 = all_projects.name;
let values1 = all_projects.link;
let selected_projectCategory = await tp.system.suggester(suggestions1,values1);

// If you pick a project instead of your Inbox
let target_Folder;
let selected_project;
/// Choose from all projects that contain that projectCategory
/// Does not only include projects from that folder
/// Match is fuzzy
(topLevel) ? noteType = (["project", "projectCategory"]) : noteType = (["project"]);
let selected_projects = dv.pages()
  .where(p => String(noteType).includes(p.note_type))
  .where(p => String(p.projectCategory).includes(selected_projectCategory))
  .file
    .sort(n => n.name);
let suggestions2 = selected_projects.name;
let values2 = selected_projects;
selected_project = await tp.system.suggester(suggestions2,values2);

let output = selected_project

return output
};
  
module.exports = selectProject;