async function newPage (tp, dv){

// Select where to create the note
let noteDest = await tp.system.suggester(["Inbox", "Projects"], ["Inbox", "Projects"]);
let selected_FilePath = "";
let fileYear = tp.date.now("YYYY");
let target_Folder = "01 Home/!Inbox/" + fileYear;

if (noteDest == "Projects") {
selected_project = await tp.user.selectProject(tp, dv, false);
// If there is a board associated with the project
// Check to see if you want to add the note to the project folder or
// to the notebook of one of the cards on the board
if (selected_project.frontmatter.hasOwnProperty("board")) {
//console.log(selected_project.frontmatter.board);
let projectCards = dv.pages(`"` + selected_project.folder + `"`)
	.where(p => p.note_type == "card");
let names = ["Project Notebook", ...projectCards.file.name];
//console.log(names);
let files = [selected_project, ...projectCards.file];
//console.log(files);
let projectFile = await tp.system.suggester(names, files);
selected_project = projectFile;
//console.log(projectFolderTarget)
} 
target_Folder = selected_project.folder + "/notebook";
} 

// Find and Select Templates
//let selected_templates = dv.pages()
//	.where(p => p.note_type == "page template")
//	.where(p => p.template_type == "All")
//	.file.sort(n => n.name);
//let suggestions3 = selected_templates.name;
//let values3 = selected_templates.path;
//let selected_Template = await tp.system.suggester(suggestions3,values3);	

let selected_Template = "/04 Resources/Notebook/Note Templates/11 Notebook Page Template.md";

// Write File Name and add Folder Path
let fileName = await tp.system.prompt("Enter Note Name");
let filePath = await target_Folder + "/" + tp.date.now("YYYY-MM-DD") + "-" + fileName;
// Build new file
let new_Tfile = await tp.user.buildPageAndLink(tp, selected_Template, filePath, "/", false); 
let newFile = new_Tfile.basename;
console.log(new_Tfile);
// Link to Target project
if (noteDest == "Projects") {
await tp.user.embedPageToTarget(tp, selected_project.name, newFile, "# Notebook", "## ", linkToHeading = false);
}

// Apply Frontmatter to new file
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
    //    frontmatter["created_by"] = user; 
    //    frontmatter["total_tasks"] = 0;
    //    frontmatter["completed_tasks"] = 0;
    //    frontmatter["incomplete_tasks"] = 0;
        // Apply projectCategory/Template Specific frontmatter
      })
  return new_Tfile;

      }

 module.exports = newPage;