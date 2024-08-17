---
aliases:
  - Inventory
noteType:
  - "[[Inventory Sheet Template|Inventory]]"
pageTemplate:
  - "[[Item Template|Item]]"
  - "[[Resource Template|Resource]]"
folder: 
templateType:
  - Category
parentGameElement: "[[GameElement Template]]"
dated: false
folderNote: true
---
<%*
// Template project setup 
// Build project Folder Structure
await this.app.vault.createFolder(tp.file.folder(true) + "/Resources");
await this.app.vault.createFolder(tp.file.folder(true) + "/Items");
await this.app.vault.createFolder(tp.file.folder(true) + "/Gear");
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

