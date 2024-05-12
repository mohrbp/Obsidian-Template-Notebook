async function refactorNote (tp, dv) {

// Regex for headers
let regexPattern = new RegExp("(?<level>#{1,6})\\s(?<header>.+?)\\n(?<content>.+?)(?:\\n#{1,6}|$)", "sg");

// Select Headers from the Board content
let boardContent = await dv.io.load(boardFile.file.path)
let boardMatch = [...boardContent.matchAll(regexPattern)];
let selectedBoardHeader = await tp.system.suggester((boardMatch) => boardMatch["groups"]["header"], boardMatch) 
let targetBoardHeader = await selectedBoardHeader["groups"]["level"] + " " + selectedBoardHeader["groups"]["header"];

}

module.exports = refactorNote;