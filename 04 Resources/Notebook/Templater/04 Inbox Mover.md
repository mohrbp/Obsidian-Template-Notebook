<%* 
const dv = this.app.plugins.plugins["dataview"].api;

let recentFiles = dv.pages().file
					.where(p => p.frontmatter.note_type == "page")
					.where(p => String(p.frontmatter.projectCategory).indexOf("!Inbox")  !== -1)
					.sort(p => p.mtime.diffNow(), "asc")
					.limit(100);

let suggestionsR = recentFiles.name;
let valuesR = recentFiles;
let selected_File = await tp.system.suggester(suggestionsR,valuesR);

let all_projectCategorys = dv.pages()
	.where(p => p.note_type == "projectCategory")
	.where(p => String(p.projectCategory).indexOf("!Inbox")  <= 0)
	.file.sort(n => n.name);
let suggestions1 = all_projectCategorys.name;
let values1 = all_projectCategorys;
let selected_projectCategory = await tp.system.suggester(suggestions1,values1);

let target_Folder;
let selected_project;
/// Choose from all projects that contain that projectCategory
/// Does not only include projects from that folder
/// Match is fuzzy
let selected_projects = dv.pages()
	.where(p => p.note_type == "projectCategory" || p.note_type == "project")
	.where(p => String(selected_projectCategory.link).indexOf(p.projectCategory) !== -1 || p.template_type == "All")
	.file.sort(n => n.name);
let suggestions2 = selected_projects.name;
let values2 = selected_projects;
selected_project = await tp.system.suggester(suggestions2,values2);
/// Trimming the filepath from the Folder Note and finding the notebook for this project
let selected_FilePath = selected_project.folder;
target_Folder = selected_FilePath;

let moved_Tfile = await tp.file.find_tfile(selected_File.name);
await tp.file.move(selected_FilePath + "/notebook/" + selected_File.name, moved_Tfile);

await tp.user.embedPageToTarget(tp, selected_project.name, selected_File.name, "# Notebook", "selected_File.name", linkToHeading = false);

await app.fileManager.processFrontMatter(
      moved_Tfile,
      frontmatter => {
		// Remove Excess Template Frontmatter
		// Update Template Frontmatter
		frontmatter["projectCategory"] = String(selected_projectCategory.link);		frontmatter["project"] = String(selected_project.link)
        // Apply projectCategory/Template Specific frontmatter
      });
_%>

