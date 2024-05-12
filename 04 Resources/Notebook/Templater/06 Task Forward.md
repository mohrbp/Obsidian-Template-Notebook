<%* 
const dv = this.app.plugins.plugins["dataview"].api;

let selectedText = tp.file.selection();
const taskRegex = /- \[ \] (.+?)(\n|$)/g;
let taskMatch = taskRegex.exec(selectedText);

if (taskMatch == null) {
console.log("No task selected");
} else {
let taskText = taskMatch[1].trim();

let taskDestination = await tp.system.suggester(["Recent Pages", "New Page", "New Card"], ["recent", "page", "card"]);
if (taskDestination == "recent"){
let recentFiles = dv.pages().file
					.where(p => p.frontmatter.note_type == "page" || p.frontmatter.note_type == "card")
					.where(p => (p.mtime).diffNow().as("minutes") > -(3*1400))
					.sort(p => p.mtime.diffNow(), "desc")
					.limit(500);

let suggestions1 = recentFiles.name;
let values1 = recentFiles;
selected_File = await tp.system.suggester(suggestions1,values1);
} else if (taskDestination == "page") {
let newPage = await tp.user.newPage(tp, dv);
selected_File = await dv.page(newPage.path).file;
} else if (taskDestination == "card") {
let newCard = await tp.user.newCard(tp, dv);
selected_File = await dv.page(newCard.path).file;
}

console.log(selected_File);
// Modify Task Content
let annotation = await tp.user.annotateTask(tp, dv);
let newTask = await taskText + " " + annotation;

/// Modify Note Content with Task
let selected_TFile = await tp.file.find_tfile(selected_File.path);
let selected_note_Content = await app.vault.read
(selected_TFile);

let taskContent = "# Tasks";
/// Add the target folder for subsequent experiments (if generated from the board)
let replacementTaskContent = await "# Tasks\n- [ ] " + newTask;
let targetNoteReplaced = await selected_note_Content.replace(taskContent, replacementTaskContent);
await app.vault.modify(selected_TFile, targetNoteReplaced);

// Update the forwarded task content
let forwardTask = await selected_File.link + " " + taskText;
let forwardBox = "- [>] ";
let originalText = "- [ ] " + taskText;
let updatedText = await selectedText.replace(originalText, (forwardBox + forwardTask));
selectedText = updatedText;
}
console.log("t");
tR += selectedText;
_%>