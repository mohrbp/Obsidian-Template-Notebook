async function newPageRevised (tp, dv){

// Select where to create the note
let noteDest = await tp.system.suggester(["Inbox", "Projects", "Current Location"], ["Inbox", "Projects", "Current Location"]);
let selected_FilePath = "";
let fileYear = tp.date.now("YYYY");
let target_Folder = "01 Home/!Inbox/" + fileYear;

if (noteDest != "Inbox"){
selected_project = await tp.user.selectProjectRevised(tp, dv, noteDest);
target_Folder = selected_project.folder + "/notebook";
}

let selected_Template = "/04 Resources/Notebook/Note Templates/11 Notebook Page Revised Template.md";

// Write File Name and add Folder Path
let fileName = await tp.system.prompt("Enter Note Name");
let fullName = tp.date.now("YYYY-MM-DD") + "-" + fileName;
let filePath = await target_Folder + "/" + fullName + "/" + fullName;
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
		(noteDest != "Inbox") ? frontmatter["project"] = String(selected_project.frontmatter.project) : frontmatter["project"] = null;
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

 module.exports = newPageRevised;