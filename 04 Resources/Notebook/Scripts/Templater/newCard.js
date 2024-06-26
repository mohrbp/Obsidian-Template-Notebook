async function newCard (tp, dv){


const today = tp.date.now("YYYY-MM-DD");
// Select a projectCategory
selected_project = await tp.user.selectProject(tp, dv, false);

let target_Folder = await selected_project.folder;
let projectBoard = await selected_project.frontmatter.board;
console.log("projectBoard", projectBoard);
const wikiLinkRegex = /\[\[([^|\]]+)(?:\|[^|\]]+)?\]\]/;
let boardPath = String(projectBoard).match(wikiLinkRegex)[1];
console.log("boardPath", boardPath);
let boardFile = await dv.page(`${boardPath}`);
console.log("boardFile", boardFile);
let boardType = await boardFile.file.frontmatter.board_type;
console.log("boardType", boardType);

/// Get the Template for Cards
if (boardType == "experiments") {
cardTemplate = "04 Resources/Notebook/Note Templates/24 Experiment Card Template.md"
} else if (boardType == "kanban") {
cardTemplate = "04 Resources/Notebook/Note Templates/24 Kanban Card Template.md"
}

// Write File Name and add Folder Path
let fileName = await tp.system.prompt("Enter Card Name");
let filePath = await target_Folder + "/" + boardType + "/" + fileName;
console.log("filePath", filePath);
// Build new file
let new_Tfile = await tp.user.buildPageAndLink(tp, cardTemplate, filePath, "/", false);
//console.log("newFile", newFile);
//(boardType == "experiments") ? new_FileName = (target_Folder + "/" + boardType + "/" + today + "-" + fileName + "/" + today + "-" + fileName) : new_FileName = (target_Folder + "/" + boardType + "/" + fileName + "/" + fileName);
//console.log("new_FileName", new_FileName);
//let new_Tfile = await tp.file.find_tfile(new_FileName);
console.log("new_Tfile", new_Tfile);
let newFilePath = await new_Tfile.path;
console.log("newFilePath", newFilePath);
let newFileName = new_Tfile.basename;
console.log("newFileName", newFileName);
// Link to experiment Board
let expPath = await target_Folder + "/" + boardType + "/" + boardType;
let exp_TF = await tp.file.find_tfile(expPath);
let expContent = await app.vault.read(exp_TF);

// Regex for headers
let regexPattern = new RegExp("(?<level>#{1,6})\\s(?<header>.+?)\\n(?<content>.+?)(?:\\n#{1,6}|$)", "sg");

// Select Headers from the Board content
let boardContent = await dv.io.load(boardFile.file.path)
let boardMatch = [...boardContent.matchAll(regexPattern)];
let selectedBoardHeader = await tp.system.suggester((boardMatch) => boardMatch["groups"]["header"], boardMatch) 
let targetBoardHeader = await selectedBoardHeader["groups"]["level"] + " " + selectedBoardHeader["groups"]["header"];

let targetContent = targetBoardHeader;
//let targetContent = "## To-Do";
let replacementContent = await targetContent + "\n- [ ] " + "[[" + newFilePath + "|" + newFileName + "]]";
/// Modify experiment Board
let targetNoteReplaced = await expContent.replace(targetContent, replacementContent);
await app.vault.modify(exp_TF, targetNoteReplaced);

return new_Tfile
}

module.exports = newCard;