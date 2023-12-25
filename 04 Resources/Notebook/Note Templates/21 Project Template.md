---
note_type: Project Template
PCode:
  - "[[P1000]]"
  - "[[P2000]]"
template_type: All
---
<%*
// Template project setup 
// Build Project Folder Structure
await this.app.vault.createFolder(tp.file.folder(true) + "/notebook");
await this.app.vault.createFolder(tp.file.folder(true) + "/experiments");
await this.app.vault.createFolder(tp.file.folder(true) + "/meetings");
-%>
# Notebook


# Documents
## Related Notes - Still need to add related notes

## Files
```dataview
TABLE file.ext as "File Extension", file.ctime as Created
FROM "<%tp.file.folder(true)%>"
WHERE file !=this.file
SORT file.ctime DESC
```