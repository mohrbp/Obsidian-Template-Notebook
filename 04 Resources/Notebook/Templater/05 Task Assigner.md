<%* 
const dv = this.app.plugins.plugins["dataview"].api;

let recentFiles = dv.pages().file
					.where(p => p.frontmatter.note_type == "page" || p.frontmatter.note_type == "card")
					.where(p => (p.mtime).diffNow().as("minutes") > -(3*1400))
					.sort(p => p.mtime.diffNow(), "asc")
					.limit(500);

let suggestions1 = recentFiles.name;
let values1 = recentFiles;
let selected_File = await tp.system.suggester(suggestions1,values1);

// Create Task Content
let taskText = await tp.system.prompt("Enter Task Text");
let annotation = await tp.user.annotateTask(tp, dv);
let newTask = await taskText + " " + annotation;

/// Modify Note Content with Task
let selected_TFile = await tp.file.find_tfile(selected_File.path);
let selected_note_Content = await app.vault.read
(selected_TFile);

let taskContent = "# Tasks";
/// Add the target folder for subsequent experiments (if generated from the board)
let replacementTaskContent = await "# Tasks\n- [ ] " + newTask;
let targetNoteReplaced = selected_note_Content.replace(taskContent, replacementTaskContent);
await app.vault.modify(selected_TFile, targetNoteReplaced);
_%>