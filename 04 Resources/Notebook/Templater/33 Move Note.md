<%*
const dv = this.app.plugins.plugins["dataview"].api;
const { DateTime } = dv.luxon;
let thisFile = tp.file.path(true);
let thisTFile = tp.file.find_tfile(thisFile);
let fileTitle = tp.file.title;

const fileDateRegex = /(\d{4})-(\d{2})-(\d{2})/;

fileYear = "";
fileCreated = "";
let created = tp.frontmatter.created;
if (typeof created !== 'undefined') {
console.log(created);
fileYear = created.split("-")[0];
} else {
fileCreated = fileTitle.match(fileDateRegex)[0]
fileYear = fileCreated.split("-")[0];
}
console.log(fileYear);
let noteDest = await tp.system.suggester(["Inbox", "Projects"], ["Inbox", "Projects"]);
let selected_FilePath = "";
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
} 
target_Folder = selected_project.folder + "/notebook";
} 

// Apply Frontmatter to new file
await app.fileManager.processFrontMatter(
      thisTFile,
      frontmatter => {
      // Remove Excess Template Frontmatter
      delete frontmatter['template_type'];

      // Update Template Frontmatter
      frontmatter["note_type"] = "page";
      (noteDest != "Inbox") ? frontmatter["projectCategory"] = String(selected_project.frontmatter.projectCategory) : frontmatter["projectCategory"] = null;
      (noteDest != "Inbox") ? frontmatter["project"] = String(selected_project.link) : frontmatter["project"] = null;

      if (typeof created == 'undefined'){frontmatter["created"] = fileCreated};  

      //    frontmatter["created_by"] = user; 
      //    frontmatter["total_tasks"] = 0;
      //    frontmatter["completed_tasks"] = 0;
      //    frontmatter["incomplete_tasks"] = 0;
      })
      
let noteContent =  await dv.io.load(thisFile)
noteReplaced = noteContent.replace("# Content\n", "# Notes\n");
noteReplaced_2 = noteReplaced.replace("# Action Items\n", "# Tasks\n");
await app.vault.modify(thisTFile, noteReplaced_2);

let filePath =  target_Folder + "/" + fileTitle;
await tp.file.move(filePath);

%>