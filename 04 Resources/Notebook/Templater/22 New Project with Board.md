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
	.where(p => p.note_type == "projectCategory" || p.note_type == "project")
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
	.where(p => p.note_type == "project template")
	.where(p => String(selected_projectCategory.link).indexOf(p.projectCategory) !== -1 || p.template_type == "All")
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
		frontmatter["projectCategory"] = String("[[" + selected_projectCategory.name + "]]");	
		frontmatter["project"] = String("[[" + new_Tfile.path + "|" + new_Tfile.basename + "]]");
		/// If the selected project isn't a projectCategory, add the parent project, otherwise add the projectCategory
		(String(selected_projectCategory.link).indexOf(String(selected_project.link))  <= 0) ? frontmatter["parent_project"] = String(selected_project.link) : frontmatter["parent_project"] = String(selected_projectCategory.link);

        // Apply Default frontmatter
		frontmatter["people"] = null;
        frontmatter["topics"] = null;
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");
        frontmatter["created_by"] = user; 
        // Apply projectCategory/Template Specific frontmatter
      })

// Build new experiment file
// Find and Select Templates
let selected_templates_EX = dv.pages()
	.where(p => p.note_type == "board template")
	.where(p => String(selected_projectCategory.link).indexOf(p.projectCategory) !== -1 || p.template_type == "All")
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
		frontmatter["note_type"] = "kanban";
		// Update project Frontmatter
		frontmatter["projectCategory"] = String(selected_projectCategory.link);	
		frontmatter["project"] = "[[" + new_Tfile.path + "|" + new_Tfile.basename + "]]";
        // Apply Default frontmatter
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");
        frontmatter["created_by"] = user; 
        // Apply projectCategory/Template Specific frontmatter
      })
// Update Kanban Settings
/// Get the Template for experimental Notes
let selected_templates_EXNote = dv.pages()
	.where(p => p.note_type == "card template")
	.where(p => String(selected_projectCategory.link).indexOf(p.projectCategory) !== -1 || p.template_type == "All")
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


