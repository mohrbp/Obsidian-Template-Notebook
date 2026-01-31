---
noteBook: "[[Note Templates]]"
noteType: "[[Project Template|Project Note]]"
branchTemplate1: "[[Project Template|Project Note]]"
leafTemplate1: "[[Notebook Page Template|Note Page]]"
leafTemplate2: "[[Folder Note Page Template|Folder Note]]"
leafTemplate3: "[[Task Template|Task]]"
leafFolder1: notebook
leafFolder2: notebook
leafFolder3: tasks
aliases:
  - Projects
dated: false
folderNote: true
---
<%*
// Build project Folder Structure
await this.app.vault.createFolder(tp.file.folder(true) + "/notebook");
_%>
# Project Summary
### Tasks
``` dataviewjs
    dv.view("00 Config/Scripts/Dataview/tasksGTD", {"target": dv.current().file.link})
```
### Files
#### Multi-Column
``` dataviewjs
    dv.view("00 Config/Scripts/Dataview/multicolumn_new", {"target": dv.current().file.link})
```
#### Sub Branches
``` dataviewjs
    dv.view("00 Config/Scripts/Dataview/notesQuery_new", {"target": dv.current().file.link, "include": true, "traversalType": "child_branch"})
```
#### Direct Leaves
#### All Leaves
``` dataviewjs
    dv.view("00 Config/Scripts/Dataview/notesQuery_new", {"target": dv.current().file.link, "include": true, "traversalType": "child", "limit": 100})
```

