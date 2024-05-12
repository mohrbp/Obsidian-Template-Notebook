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

let fileName = formatDate(tp.file.path());
console.log(fileName)

}

module.exports = refactorNote;