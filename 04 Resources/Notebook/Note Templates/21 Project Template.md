---
note_type: Project Template
PCode: []
template_type: All
---
<%*
// Template project setup 
// Build Project Folder Structure
await this.app.vault.createFolder(tp.file.folder(true) + "/Notebook");
await this.app.vault.createFolder(tp.file.folder(true) + "/Experiments");
_%>
# Notebook



## Recent Notes 
### Recently Modified Notes (last 3 days)
``` dataviewjs
let modifiedNotes = dv.pages()
	.where(p => String(dv.current().project).indexOf(p.project) != -1)
	.where(p => p.note_type == "Atomic" | p.note_type == "Experiment")
	.where(p => DateTime.fromISO(p.file.mtime).diffNow().as("minutes") > -(3*1440))


// Format file based on file frontmatter and other info
for (let n of modifiedNotes) {
	if (n.file.mtime) {
	n.modifiedTime = Math.abs(Math.round(n.file.mtime.diffNow().as("hours")))
	n.modified = n.modifiedTime + " hours ago"
	};
};

let sortedNotes = modifiedNotes
	.sort(p => DateTime.fromISO(p.file.mtime).diffNow(), "desc")

dv.table(["Created","Last Modified", "Note","Project Notebook"],
    sortedNotes
    .map(p => [
		new DateTime(p.created).toFormat("ccc DD"),
		p.modified,
		p.file.link,
        p.project,
    ])
    .limit(25)
);
```
### Recently Created Notes
``` dataviewjs
let createdNotes = dv.pages()
	.where(p => String(dv.current().project).indexOf(p.project) != -1)
	.where(p => p.note_type == "Atomic" | p.note_type == "Experiment")
	.where(p => DateTime.fromISO(p.created).diffNow().as("minutes") > - (3*1440))


// Format file based on file frontmatter and other info
for (let n of createdNotes) {
	if (n.created) {
	n.createdTime = Math.abs(Math.round(n.created.diffNow().as("minutes")))
	n.createdAgo = n.createdTime + " hours ago"
	};
};

let sortedNotes = createdNotes
	.sort(p => new DateTime(p.created).diffNow(), "desc")

dv.table(["Created", "Time", "Note", "Project Notebook"],
    sortedNotes
    .map(p => [
		new DateTime(p.created).toFormat("ccc DD"),
		new DateTime(p.created).toFormat("t"),
		p.file.link,
        p.project,
    ])
);
```
# Files 
## Documents (non-markdown)
```dataview
TABLE file.ext as "File Extension", file.ctime as Created
FROM "<%tp.file.path(true)%>"
WHERE file !=this.file
WHERE file.ext != "md"
SORT file.ctime DESC
```

