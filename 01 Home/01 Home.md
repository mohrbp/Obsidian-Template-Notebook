---
note_type: Dashboard
aliases:
  - Home
---
# Recent Files (Ctrl/Cmd + O)
## Today's Notes (last 25 hrs)
``` dataviewjs
let todayFiles = dv.pages()
	.where(p => p.note_type == "atomic" | p.note_type == "experiment")
	.where(p => DateTime.fromISO(p.created).diffNow().as("minutes") > -1500 || DateTime.fromISO(p.file.mtime).diffNow().as("minutes") > -1500)


// Format file based on file frontmatter and other info
for (let f of todayFiles) {
	if (f.file.mtime) {
	f.modifiedTime = Math.abs(Math.round(f.file.mtime.diffNow().as("hours")))
	f.modified = f.modifiedTime + " hours ago"
	f.myMTime = f.file.mtime
	};
};

let sortedFiles = todayFiles

dv.header(3, "Minimal Test Files");
dv.table(["Created", "Last Modified", "Note", "Project"],
    sortedFiles
    .map(p => [
		new DateTime(p.created).toFormat("y-MM-dd"),
		p.modified,
        p.file.link,
        p.project,
    ])
    .limit(15)
	.sort(p => p[1])
);

dv.header(3, "Sorted Files");
dv.table(["Created", "p.modifiedTime", "p.modified", "p.myMTime", "p.mtime", "p.file.mtime", "Note", "Project"],
    sortedFiles
    .map(p => [
		new DateTime(p.created).toFormat("y-MM-dd"),
		p.modifiedTime,
		p.modified,
		p.myMTime,
		p.mtime,
		p.file.mtime,
        p.file.link,
        p.project,
    ])
    .limit(15)
	.sort(p => p[2])
);

let modifiedFiles = todayFiles

dv.header(3, "Modified Today (max 15 notes displayed)");
dv.table(["Created", "Hrs since Modified", "Note", "Project"],
    modifiedFiles
    .map(p => [
		new DateTime(p.created).toFormat("y-MM-dd"),
		p.modifiedTime,
        p.file.link,
        p.project,
    ])
    .limit(15)
);

dv.header(3, "Created Today");
dv.table(["Created", "File", "Note Type", "PCode", "Project"],
    todayFiles.map(p => [
        new DateTime(p.created).toFormat("t"),
        p.file.link,
        p.note_type,
        p.PCode,
        p.project
    ])
    .sort(p => p.ctime)
);
```
