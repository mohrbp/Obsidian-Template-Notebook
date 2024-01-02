---
note_type: project
projectCategory: "[[P1270 Words]]"
project: "[[02 Projects/P1270 Words/Project 1/Project A/Project A.md|Project A]]"
parent_project: "[[02 Projects/P1270 Words/Project 1/Project 1.md|Project 1]]"
people: 
topics: 
created: 2024-01-02T12:00:16-06:00
created_by: BMohr
---
# Notebook

# Notes
## Recent Notes 
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/recentlyModified", {"target": dv.current().note_type})
```
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/recentlyCreated", {"target": dv.current().note_type})
```
# Files 
## Documents (non-markdown)
```dataview
TABLE file.ext as "File Extension", file.ctime as Created
FROM "02 Projects/P1270 Words/Project 1/Project A/Project A.md"
WHERE file !=this.file
WHERE file.ext != "md"
SORT file.ctime DESC
```

