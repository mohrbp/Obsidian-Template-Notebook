<%* 
const dv = this.app.plugins.plugins["dataview"].api;

let recentFiles = dv.pages().file
					.where(p => p.frontmatter.note_type == "atomic")
					.where(p => String(p.frontmatter.PCode).indexOf("!Inbox")  !== -1)
					.sort(p => p.mtime.diffNow(), "asc")
					.limit(100);

let suggestionsR = recentFiles.name;
let valuesR = recentFiles;
let selected_File = await tp.system.suggester(suggestionsR,valuesR);

let all_PCodes = dv.pages()
	.where(p => p.note_type == "PCode")
	.where(p => String(p.PCode).indexOf("!Inbox")  <= 0)
	.file.sort(n => n.name);
let suggestions1 = all_PCodes.name;
let values1 = all_PCodes;
let selected_PCode = await tp.system.suggester(suggestions1,values1);

let target_Folder;
let selected_Project;
/// Choose from all projects that contain that Pcode
/// Does not only include projects from that folder
/// Match is fuzzy
let selected_projects = dv.pages()
	.where(p => p.note_type == "PCode" || p.note_type == "Project")
	.where(p => String(selected_PCode.link).indexOf(p.PCode) !== -1 || p.template_type == "All")
	.file.sort(n => n.name);
let suggestions2 = selected_projects.name;
let values2 = selected_projects;
selected_Project = await tp.system.suggester(suggestions2,values2);
/// Trimming the filepath from the Folder Note and finding the Notebook for this project
let selected_FilePath = selected_Project.folder;
target_Folder = selected_FilePath;

let moved_Tfile = await tp.file.find_tfile(selected_File.name);
await tp.file.move(selected_FilePath + "/notebook/" + selected_File.name, moved_Tfile);

await tp.user.embedPageToTarget(tp, selected_Project.name, selected_File.name, "# Notebook", "selected_File.name", linkToHeading = false);

await app.fileManager.processFrontMatter(
      moved_Tfile,
      frontmatter => {
		// Remove Excess Template Frontmatter
		// Update Template Frontmatter
		frontmatter["PCode"] = String(selected_PCode.link);		frontmatter["project"] = String(selected_Project.link)
        // Apply PCode/Template Specific frontmatter
      });
_%>

