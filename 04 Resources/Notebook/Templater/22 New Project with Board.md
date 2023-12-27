<%*
// Config
const user = "BMohr";
// Initialize dataview plugin variable
const dv = this.app.plugins.plugins["dataview"].api;

// Select a PCode
/// Filter all files that are PCoded - excluding the inbox
let all_PCodes = dv.pages()
	.where(p => p.note_type == "PCode")
	.where(p => String(p.PCode).indexOf("!Inbox")  <= 0)
	.file.sort(n => n.name);
let suggestions1 = all_PCodes.name;
let values1 = all_PCodes;
let selected_PCode = await tp.system.suggester(suggestions1,values1);

// If you pick a project instead of your Inbox
let target_Folder;
let selected_Project;
/// Choose from all projects that contain that Pcode
/// Does not only include projects from that folder
/// Match is fuzzy
let selected_projects = dv.pages()
	.where(p => p.note_type == "PCode" || p.note_type == "Project")
	.where(p => String(selected_PCode.link).indexOf(p.PCode) !== -1)
	.file.sort(n => n.name);
let suggestions2 = selected_projects.name;
let values2 = selected_projects;
selected_Project = await tp.system.suggester(suggestions2,values2);
/// Trimming the filepath from the Folder Note and finding the Notebook for this project
let selected_FilePath = selected_Project.folder;
target_Folder = selected_FilePath;

// Find and Select Templates
let selected_templates = dv.pages()
	.where(p => p.note_type == "Project Template")
	.where(p => String(selected_PCode.link).indexOf(p.PCode) !== -1 || p.template_type == "All")
	.file.sort(n => n.name);
let suggestions3 = selected_templates.name;
let values3 = selected_templates.path;
let selected_Template = await tp.system.suggester(suggestions3,values3);	

// Write File Name and add Folder Path
let fileName = await tp.system.prompt("Enter Project Name");
let filePath = await target_Folder + "/" + fileName + "/" + fileName;

// Build new Project file
let newFile = await tp.user.buildPageAndLink(tp, selected_Template, filePath, "/", false); 

// Link to Parent Project
await tp.user.embedPageToTarget(tp, selected_Project.name, newFile, "# Notebook", "# Notebook", linkToHeading = true);

// Apply Frontmatter to new Project file
let new_Tfile = await tp.file.find_tfile(newFile);
await app.fileManager.processFrontMatter(
      new_Tfile,
      frontmatter => {
		// Remove Excess Template Frontmatter
		delete frontmatter['template_type'];
		// Update Template Frontmatter
		frontmatter["note_type"] = String("Project");
		// Update Project Frontmatter
		frontmatter["PCode"] = String("[[" + selected_PCode.name + "]]");	
		frontmatter["project"] = String("[[" + new_Tfile.path + "|" + new_Tfile.basename + "]]");
		/// If the selected Project isn't a PCode, add the parent project, otherwise add the PCode
		(String(selected_PCode.link).indexOf(String(selected_Project.link))  <= 0) ? frontmatter["parent_project"] = String(selected_Project.link) : frontmatter["parent_project"] = String(selected_PCode.link);

        // Apply Default frontmatter
		frontmatter["people"] = null;
        frontmatter["topics"] = null;
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");
        frontmatter["created_by"] = user; 
        // Apply PCode/Template Specific frontmatter
      })

// Build new Experiment file
// Find and Select Templates
let selected_templates_EX = dv.pages()
	.where(p => p.note_type == "Kanban Template")
	.where(p => String(selected_PCode.link).indexOf(p.PCode) !== -1 || p.template_type == "All")
	.file.sort(n => n.name);
let suggestions4 = selected_templates_EX.name;
let values4 = selected_templates_EX.path;
let selected_Template_EX = await tp.system.suggester(suggestions4,values4);

let filePath_EX = await target_Folder + "/" + fileName + "/Experiments/Experiments";

let newFile_EX = await tp.user.buildPageAndLink(tp, selected_Template_EX, filePath_EX, "/", false); 

// Apply Frontmatter to new Experiment file
let new_Tfile_EX = await tp.file.find_tfile(newFile_EX);
await app.fileManager.processFrontMatter(
      new_Tfile_EX,
      frontmatter => {
		// Remove Excess Template Frontmatter
		delete frontmatter['template_type'];
		// Update Template Frontmatter
		frontmatter["note_type"] = "Kanban";
		// Update Project Frontmatter
		frontmatter["PCode"] = String(selected_PCode.link);	
		frontmatter["project"] = "[[" + new_Tfile.path + "|" + new_Tfile.basename + "]]";
        // Apply Default frontmatter
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");
        frontmatter["created_by"] = user; 
        // Apply PCode/Template Specific frontmatter
      })
// Update Kanban Settings
/// Get the Template for Experimental Notes
let selected_templates_EXNote = dv.pages()
	.where(p => p.note_type == "Experiment Template")
	.where(p => String(selected_PCode.link).indexOf(p.PCode) !== -1 || p.template_type == "All")
	.file.sort(n => n.name);
let suggestions5 = selected_templates_EXNote.name;
let values5 = selected_templates_EXNote.path;
let selected_Template_EXNote = await tp.system.suggester(suggestions5,values5);

/// Modify Kanban Setings
let note_Content_EX = await app.vault.read(new_Tfile_EX);

let kanbanSettings = '%% kanban:settings\n```\n{"kanban-plugin":"basic"}\n```\n%%';
/// Add the target folder for subsequent Experiments (if generated from the board)
let kanbanSettingsUpdated = await'%% kanban:settings\n```\n{"kanban-plugin":"basic", "new-note-folder":"'+ target_Folder + '/' + fileName + '/Experiments", "new-note-template":"' + selected_Template_EXNote + '"}\n```\n%%';

let targetNoteReplaced = note_Content_EX.replace(kanbanSettings, kanbanSettingsUpdated);
await app.vault.modify(new_Tfile_EX, targetNoteReplaced);

%>


