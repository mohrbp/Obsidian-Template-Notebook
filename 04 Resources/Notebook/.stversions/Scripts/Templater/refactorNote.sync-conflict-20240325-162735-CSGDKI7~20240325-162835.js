async function refactorNote (tp, dv) {

function formatDate(string) {
  // This regex matches exactly 8 digits in a row
  const regex = /(\d{4})(\d{2})(\d{2})/;
  
  // Search for the pattern in the provided string
  const found = string.match(regex);

  if (found) {
    // If the pattern is found, reformat the date
    return `${found[1]}-${found[2]}-${found[3]}`;
  } else {
    // If the pattern is not found, return null or perhaps a custom message
    return null;
  }
}

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
fileTitle = tp.file.path();
const foundDate = fileTitle.match(fileDateRegex);
  if (foundDate) {
    // If the pattern is found, reformat the date
    return `${foundDate[1]}-${foundDate[2]}-${foundDate[3]}`;
  } else {
    // If the pattern is not found, return null or perhaps a custom message
    return null;
  }

let fileYear = foundDate.split("-")[1];
let fileDate = foundDate;
let fileName = fileDate + "-" + selectedHeader["groups"]["header"];
let filePath =  "01 Home/" + fileYear + "/" + fileDate + "/" + fileName;
console.log(filePath)
let selected_Template = "/04 Resources/Notebook/Note Templates/11 Notebook Page Template.md";
let new_Tfile = await tp.user.buildPageAndLink(tp, selected_Template, filePath, "/", false);


}

module.exports = refactorNote;