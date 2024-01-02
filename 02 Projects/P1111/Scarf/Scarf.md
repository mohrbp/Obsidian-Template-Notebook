---
note_type: project
projectCategory: "[[P1111]]"
project: "[[02 Projects/P1111/Scarf/Scarf.md|Scarf]]"
parent_project: "[[02 Projects/P1111/P1111.md|P1111]]"
people: 
topics: 
created: 2024-01-02T13:27:55-06:00
created_by: BMohr
---
# Notebook
## 2024-01-02-Wrapping
 ![[2024-01-02-Wrapping]]

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
FROM "02 Projects/P1111/Scarf/Scarf.md"
WHERE file !=this.file
WHERE file.ext != "md"
SORT file.ctime DESC
```

