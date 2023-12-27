---
template_type: All
note_type: PCode Template
---
# Tasks 
``` dataviewjs
const currentTime = dv.date(`today`);
// console.log(`Current Time = ${currentTime}`);
const myTasks = dv.pages()
					.where(p => p.note_type == "atomic")
					.where(p => String(dv.current().PCode).indexOf(p.PCode) != -1)
					.file.tasks
						.where(t => t.checked === false);
							
// Format file.tasks based on file frontmatter and other info

// priorities color
const red = "<span style='border-left: 3px solid red;'>&nbsp;</span>"
const orange = "<span style='border-left: 3px solid orange;'>&nbsp;</span>"
const green = "<span style='border-left: 3px solid rgb(55 166 155);'>&nbsp;</span>"

for (let task of myTasks) {
	if (typeof (task.created) == "undefined") {
	task.created = dv.page(task.path).file.frontmatter.created
	};
	if (dv.page(task.path).file.frontmatter.PCode) {
	task.PCode = dv.page(task.path).file.frontmatter.PCode
	};
	if (dv.page(task.path).file.frontmatter.project) {
	task.project = dv.page(task.path).file.frontmatter.project
	};
	if (dv.page(task.path).file.frontmatter.note_type) {
	task.note_type = dv.page(task.path).file.frontmatter.note_type
	};
	if (dv.page(task.path).file.link) {
	task.parent = dv.page(task.path).file.link
	};
};


// Arrange the Tasks for GTD
let allTasks = myTasks

let scheduledTasks = allTasks
							.where(t => typeof(t.scheduled) != "undefined");
							
for (let task of scheduledTasks) {
    task.visual = "";
	if (task.text.match(/[⌛⏳]/) != null) {
	task.matchSch = task.text.match(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/)[2];
	task.timingSch = DateTime.fromISO(task.matchSch);
	task.dateSch = Math.round(task.timingSch.diff(currentTime, "days").as("minutes"));
	if (task.dateSch < (1400 * 3)){
	task.visual = red;
	} else if ((task.dateSch < (1400 * 7)) && (task.dateSch > (1400 * 3))) {
	task.visual = orange;
	} else if (task.dateSch > (1400 * 7)) {
	task.visual = green;
	};
	task.visual += task.text.replace(/[📅📆⌛⏳].*$/g, "");
	};
};

let overdueTasks = scheduledTasks
	    .where(t => t.dateSch < 0)
	    
if(overdueTasks.length > 0 ){

dv.header(3, "⚠️Overdue⚠️");
// Task, PCode, Project, File, Note Type, Created, Scheduled/Due
dv.table(["Task", "Scheduled","PCode", "Project", "Note", "Created"],
    overdueTasks
	    .map(t => [
		t.visual,
		t.timingSch.toFormat("DD"),		
		t.PCode,
		t.project,
		t.parent,
		DateTime.fromISO(t.created).toFormat("DD"),
		])
		.sort(t => DateTime.fromISO(t.scheduled))
    )
}

    
dv.header(3, "Up Next");
// Task, PCode, Project, File, Note Type, Created, Scheduled/Due
dv.table(["Task", "Scheduled","PCode", "Project", "Note", "Created"],
    scheduledTasks
		.where(t => t.dateSch >= 0 && t.dateSch < (1440 * 14))
	    .map(t => [
		t.visual,
		t.timingSch.toFormat("DD"),		
		t.PCode,
		t.project,
		t.parent,
		DateTime.fromISO(t.created).toFormat("DD"),
		])
		.sort(t => DateTime.fromISO(t.scheduled))
    )

let unscheduledTasks = allTasks
							.where(t => typeof(t.scheduled) == "undefined" & typeof(t.due) == "undefined");
							
for (let task of unscheduledTasks) {
    task.visual = "";
	task.visual += task.text.replace(/[📅📆⌛⏳].*$/g, "");
};
							
dv.header(3, "Unscheduled (Limit 50)");
// Task, PCode, Project, File, Note Type, Created, Scheduled/Due
dv.table(["Task","PCode", "Project", "Note", "Created"],
    unscheduledTasks.map(t => [
		t.visual,
		t.PCode,
		t.project,
		t.parent,
		DateTime.fromISO(t.created).toFormat("DD"),
		])
		.sort(t => DateTime.fromISO(t.created))
		.limit(50)
    )

// Recently completed tasks sorted by recent first to limit scope of search on completed tasks
const myRecentCompleteTasks = dv.pages()
					.where(p => p.note_type == "atomic")
					.where(p => DateTime.fromISO(p.file.mtime).diffNow().as("minutes") > -(3*1440))
					.where(p => String(dv.current().PCode).indexOf(p.PCode) != -1)
					.file.tasks
						.where(t => t.checked === true);

for (let task of myRecentCompleteTasks) {
	task.visual = "";
	if (typeof (task.created) == "undefined") {
	task.created = dv.page(task.path).file.frontmatter.created
	};
	if (dv.page(task.path).file.frontmatter.PCode) {
	task.PCode = dv.page(task.path).file.frontmatter.PCode
	};
	if (dv.page(task.path).file.frontmatter.project) {
	task.project = dv.page(task.path).file.frontmatter.project
	};
	if (dv.page(task.path).file.frontmatter.note_type) {
	task.note_type = dv.page(task.path).file.frontmatter.note_type
	};
	if (dv.page(task.path).file.link) {
	task.parent = dv.page(task.path).file.link
	};
	task.visual += task.text.replace(/[📅📆⌛⏳].*$/g, "");
};

dv.header(3, "Recently Completed (Limit 25)");
// Task, PCode, Project, File, Note Type, Created, Scheduled/Due
dv.table(["Task","PCode", "Project", "Note", "Created"],
    myRecentCompleteTasks.map(t => [
		t.visual,
		t.PCode,
		t.project,
		t.parent,
		DateTime.fromISO(t.created).toFormat("DD"),
		])
		.sort(t => DateTime.fromISO(t.created))
		.limit(25)
    )
							
```

# Notes 
### Recently Modified Notes (last 3 days)
``` dataviewjs
let modifiedNotes = dv.pages()
	.where(p => String(dv.current().PCode).indexOf(p.PCode) != -1)
	.where(p => p.note_type == "atomic" | p.note_type == "experiment")
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
	.where(p => String(dv.current().PCode).indexOf(p.PCode) != -1)
	.where(p => p.note_type == "atomic" | p.note_type == "experiment")
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
### Documents (non-markdown)
```dataview
TABLE file.ext as "File Extension", file.ctime as Created
FROM "<%tp.file.path(true)%>"
WHERE file !=this.file
WHERE file.ext != "md"
SORT file.ctime DESC
```

