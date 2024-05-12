---
note_type: card
projectCategory: 
project:
  - "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
people: 
topics: 
created: 2024-02-09T09:50:21-06:00
parent_project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev|Notebook Dev]]"
---
# Notebook

## Importing CSVs

### CSV Templating
- Headers are Case Sensitive
	- Not sure if they tolerate any special characters
		- Kinda think that makes the import more barebones
- Notes text is stringified in one (or more) ways so don't try to do too much
- Rupert's custom category exists too

## 2024-02-12-jsonToMarkdown
![2024-02-12-JsonToMarkdown](04%20Resources/Notebook/Notebook%20Dev/kanban/Update%20Asana%20Import/notebook/2024-02-12-JsonToMarkdown.md)

## Considerations
- Importing the structure of a notebook from an Asana board
	- Using JSON/CSV importer
		- I think the JSON is richer than the csv
		- Yeah but its a total pain in the butt to get the subtasks to make their own notes in the raw file
		- Its easier to edit the csv to add a compound path `parent/name/name` to make the file structure
	- Breifly poked around 
# Tasks

