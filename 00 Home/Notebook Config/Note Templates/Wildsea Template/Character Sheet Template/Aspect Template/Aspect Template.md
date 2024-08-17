---
noteBook: "[[Note Templates]]"
noteType: "[[Aspect Template|Aspect Template]]"
adminTemplate: 
allTemplate:
  - "[[Trait Template|Trait]]"
aliases:
  - Aspect
folder: 
dated: false
folderNote: true
---
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

