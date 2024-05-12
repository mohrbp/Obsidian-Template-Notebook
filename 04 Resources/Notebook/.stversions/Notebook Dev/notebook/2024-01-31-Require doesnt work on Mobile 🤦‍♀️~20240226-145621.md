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
# Tasks
- [ ] Make a syncable version of the Inbox GTD for mobile ⏳ 2024-02-24 