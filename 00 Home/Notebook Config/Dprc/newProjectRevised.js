async function newProjectRevised (tp, dv){

// Select a projectCategory
let noteDest = await tp.system.suggester(["Projects", "Current Location"], ["Projects", "Current Location"]);
selected_project = await tp.user.selectProjectRevised(tp, dv, noteDest);
let target_Folder = selected_project.folder;

// Find and Select Templates
let selected_templates = dv.pages()
	.where(p => p.note_type == "project template")
	.file.sort(n => n.name);
let suggestions3 = selected_templates.name;
let values3 = selected_templates.path;
let selected_Template = await tp.system.suggester(suggestions3,values3);	

// Write File Name and add Folder Path
let fileName = await tp.system.prompt("Enter Project Name");
let filePath = await target_Folder + "/" + fileName + "/" + fileName;

// Build new project file
let new_Tfile = await tp.user.buildPageAndLink(tp, selected_Template, filePath, "/", false); 
let newFile = new_Tfile.basename;
// Link to Parent project
await tp.user.embedPageToTarget(tp, selected_project.name, newFile, "# Notebook", "## ", "# Notebook");

// Apply Frontmatter to new project file
await app.fileManager.processFrontMatter(
      new_Tfile,
      frontmatter => {
		// Remove Excess Template Frontmatter
		delete frontmatter['template_type'];
		// Update Template Frontmatter
		frontmatter["note_type"] = String("project");
		// Update project Frontmatter
		frontmatter["parent_project"] = String(selected_project.frontmatter.project);	
		frontmatter["project"] = String("[[" + new_Tfile.basename + "|" + new_Tfile.basename + "]]");
        	// Apply Default frontmatter
		frontmatter["people"] = null;
        	frontmatter["topics"] = null;
        	frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm");
      })

return new_Tfile;
}

module.exports = newProjectRevised;