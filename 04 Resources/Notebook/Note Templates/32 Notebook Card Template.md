---
note_type: Experiment Template
template_type: All
---
<%*
// Template Experiment setup 
// Build Experiment Folder Structure
const user = "BMohr";
let folder = tp.file.folder(true);
let fileName = tp.file.title;
let today = tp.date.now("YYYY-MM-DD");
let newPath = folder + "/" + today + "-" + fileName;
await tp.file.move(newPath + "/" + today + "-" + fileName);
await this.app.vault.createFolder(newPath + "/data");
await this.app.vault.createFolder(newPath + "/analysis");

let projectFile = folder.split("/experiments")[0] + "/" + folder.split("/").reverse()[1];
// Link to Target Project
await tp.user.embedPageToTarget(tp, projectFile, (newPath + "/" + today + "-" + fileName), "# Notebook", today + "-" + fileName, linkToHeading = false); 

// Update Experiment Frontmatter
let pcode = "[[" + folder.split("/").slice(1,2) + "|" + folder.split("/")[1] + "]]";
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
		frontmatter["note_type"] = "Experiment";
		frontmatter["PCode"] = pcode;
		frontmatter["project"] = project;
		// Update Project Frontmatter
        // Apply Default frontmatter
		frontmatter["people"] = null;
        frontmatter["topics"] = null;
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");
  })
  // needs to be at least 2500 or else it erases the existing template info
  }, 3500) _%>