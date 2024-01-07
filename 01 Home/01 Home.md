---
aliases: Home
note_type: Dashboard
---

# Buttons
| ![New Task\|clean no-title no-link](04%20Resources/Notebook/Buttons/New%20Task.md) | ![New Page\|clean no-title no-link](04%20Resources/Notebook/Buttons/New%20Page.md) | ![New Card\|clean no-title no-link](04%20Resources/Notebook/Buttons/New%20Card.md) | ![New Project\|clean no-title no-link](04%20Resources/Notebook/Buttons/New%20Project.md) |
| ---- | ---- | ---- | ---- |
# Tasks 
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/tasksGTD", {"target": dv.current().note_type})
```
# Notes
## Recent Notes 
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/recentlyModified", {"target": dv.current().note_type})
```
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/recentlyCreated", {"target": dv.current().note_type})
```