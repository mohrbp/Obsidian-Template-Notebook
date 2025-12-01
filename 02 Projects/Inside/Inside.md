---
noteBook: "[[02 Projects|Projects]]"
noteType: "[[Project Template|Project Note]]"
created: 2024-08-21T18:17:31Z
user: "[[00 Config|Emily Mohr]]"
parent:
  - "[[02 Projects|Projects]]"
modified: 2024-09-02T16:03:48Z
cssclasses: []
---
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

