<%*
// Config
const user = "BMohr";
// Initialize dataview plugin variable
const dv = this.app.plugins.plugins["dataview"].api;

// Select a projectCategory
selected_project = await tp.user.selectProject(tp, dv, true);
let target_Folder = selected_project.folder;

// Find and Select Templates
let selected_templates = dv.pages()
	.where(p => p.note_type == "card template")
	.where(p => p.template_type == "All")
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

_%>

