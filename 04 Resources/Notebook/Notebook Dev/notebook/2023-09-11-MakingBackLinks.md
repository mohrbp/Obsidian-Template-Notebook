---
Date: 2023-09-11
completed_tasks: 0
incomplete_tasks: 0
parent: None
sibling: None
topics: "[[03 Areas/Software/Obsidian/Obsidian|Obsidian]]"
total_tasks: 0
note_type: page
projectCategory: "null"
project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
created: 2023-09-11
---
# Notes
## Got it working
- Have an updated script in the [Child Note Template Dprc](01%20Home/2023/Notebook%20Design%20Docs/Templates/Depreciated/Child%20Note%20Template%20Dprc.md) that will embed in the previous note if there is one
	- Probably should just make this the "Child note template"
		- [2023-09-11-Parent](04%20Resources/Notebook/Notebook%20Dev/notebook/2023-09-11-Parent.md) and [2023-09-11-ShowingYouHowitsDone](04%20Resources/Notebook/Notebook%20Dev/notebook/2023-09-11-ShowingYouHowitsDone.md) are a demo
		- Needs a quick add script to make the new note in the same folder - and get the date and title
			- Frontmatter date is through templater

## Progress
- Well I broke everything, lets see if I can fix it. 
- WTF why didn't the date thing work?
	- {{Date}} might only trigger through quick add, which I thought that was?
- Also working with Dynamic Templater calls
	- [2023-09-12-Dynamic Template Code](04%20Resources/Notebook/Notebook%20Dev/notebook/2023-09-12-Dynamic%20Template%20Code.md)
		- Worked on this in my home notebooks, but this is working here too
			- Better in templater than as JS
- Getting Templater to make back links and edits to the Parent file
	- [Make Backlink](01%20Home/2023/Notebook%20Design%20Docs/Templates/Depreciated/Make%20Backlink.md)
		- This doesn't work right now
	- Tried Several things
		- Only the last one worked
- I think I'm just going to export that last one as a user script because I'll wanna do that a lot
```

## abstract file path
<%* 
let files = this.app.workspace.getLastOpenFiles();
let lastFile = this.app.vault.getAbstractFileByPath(files[0].split("/")); // t file
tR+= `you last file is: [[` + lastFile.basename +`]]`
%>

## Back history
<%*
    let last_file = ""
    let recent_leaf = this.app.workspace.getMostRecentLeaf();
    let back_history = recent_leaf.history.backHistory;
    //skip when there is no back history 
    //this can happen when the file gets created directly from the GUI
    if(back_history.length > 0) {
        // the last entry is the most recent file
        last_file = "[[" + back_history[back_history.length - 1].title + "]]";
    }    
    tR += last_file  ;
_%>

## Last open file
<%*
	function getLastOpenFile(){
		const lastActiveFile = app.workspace.lastActiveFile;

		// If the last active file is different from the current one, then it can be used
		if (lastActiveFile !== null && lastActiveFile.basename !== tp.file.title ) {
			const lastActiveFileBaseName = lastActiveFile.basename;
			console.log(`No match on last active file, using it!. (${lastActiveFileBaseName} !== ${tp.file.title})`);
			return lastActiveFileBaseName;
		}

		// If it's the same, then in the history the last opened one can be retrieved.
		const lastNameParts = app.workspace.recentFileTracker.lastOpenFiles[0].split("/");
		console.log( "Last active filed matched, using:", lastNameParts);
		const name = lastNameParts[lastNameParts.length-1].replaceAll(".md", "");

		return name;
	}
	
-%>
[[<% getLastOpenFile() %>]]

```
# Tasks

