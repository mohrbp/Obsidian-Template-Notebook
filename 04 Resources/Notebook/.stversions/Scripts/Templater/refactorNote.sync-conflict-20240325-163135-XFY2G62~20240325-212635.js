async function refactorNote (tp, dv) {

let thisFile = tp.file.path(true);
// Regex for headers
let regexPattern = new RegExp("(?<level>#{1,6})\\s(?<header>.+?)\\n(?<content>.+?)(?:\\n#{1,6}|$)", "sg");

// Select Headers from the Board content
let parentNoteContent = await dv.io.load(thisFile)
let parentNoteMatches = [...parentNoteContent.matchAll(regexPattern)];
let selectedHeader = await tp.system.suggester((parentNoteMatches) => parentNoteMatches["groups"]["header"], parentNoteMatches) 
let targetBoardHeader = await selectedHeader["groups"]["level"] + " " + selectedHeader["groups"]["header"];

console.log(selectedHeader["groups"]["content"]);

const fileDateRegex = /(\d{4})(\d{2})(\d{2})/;
fileTitle = tp.file.path(true);
console.log(fileTitle);
console.log(thisFile)
const foundDate = fileTitle.match(fileDateRegex);
  if (foundDate) {
    // If the pattern is found, reformat the date
    return `${foundDate[1]}-${foundDate[2]}-${foundDate[3]}`;
  } else {
    // If the pattern is not found, return null or perhaps a custom message
    return null;
  }
console.log(foundDate);
let fileYear = foundDate.split("-")[1];
let fileDate = foundDate;
console.log(fileYear);
let fileName = fileDate + "-" + selectedHeader["groups"]["header"];
let filePath =  "01 Home/" + fileYear + "/" + fileDate + "/" + fileName;
console.log(filePath)
let selected_Template = "/04 Resources/Notebook/Note Templates/11 Notebook Page Template.md";
let new_Tfile = await tp.user.buildPageAndLink(tp, selected_Template, filePath, "/", false);


}

module.exports = refactorNote;