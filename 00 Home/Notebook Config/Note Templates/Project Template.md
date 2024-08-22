---
noteBook: "[[Note Templates]]"
noteType: "[[Project Template|Project Note]]"
adminTemplate:
  - "[[Project Template|Project Note]]"
allTemplate:
  - "[[Notebook Page Template|Note Page]]"
  - "[[Folder Note Page Template|Folder Note]]"
aliases:
  - Projects
dated: false
folderNote: true
folder:
---
<%*
// Build project Folder Structure
await this.app.vault.createFolder(tp.file.folder(true) + "/notebook");
_%>
# Project Summary
``` dataviewjs
    dv.view("00 Home/Notebook Config/Scripts/Dataview/tasksGTDdev", {})
```