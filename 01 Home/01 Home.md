---
aliases:
  - Home
noteType: "[[Collection Template]]"
cssclasses:
---
# Tasks

```dataviewjs
dv.view("00 Home/Config/Scripts/Dataview/tasksGTD", {"target": dv.current().file.link})
```
# Notes

## Recent Notes 
```dataviewjs
    dv.view("00 Home/Config/Scripts/Dataview/recents", {"target": dv.current().note_type, "change": "modifiedNotes", "recent": 100})
```
```dataviewjs
    dv.view("00 Home/Config/Scripts/Dataview/recents", {"target": dv.current().note_type, "change": "createdNotes", "recent": 25})
```


