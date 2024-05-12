async function newBoard (tp, dv, selected_project){

// Build Linked Experiment Kanban Board
// Load Utilities		
//var dataviewUtils = require(app.vault.adapter.basePath + "/04 Resources/Notebook/Scripts/Dataview/utils.js");
//let user = dataviewUtils.userInfo();


// Load the Project File where the Board is being created
let target_Folder = selected_project.folder;
let project_TFile = await tp.file.find_tfile(selected_project.name);
target_Folder = selected_project.folder;

// Select Board Type

let selected_BoardType = await tp.system.suggester(["Experiment", "Kanban"], ["experiments", "kanban"]);

let boardPath = await target_Folder + "/" + selected_BoardType + "/" + selected_BoardType;

/// Get the Template for Cards
if (selected_BoardType == "experiments") {
boardTemplate = "/04 Resources/Notebook/Note Templates/23 Kanban Board Template.md";
cardTemplate = "04 Resources/Notebook/Note Templates/24 Experiment Card Template.md"
} else if (selected_BoardType == "kanban") {
boardTemplate = "/04 Resources/Notebook/Note Templates/23 Kanban Board Template.md";
cardTemplate = "04 Resources/Notebook/Note Templates/24 Kanban Card Template.md"
}


let newBoard_TFile = await tp.user.buildPageAndLink(tp, boardTemplate, boardPath, "/", false); 
let newBoard = newBoard_TFile.basename;

// Apply Frontmatter to new Board
await app.fileManager.processFrontMatter(
      newBoard_TFile,
      frontmatter => {
		// Remove Excess Template Frontmatter
		delete frontmatter['template_type'];
		// Update Template Frontmatter
		frontmatter["note_type"] = "board";
		frontmatter["board_type"] = selected_BoardType;
		// Update project Frontmatter
		frontmatter["projectCategory"] = String(selected_project.frontmatter.projectCategory);	
		frontmatter["project"] = "[[" + project_TFile.path + "|" + project_TFile.basename + "]]";
            // Apply Default frontmatter
        	frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm");
     	  //	frontmatter["created_by"] = user; 
        // Apply projectCategory/Template Specific frontmatter
      })

/// Modify Kanban Setings
let note_Content_EX = await app.vault.read(newBoard_TFile);

let kanbanSettings = '%% kanban:settings\n```\n{"kanban-plugin":"basic"}\n```\n%%';
/// Add the target folder for subsequent experiments (if generated from the board)
let kanbanSettingsUpdated = await '%% kanban:settings\n```\n{"kanban-plugin":"basic", "new-note-folder":"'+ target_Folder + '/' + selected_BoardType + '", "new-note-template":"' + cardTemplate + '"}\n```\n%%';

let targetNoteReplaced = note_Content_EX.replace(kanbanSettings, kanbanSettingsUpdated);
await app.vault.modify(newBoard_TFile, targetNoteReplaced);

// Apply Frontmatter to Project File
await app.fileManager.processFrontMatter(
      project_TFile,
      frontmatter => {
		frontmatter["board"] = "[[" + newBoard_TFile.path + "|" + newBoard_TFile.basename + "]]";
      })

}
module.exports = newBoard;