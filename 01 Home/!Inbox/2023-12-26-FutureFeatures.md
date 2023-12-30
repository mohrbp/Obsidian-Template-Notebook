---
note_type: atomic
pcode: "[[01 Home/!Inbox/!Inbox.md|!Inbox]]"
project: 
people: 
topics: 
created: 2023-12-26T19:46:16-06:00
created_by: BMohr
total_tasks: 0
completed_tasks: 0
incomplete_tasks: 0
---
# Notes

### Task color formatting

	task.visual = `<span style= "font-size:8pt; color:red;">${task.text.replace(/[📅📆⌛⏳].*$/g, "")}</span>`;

### Progress bar for Kanban
bar:: <progress max=100 value=40> </progress> 0%

### Dataview to reuse code
- recognizes dv.current()
```
dv.executeJs(await dv.io.load("04 Resources/Notebook/Scripts/recentlyCreated.js"))
```

Or use dv.view to load in arguments, which can include front matter
- Do you have an example of this?


### Topics
- Probably don't have a notebook
- Probably more or less nested tags - though they can be multiply nested
	- Want the parent tags to apply to all child tags - will need to do a back lookup through "parent", which could be an issue
		- Does that lookup need to be iterative? 
	- Could just add all parent topics to the new topic on note creation
		- Moving the note gets tricky, because then do you erase all parent topics? Replace? Only some?, what about things you added prior to moving the note?
# Tasks
- [ ] Dv.taskList at the top of notebook files, so you can check notes with completion date (and time?)  ⌛ 2023-12-27 
- [ ] Daily note of burnt in dataview summary of the day ⌛ 2023-12-27 
- [ ] Adjustable time limits based on front matter of the projects
- [ ] Notes in Callouts
- [ ] Re-usable JS code for DV
- [ ] People Pages
- [ ] Topics
