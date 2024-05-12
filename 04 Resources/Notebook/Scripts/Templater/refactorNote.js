async function refactorNote (tp, dv) {

const { DateTime } = dv.luxon;
let thisFile = tp.file.path(true);
let thisTFile = tp.file.find_tfile(thisFile);
let fileTitle = tp.file.title;

// Regex for headers
// https://stackoverflow.com/a/6149823 - why use RegExp and ""
//let regexPattern = new RegExp("(?<level>#{1,6})\\s(?<header>.+?)\\n(?<content>.+?)\\n(?<nextLevel>#{1,6})\\s|$", "sg");

let regexPattern = new RegExp(
  "(?<level>#{1,6})\\s(?<header>.+?)\\n(?<content>[\\s\\S]+?)(?=\\n(?<nextLevel>#{1,3})\\s|$)",
  "g"
);
//let regexPattern = new RegExp("(?<level>#{1,6})\\s(?<header>.+?)\\n(?<content>.+?)(?:\\n#{1,6}|$)", "sg");


// Select Header to Refactor
let parentNoteContent = await dv.io.load(thisFile)

let parentNoteMatches = [...parentNoteContent.matchAll(regexPattern)];
console.log(parentNoteMatches)
let selectedHeader = await tp.system.suggester((parentNoteMatches) => parentNoteMatches["groups"]["header"], parentNoteMatches) 
console.log(selectedHeader)
// Find the Date in the title of the original note

const fileDateRegex = /(\d{4})-*(\d{2})-*(\d{2})/;

let dateCheck = "";
let created = tp.frontmatter.created;
if (typeof created !== 'undefined') {
  dateCheck = created;
  } else {
  dateCheck = fileTitle;
  }; 
let dateMatch = dateCheck.match(fileDateRegex);
  if (dateMatch) {
    console.log(dateMatch);
    // If the pattern is found, reformat the date
    foundDate = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
  } else {
    // If the pattern is not found, return null or perhaps a custom message
    return null;
  };

console.log(foundDate);
let fileYear = foundDate.split("-")[0];
let fileDate = foundDate;

// Select where to create the note
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

// Name and Create the New File
let fileName = fileDate + "-" + selectedHeader["groups"]["header"];
let filePath =  target_Folder + "/" + fileName;
console.log(filePath)
let selected_Template = "/04 Resources/Notebook/Note Templates/11 Notebook Page Template.md";
let new_Tfile = await tp.user.buildPageAndLink(tp, selected_Template, filePath, "/", false);
// Add the selected content to the new file
await tp.user.appendContentToTarget(tp, new_Tfile.path, "# Notes", "## " + selectedHeader["groups"]["header"] + "\n" + selectedHeader["groups"]["content"]);

// Apply Frontmatter to new file
await app.fileManager.processFrontMatter(
      new_Tfile,
      frontmatter => {
      // Remove Excess Template Frontmatter
      delete frontmatter['template_type'];

      // Update Template Frontmatter
      frontmatter["note_type"] = "page";
      (noteDest != "Inbox") ? frontmatter["projectCategory"] = String(selected_project.frontmatter.projectCategory) : frontmatter["projectCategory"] = null;
      (noteDest != "Inbox") ? frontmatter["project"] = String(selected_project.link) : frontmatter["project"] = null;
      
      // Apply Default frontmatter
      frontmatter["people"] = null;
      frontmatter["topics"] = null;
            // Apply projectCategory/Template Specific frontmatter

      frontmatter["created"] = DateTime.fromISO(fileDate);
      frontmatter["refactored"] = tp.date.now("YYYY-MM-DDTHH:mm");   

      //    frontmatter["created_by"] = user; 
      //    frontmatter["total_tasks"] = 0;
      //    frontmatter["completed_tasks"] = 0;
      //    frontmatter["incomplete_tasks"] = 0;
      })

// Update the current note with a link to the refactored note
let oldContent = selectedHeader["groups"]["level"] + " " + selectedHeader["groups"]["header"] + "\n" + selectedHeader["groups"]["content"];
let newContent = selectedHeader["groups"]["level"] + " " + selectedHeader["groups"]["header"] + "\n" + "![[" + new_Tfile.path + "|" + new_Tfile.basename + "]]";
let parentNoteReplaced = parentNoteContent.replace(oldContent, newContent);
await app.vault.modify(thisTFile, parentNoteReplaced);

}

module.exports = refactorNote;