<%* 
const dv = this.app.plugins.plugins["dataview"].api;

// Select a card
let recentCards = dv.pages().file
					.where(p => p.frontmatter.note_type == "card")
					.sort(p => p.mtime.diffNow(), "asc")
					.limit(100);
let suggestionsCards = recentCards.name;
let valuesCards = recentCards;
let selectedCard = await tp.system.suggester(suggestionsCards,valuesCards);

// Select a board to send it to
let recentBoards = dv.pages().file
	.where(p => p.frontmatter.note_type == "board")
	.sort(p => p.mtime.diffNow(), "asc");
let suggestionsBoard = recentBoards.folder;
let valuesBoard = recentBoards;
let selectedBoard = await tp.system.suggester(suggestionsBoard,valuesBoard);

// Regex for headers
let regexPattern = new RegExp("(?<level>#{1,6})\\s(?<header>.+?)\\n(?<content>.+?)(?:\\n#{1,6}|$)", "sg");

// Select Headers from the Board content
let boardContent = await dv.io.load(selectedBoard.path)
let boardMatch = [...boardContent.matchAll(regexPattern)];
let selectedBoardHeader = await tp.system.suggester((boardMatch) => boardMatch["groups"]["header"], boardMatch) 
let targetBoardHeader = await selectedBoardHeader["groups"]["level"] + " " + selectedBoardHeader["groups"]["header"];

// Create the child note
// Find and Select Templates
let selected_templates = dv.pages()
	.where(p => p.note_type == "page template")
	.file.sort(n => n.name);
let suggestionsTemplates = selected_templates.name;
let valuesTemplates = selected_templates.path;
let selectedTemplate = await tp.system.suggester(suggestionsTemplates,valuesTemplates);	

// Write File Name from the Card and add Folder Path from the Board
let fileName = await selectedCard.name;
let filePath = await selectedBoard.folder + "/" + fileName + "/" + fileName;
// Build new file
let new_Tfile = await tp.user.buildPageAndLink(tp, selectedTemplate, filePath, "/", false); 
let newFile = new_Tfile.basename;

// Add the new file to the target board
let newFileName = await new_Tfile.basename;
console.log(newFileName);
await tp.user.appendContentToTarget(tp, selectedBoard.path, targetBoardHeader, "- [ ] " + "[[" + newFileName + "]]")

// Add content from the parent file to the card
// Select which header to copy from Card content
let cardContent = await dv.io.load(selectedCard.path)
let cardMatch = await [...cardContent.matchAll(regexPattern)];
let selectedCardHeader = await tp.system.suggester((cardMatch) => cardMatch["groups"]["header"], cardMatch);

let cardContentForward = await selectedCardHeader["groups"]["content"];

// Add selected header content from prior note to this note
await tp.user.appendContentToTarget(tp, new_Tfile.path, "# Notes", cardContentForward)

// Transclude this new note in the parent note
await tp.user.appendContentToTarget(tp, selectedCard.path, "# Child", "![[" + new_Tfile.path + "|" + new_Tfile.basename + "]]\n")
_%>

