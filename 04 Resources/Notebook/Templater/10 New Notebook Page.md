<%*
// Config
const user = "BMohr";
// Initialize dataview plugin variable
const dv = this.app.plugins.plugins["dataview"].api;
// Select a project
/// Filter all files that are projectCategoryd
let all_projects = dv.pages().where(p => p.note_type == "projectCategory").file.sort(n => n.name);
let suggestions1 = all_projects.name;
let values1 = all_projects.link;
let selected_projectCategory = await tp.system.suggester(suggestions1,values1);

// If you pick a project instead of your Inbox
let target_Folder;
let selected_project;
if (String(selected_projectCategory).indexOf("!Inbox") <= 0) {
/// Choose from all projects that contain that projectCategory
/// Does not only include projects from that folder
/// Match is fuzzy
let selected_projects = dv.pages()
	.where(p => p.note_type == "project")
//	.where(p => String(selected_projectCategory).indexOf(p.projectCategory) !== -1)
	.file.sort(n => n.name);
let suggestions2 = selected_projects.name;
let values2 = selected_projects;
selected_project = await tp.system.suggester(suggestions2,values2);
/// Trimming the filepath from the Folder Note and finding the notebook for this project
let selected_FilePath = selected_project.folder + "/notebook";
target_Folder = selected_FilePath;
} else {
target_Folder = "01 Home/!Inbox";
};

// Find and Select Templates
let selected_templates = dv.pages()
	.where(p => p.note_type == "page template")
	.where(p => String(selected_projectCategory).indexOf(p.projectCategory) != -1 || p.template_type == "All")
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
if(String(selected_projectCategory).indexOf("!Inbox")  <= 0) { 
await tp.user.embedPageToTarget(tp, selected_project.name, newFile, "# Notebook", "newFile", linkToHeading = false);
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
		frontmatter["projectCategory"] = String(selected_projectCategory);		(String(selected_projectCategory).indexOf("!Inbox")  <= 0) ? frontmatter["project"] = String(selected_project.link) : frontmatter["project"] = null;
        // Apply Default frontmatter
		frontmatter["people"] = null;
        frontmatter["topics"] = null;
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");
        frontmatter["created_by"] = user; 
        frontmatter["total_tasks"] = 0;
        frontmatter["completed_tasks"] = 0;
        frontmatter["incomplete_tasks"] = 0;
        // Apply projectCategory/Template Specific frontmatter
      })
_%>
