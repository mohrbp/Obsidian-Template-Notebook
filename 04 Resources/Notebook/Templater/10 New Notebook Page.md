<%*
// Config
const user = "BMohr";
// Initialize dataview plugin variable
const dv = this.app.plugins.plugins["dataview"].api;
// Select where to create the note
let noteDest = await tp.system.suggester(["Inbox", "Projects"], ["Inbox", "Projects"]);
let selected_FilePath = "";
let target_Folder = "01 Home/!Inbox";
if (noteDest == "Projects") {
selected_project = await tp.user.selectProject(tp, dv, false);
// If there is a board associated with the project
// Check to see if you want to add the note to the project folder or
// to the notebook of one of the cards on the board
if (selected_project.frontmatter.hasOwnProperty("board")) {
console.log(selected_project.frontmatter.board);
let projectCards = dv.pages(`"` + selected_project.folder + `"`)
	.where(p => p.note_type == "card");
let names = ["Project Notebook", ...projectCards.file.name];
//console.log(names);
let folders = [selected_project.folder, ...projectCards.file.folder];
//console.log(folders);
let projectFolderTarget = await tp.system.suggester(names, folders);
target_Folder = projectFolderTarget + "/notebook"
//console.log(projectFolderTarget)
//console.log(target_Folder)
} else {
target_Folder = selected_project.folder + "/notebook";
}
} 

// Find and Select Templates
let selected_templates = dv.pages()
	.where(p => p.note_type == "page template")
	.where(p => p.template_type == "All")
	.file.sort(n => n.name);
let suggestions3 = selected_templates.name;
let values3 = selected_templates.path;
let selected_Template = await tp.system.suggester(suggestions3,values3);	

// Write File Name and add Folder Path
let fileName = await tp.system.prompt("Enter Note Name");
let filePath = await target_Folder + "/" + tp.date.now("YYYY-MM-DD") + "-" + fileName;

// Build new file
let newFile = await tp.user.buildPageAndLink(tp, selected_Template, filePath, "/", false); 

// Link to Target project
if (noteDest == "Projects") {
await tp.user.embedPageToTarget(tp, selected_project.name, newFile, "# Notebook", "## ", linkToHeading = false);
}

// Apply Frontmatter to new file
let new_Tfile = await tp.file.find_tfile(newFile);
await app.fileManager.processFrontMatter(
      new_Tfile,
      frontmatter => {
		// Remove Excess Template Frontmatter
		delete frontmatter['template_type'];

		// Update Template Frontmatter
		frontmatter["note_type"] = "page";
		(noteDest != "Inbox") ?frontmatter["projectCategory"] = String(selected_project.frontmatter.projectCategory) : frontmatter["projectCategory"] = null;
		(noteDest != "Inbox") ? frontmatter["project"] = String(selected_project.link) : frontmatter["project"] = null;
        // Apply Default frontmatter
		frontmatter["people"] = null;
        frontmatter["topics"] = null;
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm");
        frontmatter["created_by"] = user; 
    //    frontmatter["total_tasks"] = 0;
   //     frontmatter["completed_tasks"] = 0;
    //    frontmatter["incomplete_tasks"] = 0;
        // Apply projectCategory/Template Specific frontmatter
      })
_%>
