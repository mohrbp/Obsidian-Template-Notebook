---
note_type: page
projectCategory: "null"
project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
people: 
topics: 
created: 2024-05-08T12:12
---
# Notes
- I've been considering re-building the basic note as part of the broader move towards the "boards" view instead of using the Kanban plugin
- Need to consider how you would use it more widely


### Some buttons stuff

``` dataviewjs
const button = dv.el('button', 'Prompt');

button.onclick = () => {
    const userInput = prompt("Enter something:");

    if (userInput !== null) {
        const editor = app.workspace.getActiveFile().editor;
        editor.replaceSelection(userInput + '\n');
    }
};

dv.span(button);
```
- Prompts gonna be hard
	- https://forum.obsidian.md/t/initial-query-for-suggestmodal/62872/3
	- https://rwblickhan.org/technical/obsidian-plugin/
		- You can build one with fuzzy find, but still somewhat difficult to implement witohut templater
# Tasks
- [ ] Rebuild new page for all folder notes all the time - for attachments
- [ ] Update "User" to just include your own name in people - great for sharing