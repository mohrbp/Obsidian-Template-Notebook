---
note_type: project
projectCategory: 
created: 2024-01-14
project:
  - "[[04 Resources/Notebook/Notebook Dev/Notebook Dev|Notebook Dev]]"
---
# **Update Date** - 2024-01-14

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

## Recent Notes 
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/recentlyModified", {"target": dv.current().note_type})
```
```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/recentlyCreated", {"target": dv.current().note_type})
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

