---
note_type: card template
template_type: All
---
<%*
// Template experiment setup 
// Build experiment Folder Structure
const dv = this.app.plugins.plugins["dataview"].api;
var dataviewUtils = require(app.vault.adapter.basePath + "/04 Resources/Notebook/Scripts/Dataview/utils.js");

let folder = tp.file.folder(true);
let fileName = tp.file.title;
let today = tp.date.now("YYYY-MM-DD");
let newPath = folder + "/" + today + "-" + fileName;
await tp.file.move(newPath + "/" + today + "-" + fileName);
await this.app.vault.createFolder(newPath + "/analysis");
await this.app.vault.createFolder(newPath + "/data");
await this.app.vault.createFolder(newPath + "/notebook");

let projectFile = dataviewUtils.selectParentMarkdownFile(folder);
let projectFileDV = dv.page(projectFile);
// Link to Target project
await tp.user.embedPageToTarget(tp, projectFile, (newPath + "/" + today + "-" + fileName), "# Notebook", "## ", linkToHeading = false); 

// Update experiment Frontmatter
let projectCategory = projectFileDV.file.frontmatter.projectCategory;
let project = projectFileDV.file.frontmatter.project;
_%>
# Notes

# Tasks

<%*
  let newFile = await tp.file.find_tfile(tp.file.path(true))
setTimeout(() => {
  // Process the frontmatter
  app.fileManager.processFrontMatter(newFile, (frontmatter) => {
    // Add a new field
		delete frontmatter['template_type'];
		// Update Template Frontmatter
		frontmatter["note_type"] = "card";
		(projectFileDV == null) ? frontmatter["projectCategory"] = null : frontmatter["projectCategory"] = projectCategory;
		frontmatter["project"] = project;
		// Update project Frontmatter
        // Apply Default frontmatter
		frontmatter["people"] = null;
        frontmatter["topics"] = null;
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");
  })
  // needs to be at least 2500 or else it erases the existing template info
  }, 3500) _%>