---
aliases:
  - Home
noteType: []
cssclasses:
  - cards
Projects:
  - "[[Food|Food]]"
---
# Tasks
```dataviewjs

dv.view("01 Home/Notebook Config/Scripts/Dataview/tasksGTDdev", {"target": dv.current().noteType})
    
```
# Notes
## Recent Notes 

```dataviewjs
    dv.view("01 Home/Notebook Config/Scripts/Dataview/recents", {"target": dv.current().note_type, "change": "modifiedNotes", "recent": 100})
```
```dataviewjs
    dv.view("01 Home/Notebook Config/Scripts/Dataview/recents", {"target": dv.current().note_type, "change": "createdNotes", "recent": 25})
```


