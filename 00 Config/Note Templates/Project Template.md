---
noteBook: "[[Note Templates]]"
noteType: "[[Project Template|Project Note]]"
branchTemplate: 
- "[[Project Template|Project Note]]"
leafTemplate: 
- "[[Notebook Page Template|Note Page]]"
- "[[Folder Note Page Template|Folder Note]]"
aliases:
  - Projects
dated: false
folderNote: true
folder:
created: 2024-09-01T22:28:53Z
modified: 2025-01-05T16:27:30Z
---
<%*
// Build project Folder Structure
await this.app.vault.createFolder(tp.file.folder(true) + "/notebook");
_%>
# Project Summary

``` dataviewjs
    dv.view("00 Home/Notebook Config/Scripts/Dataview/notesQuery", {"target": dv.current().file.link})
```

``` dataviewjs
    dv.view("00 Home/Notebook Config/Scripts/Dataview/notesQuery", {"target": dv.current().file.link, "include": true})
```

``` dataviewjs
    dv.view("00 Home/Notebook Config/Scripts/Dataview/multicolumn", {"target": dv.current().file.link})
```

