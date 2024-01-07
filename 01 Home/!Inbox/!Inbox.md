---
created: '2023-12-27 03:39:16'
created_by: BMohr
note_type: projectCategory
people: None
projectCategory: '[[01 Home/!Inbox/!Inbox.md|!Inbox]]'
topics: None
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

