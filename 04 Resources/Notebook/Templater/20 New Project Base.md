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
console.log(newFile);
// Link to Parent project
await tp.user.embedPageToTarget(tp, selected_project.name, newFile, "# Notebook", "## ", "# Notebook");

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
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm");
        frontmatter["created_by"] = user; 
        // Apply projectCategory/Template Specific frontmatter
      })

let boardStatus = await tp.system.suggester(["With Board", "Without Board"],["withBoard", "withoutBoard"]);
let newProjectDV = await dv.page(new_Tfile.path).file;
console.log(newProjectDV);
if (boardStatus == "withBoard") {
await tp.user.newBoard(tp, dv, newProjectDV);
};

_%>


