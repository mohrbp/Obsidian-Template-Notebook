<%*
// Config
const user = "BMohr";
// Initialize dataview plugin variable
const dv = this.app.plugins.plugins["dataview"].api;

// Select a projectCategory
/// Filter all files that are projectCategoryd - excluding the inbox
let all_projectCategorys = dv.pages()
	.where(p => p.note_type == "projectCategory")
	.where(p => String(p.projectCategory).indexOf("!Inbox")  <= 0)
	.file.sort(n => n.name);
let suggestions1 = all_projectCategorys.name;
let values1 = all_projectCategorys;
let selected_projectCategory = await tp.system.suggester(suggestions1,values1);

// If you pick a project instead of your Inbox
let target_Folder;
let selected_project;
/// Choose from all projects that contain that projectCategory
/// Does not only include projects from that folder
/// Match is fuzzy
let selected_projects = dv.pages()
	.where(p => p.note_type == "project")
	.where(p => String(selected_projectCategory.link).indexOf(p.projectCategory) !== -1)
	.file.sort(n => n.name);
let suggestions2 = selected_projects.name;
let values2 = selected_projects;
selected_project = await tp.system.suggester(suggestions2,values2);
/// Trimming the filepath from the Folder Note and finding the notebook for this project
let selected_FilePath = selected_project.folder;
target_Folder = selected_FilePath;

// Find and Select Templates
let selected_templates = dv.pages()
	.where(p => p.note_type == "kanban card template")
	.where(p => String(selected_projectCategory.link).indexOf(p.projectCategory) !== -1 || p.template_type == "All")
	.file.sort(n => n.name);
let suggestions3 = selected_templates.name;
let values3 = selected_templates.path;
let selected_Template = await tp.system.suggester(suggestions3,values3);	

// Write File Name and add Folder Path
let fileName = await tp.system.prompt("Enter Experiment Name");
let filePath = await target_Folder + "/experiments/" + fileName;

// Build new file
let newFile = await tp.user.buildPageAndLink(tp, selected_Template, filePath, "/", false);

// Link to experiment Board
let expPath = await target_Folder + "/experiments/experiments";
let exp_TF = await tp.file.find_tfile(expPath);
let expContent = await app.vault.read(exp_TF);
let targetContent = "## To-Do";
let replacementContent = await "## To-Do\n- [ ] [[" + tp.date.now("YYYY-MM-DD") + "-" + fileName + "]]";
/// Modify experiment Board
let targetNoteReplaced = expContent.replace(targetContent, replacementContent);
await app.vault.modify(exp_TF, targetNoteReplaced);

%>