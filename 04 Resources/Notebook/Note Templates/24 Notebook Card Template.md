---
note_type: card template
template_type: All
---
<%*
// Template experiment setup 
// Build experiment Folder Structure
const user = "BMohr";
let folder = tp.file.folder(true);
let fileName = tp.file.title;
let today = tp.date.now("YYYY-MM-DD");
let newPath = folder + "/" + today + "-" + fileName;
await tp.file.move(newPath + "/" + today + "-" + fileName);
await this.app.vault.createFolder(newPath + "/data");
await this.app.vault.createFolder(newPath + "/analysis");

let projectFile = folder.split("/experiments")[0] + "/" + folder.split("/").reverse()[1];
// Link to Target project
await tp.user.embedPageToTarget(tp, projectFile, (newPath + "/" + today + "-" + fileName), "# Notebook", today + "-" + fileName, linkToHeading = false); 

// Update experiment Frontmatter
let projectCategory = folder.split("/")[0] + "/" + folder.split("/")[1] + "/" + folder.split("/")[1];
let projectCategory_TFile = await tp.file.find_tfile(projectCategory)
let project = "[[" + projectFile + "|" + folder.split("/").reverse()[1] + "]]";
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
		frontmatter["projectCategory"] = "[[" + projectCategory_TFile.path + "|" + projectCategory_TFile.basename + "]]";
		frontmatter["project"] = project;
		// Update project Frontmatter
        // Apply Default frontmatter
		frontmatter["people"] = null;
        frontmatter["topics"] = null;
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");
  })
  // needs to be at least 2500 or else it erases the existing template info
  }, 3500) _%>