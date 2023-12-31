---
note_type: projectCategory
projectCategory: "[[!Inbox|!Inbox]]"
people: 
topics: 
created: 2023-12-26T21:39:16-06:00
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
### Documents (non-markdown)
```dataview
TABLE file.ext as "File Extension", file.ctime as Created
FROM "01 Home/!Inbox"
WHERE file !=this.file
WHERE file.ext != "md"
SORT file.ctime DESC
```

