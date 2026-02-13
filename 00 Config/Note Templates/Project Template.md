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
leafEmbed1: "# Notes"
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
### Task Base
``` base
filters:
  and:
    - noteType.containsAny(link("Task Template", "Task"))
formulas:
  status: if(completed, "✅ Completed", if(manual_status == "x", "❌ Cancelled", if(manual_status == ">", "➡️ Forward", if(manual_status == "<", "📅 Migrated", if(manual_status == "D", "📆 Date", if(manual_status == "?", "❓ Question", if(manual_status == "/", "⏳ Half Done", if(manual_status == "+", "➕ Add", if(manual_status == "R", "🔬 Research", if(manual_status == "!", "❗ Important", if(manual_status == "i", "💡 Idea", if(manual_status == "B", "🧠 Brainstorm", if(manual_status, manual_status, if(scheduled.isEmpty(), "📥 Unscheduled", if(date(scheduled) < today(), "🔴 Overdue", if(date(scheduled) <= today() + "1d", "🟢 Due Today", if(date(scheduled) <= today() + "3d", "🟡 Upcoming", "📅 Scheduled")))))))))))))))))
properties:
  formula.status:
    displayName: Status
  manual_status:
    displayName: Manual Status
  completed:
    displayName: Completed
  scheduled:
    displayName: Scheduled
  created:
    displayName: Created
  priority:
    displayName: Priority
  parent:
    displayName: Parent
views:
  - type: table
    name: Direct Tasks
    filters:
      and:
        - file.hasLink(this)
    order:
      - file.name
      - priority
      - formula.status
      - created
      - scheduled
      - completed
      - parent
      - manual_status
    sort:
      - property: manual_status
        direction: ASC
      - property: formula.status
        direction: ASC
      - property: parent
        direction: ASC
    columnSize:
      formula.status: 125
      note.created: 126
      note.scheduled: 107
      note.completed: 113
  - type: table
    name: All Descendent Tasks
    filters:
      and:
        - file.path.contains(this.file.folder)
    order:
      - file.name
      - priority
      - formula.status
      - created
      - scheduled
      - completed
      - parent
      - manual_status
    sort:
      - property: formula.status
        direction: ASC
      - property: parent
        direction: ASC
    columnSize:
      note.created: 172
      note.scheduled: 156
      note.completed: 164

```
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

