---
note_type: projectCategory
projectCategory: "[[02 Projects/P1270 Words/P1270 Words.md|P1270 Words]]"
created: 2024-01-02T11:59:48-06:00
created_by: BMohr
---
# Tasks 
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/tasksGTD", {"target": dv.current().note_type})
```
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
FROM "02 Projects/P1270 Words/P1270 Words.md"
WHERE file !=this.file
WHERE file.ext != "md"
SORT file.ctime DESC
```

