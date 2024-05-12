---
note_type: page
projectCategory: "null"
project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
people: 
topics: 
created: 2024-01-31T09:36
created_by: BMohr
total_tasks: 0
completed_tasks: 0
incomplete_tasks: 0
---
# Notes
## Problem
- Well documented that `require` and presumably other commonJs imports don't work on Mobile
	- https://forum.obsidian.md/t/dataviewjs-common-place-for-scripts-on-mobile/21546
	- https://forum.obsidian.md/t/help-reference-error-cant-find-variable-require-on-ios/66107/2
	- https://github.com/blacksmithgu/obsidian-dataview/discussions/2026
- Seems like it can be added through the CustomJS plugin by making a class
	- https://github.com/saml-dev/obsidian-custom-js
- Having a different scripting engine sitting outside of obsidian doesn't really solve (i.e run python scripts), because its for the dynamic views in the dataviewJS tables

### Additional Inbox problem
- Its kinda spammy showing all of my tasks
	- It needs to filter down a bit more aggressively
		- Maybe don't show subtasks
		- And only show tasks that have "#Tasks" as the heading
- Already filtering down to only pages and cards
- Also adding filtering down to just checkboxes under the `# Tasks` header and isn't a subtask
	- Idea is that you can indent tasks to remove them from the main view
```
dv.pages
.where(p => p.note_type === "page" || p.note_type === "card")

```
```
tasks
.where(t => t.link.subpath == "Tasks")
        // Only Parent Tasks, No Subtasks
        // Subtasks can still be accessed through parent
        .where(t => !t.hasOwnProperty("parent"));
```
- Can Add ` .where(t => t.status != ">")` to remove forwarded notes too

#### Also used the above for task filtering in Time Ruler plugin

# Tasks
- [x] Make a syncable version of the Inbox GTD for mobile ✅ 2024-03-04
- [x] Update Tasks filtering for consolidation ✅ 2024-03-18