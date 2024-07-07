---
aliases:
  - GameElements
noteType:
  - "[[GameElement Template|GameElements]]"
  - "[[Note Templates|Template]]"
pageTemplate:
  - "[[Notebook Page Template|Folder Note]]"
folder: 05 Wildsea
templateType:
  - Category
---
<%*
// Template project setup 
// Build project Folder Structure
await this.app.vault.createFolder(tp.file.folder(true) + "/notebook");
_%>
# Notebook

# Notes
## Recent Notes 

```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/recents", {"target": dv.current().note_type, "change": "modifiedNotes", "recent": 30})
```

```dataiewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/recents", {"target": dv.current().note_type, "change": "createdNotes", "recent": 3})

```
# Files 
## Documents (non-markdown)
```dataview
TABLE file.ext as "File Extension", file.ctime as Created
FROM "<%tp.file.path(true)%>"
WHESORT file.ctime DESC
```

