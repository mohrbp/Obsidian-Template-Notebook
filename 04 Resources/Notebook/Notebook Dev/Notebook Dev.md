---
note_type: project
projectCategory: 
created: 2024-01-14
project:
  - "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
---
# **Update Date** - 2024-01-16

# Tasks
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/tasksGTD", {"target": dv.current().note_type})
```
# Notebook
## 2024-01-14-MLK weekend Dev
 ![[04 Resources/Notebook/Notebook Dev/notebook/2024-01-14-MLK weekend Dev.md|2024-01-14-MLK weekend Dev]]
## 2024-01-02-PDF Extraction
![2024-01-02-PDF Extraction](04%20Resources/Notebook/Notebook%20Dev/notebook/2024-01-02-PDF%20Extraction.md)

## 2023-12-31-SearchByHeader

![2023-12-31-SearchByHeader](04%20Resources/Notebook/Notebook%20Dev/notebook/2023-12-31-SearchByHeader.md)
## 2023-12-26-FutureFeatures
![2023-12-26-FutureFeatures](04%20Resources/Notebook/Notebook%20Dev/notebook/2023-12-26-FutureFeatures.md)


## 2023-10-07 Updating Project Tracking
![2023-10-07 UpdatingProjectTracking](04%20Resources/Notebook/Notebook%20Dev/notebook/2023-10-07%20UpdatingProjectTracking.md)

## 2023-06-15-AsanaReportingNote
![2023-06-15-AsanaReportingNotes](04%20Resources/Notebook/Notebook%20Dev/notebook/2023-06-15-AsanaReportingNotes.md)



## Recent Notes 
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/recents", {"target": dv.current().note_type, "change": "modifiedNotes", "recent": 30})
```
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/recents", {"target": dv.current().note_type, "change": "createdNotes", "recent": 3})
```
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/recents", {"target": dv.current().note_type, "change": "modifiedNotes", "recent": 30})
```
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/recents", {"target": dv.current().note_type, "change": "createdNotes", "recent": 3})
```
# Files 
## Documents (non-markdown)
```dataview
TABLE file.ext as "File Extension", file.ctime as Created
FROM "04 Resources/Notebook/Dev/Dev.md"
WHERE file !=this.file
WHERE file.ext != "md"
SORT file.ctime DESC
```

