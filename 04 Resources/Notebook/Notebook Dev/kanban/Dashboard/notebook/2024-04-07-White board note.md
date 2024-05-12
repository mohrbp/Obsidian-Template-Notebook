---
note_type: page
projectCategory: "null"
project:
  - "[[04 Resources/Notebook/Notebook Dev/kanban/Dashboard/Dashboard.md|Dashboard]]"
people: 
topics: 
created: 2024-04-07T20:41
cssclasses: []
---
# Notes
## handrawn
![[01 Home/!Inbox/2024/attachments/PXL_20240404_032458509.jpg]]
## Getting started 

``` dataviewjs

let text = '> [!multi-column]\n> > [!Todo]+ Deliverables Milestone\n> >' + '```dataviewjs \n> > dv.view("04 Resources/notebook/Scripts/Dataview/recents", {"target": dv.current().note_type, "change": "modifiedNotes", "recent": 30})\n> > ```' + '\n> \n> > [!Summary]+ Funding Milestone\n> > - Series A: $ 1.1 mil\n> > - Series B: ongoing\n> > - Series C: planned\n> \n> > [!Todo]+ Deliverables Milestone\n> > - [ ] test'

dv.paragraph(text)
```

```dataviewjs 
dv.view("04 Resources/notebook/Scripts/Dataview/multicolumn")
```
# Tasks
