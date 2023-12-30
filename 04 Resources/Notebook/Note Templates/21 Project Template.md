---
note_type: project template
projectCategory: 
template_type: All
---
<%*
// Template project setup 
// Build project Folder Structure
await this.app.vault.createFolder(tp.file.folder(true) + "/notebook");
await this.app.vault.createFolder(tp.file.folder(true) + "/experiments");
_%>
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
FROM "<%tp.file.path(true)%>"
WHERE file !=this.file
WHERE file.ext != "md"
SORT file.ctime DESC
```

