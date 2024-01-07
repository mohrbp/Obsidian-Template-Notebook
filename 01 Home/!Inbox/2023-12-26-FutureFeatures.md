---
completed_tasks: 0
created: 2023-12-27T01:46:00
created_by: BMohr
incomplete_tasks: 0
note_type: page
projectCategory: "[[01 Home/!Inbox/!Inbox.md|!Inbox]]"
people: 
project: []
topics: 
total_tasks: 0
---
# Notes

### PDF Extraction
[2024-01-02-PDF Extraction](01%20Home/!Inbox/2024-01-02-PDF%20Extraction.md)
{% if annotation.comment %}{{annotation.comment}}{% endif %}{% endif %}
> {%- if annotation.imageRelativePath %}![[{{annotation.imageRelativePath}}]]{%- endif %}

`$=dv.current()['total_tasks']`

### Table of Buttons for Hotkeys
https://forum.obsidian.md/t/using-metaedit-buttons-templater-nldates-and-dataview-together/35911
https://www.reddit.com/r/ObsidianMD/comments/rre6wk/button_to_add_or_substract_from_yaml_or_dataview/

```dataviewjs
    dv.view("04 Resources/Notebook/Buttons/increment", {"target": "total_tasks"})
```

| ![New Task\|clean no-title no-link](04%20Resources/Notebook/Buttons/New%20Task.md) | ![New Card\|clean no-title no-link](04%20Resources/Notebook/Buttons/New%20Card.md) | ![New Page\|clean no-title no-link](04%20Resources/Notebook/Buttons/New%20Page.md) |
| ---- | ---- | ---- |
### Templater commands in templates
https://forum.obsidian.md/t/buttons-with-templater-code-in-templater-template/70068

### Task color formatting

	task.visual = `<span style= "font-size:8pt; color:red;">${task.text.replace(/[📅📆⌛⏳].*$/g, "")}</span>`;

### Progress bar for Kanban
### Dataview to reuse code
- recognizes dv.current()
```
dv.executeJs(await dv.io.load("04 Resources/Notebook/Scripts/recentlyCreated.js"))
```

Or use dv.view to load in arguments, which can include front matter
- Do you have an example of this?
- ![](01%20Home/!Inbox/attachments/Screenshot%202023-12-29%20at%2016-47-06%20r_ObsidianMD%20-%20Using%20dataview.js%20how%20can%20you%20get%20myArg%20from%20a%20dv.view('my_script'%20{myArg%201}).png)


### Topics
- Probably don't have a notebook
- Probably more or less nested tags - though they can be multiply nested
	- Want the parent tags to apply to all child tags - will need to do a back lookup through "parent", which could be an issue
		- Does that lookup need to be iterative? 
	- Could just add all parent topics to the new topic on note creation
		- Moving the note gets tricky, because then do you erase all parent topics? Replace? Only some?, what about things you added prior to moving the note?
# Tasks
- [ ] Dv.taskList at the top of notebook files, so you can check notes with completion date (and time?) 
- [ ] Daily note of burnt in dataview summary of the day 
- [x] Adjustable time limits based on front matter of the projects ✅ 2024-01-03
- [ ] Notes in Callouts
- [x] Re-usable JS code for DV ✅ 2024-01-03
- [ ] People Pages
- [ ] Topics

bar:: <progress max=100 value=40> </progress> 0%