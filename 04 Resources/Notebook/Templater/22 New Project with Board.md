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
	.where(p => p.note_type == "project template")
	.where(p => p.template_type == "All")
	.file.sort(n => n.name);
let suggestions3 = selected_templates.name;
let values3 = selected_templates.path;
let selected_Template = await tp.system.suggester(suggestions3,values3);	

// Write File Name and add Folder Path
let fileName = await tp.system.prompt("Enter Project Name");
let filePath = await target_Folder + "/" + fileName + "/" + fileName;

// Build new project file
let newFile = await tp.user.buildPageAndLink(tp, selected_Template, filePath, "/", false); 

// Link to Parent project
await tp.user.embedPageToTarget(tp, selected_project.name, newFile, "# Notebook", "# Notebook", linkToHeading = true);

// Apply Frontmatter to new project file
let new_Tfile = await tp.file.find_tfile(newFile);
await app.fileManager.processFrontMatter(
      new_Tfile,
      frontmatter => {
		// Remove Excess Template Frontmatter
		delete frontmatter['template_type'];
		// Update Template Frontmatter
		frontmatter["note_type"] = String("project");
		// Update project Frontmatter
		frontmatter["projectCategory"] = String(selected_project.frontmatter.projectCategory);	
		frontmatter["project"] = String("[[" + new_Tfile.path + "|" + new_Tfile.basename + "]]");
		/// If the selected project isn't a projectCategory, add the parent project, otherwise add the projectCategory
		(selected_project.frontmatter.note_type == "projectCategory") ? frontmatter["parent_project"] = String(selected_project.frontmatter.projectCategory) : frontmatter["parent_project"] = String(selected_project.link);

        // Apply Default frontmatter
		frontmatter["people"] = null;
        frontmatter["topics"] = null;
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");
        frontmatter["created_by"] = user; 
        // Apply projectCategory/Template Specific frontmatter
      })

// Build Linked Experiment Kanban Board
// Find and Select Templates
let selected_templates_EX = dv.pages()
	.where(p => p.note_type == "board template")
	.where(p => p.template_type == "All")
	.file.sort(n => n.name);
let suggestions4 = selected_templates_EX.name;
let values4 = selected_templates_EX.path;
let selected_Template_EX = await tp.system.suggester(suggestions4,values4);

let filePath_EX = await target_Folder + "/" + fileName + "/experiments/experiments";

let newFile_EX = await tp.user.buildPageAndLink(tp, selected_Template_EX, filePath_EX, "/", false); 

// Apply Frontmatter to new experiment file
let new_Tfile_EX = await tp.file.find_tfile(newFile_EX);
await app.fileManager.processFrontMatter(
      new_Tfile_EX,
      frontmatter => {
		// Remove Excess Template Frontmatter
		delete frontmatter['template_type'];
		// Update Template Frontmatter
		frontmatter["note_type"] = "board";
		// Update project Frontmatter
		frontmatter["projectCategory"] = String(selected_project.frontmatter.projectCategory);	
		frontmatter["project"] = "[[" + new_Tfile.path + "|" + new_Tfile.basename + "]]";
        // Apply Default frontmatter
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");
        frontmatter["created_by"] = user; 
        // Apply projectCategory/Template Specific frontmatter
      })
// Update Kanban Settings
/// Get the Template for Experimental Cards
let selected_templates_EXNote = dv.pages()
	.where(p => p.note_type == "card template")
	.where(p => p.template_type == "All")
	.file.sort(n => n.name);
let suggestions5 = selected_templates_EXNote.name;
let values5 = selected_templates_EXNote.path;
let selected_Template_EXNote = await tp.system.suggester(suggestions5,values5);

/// Modify Kanban Setings
let note_Content_EX = await app.vault.read(new_Tfile_EX);

let kanbanSettings = '%% kanban:settings\n```\n{"kanban-plugin":"basic"}\n```\n%%';
/// Add the target folder for subsequent experiments (if generated from the board)
let kanbanSettingsUpdated = await'%% kanban:settings\n```\n{"kanban-plugin":"basic", "new-note-folder":"'+ target_Folder + '/' + fileName + '/experiments", "new-note-template":"' + selected_Template_EXNote + '"}\n```\n%%';

let targetNoteReplaced = note_Content_EX.replace(kanbanSettings, kanbanSettingsUpdated);
await app.vault.modify(new_Tfile_EX, targetNoteReplaced);

_%>


