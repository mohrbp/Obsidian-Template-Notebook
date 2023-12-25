---
template_type: All
note_type: PCode Template
---
# Tasks - Still needs to Filter down to PCode in Frontmatter
``` dataviewjs
const currentTime = dv.date(`today`)
// console.log(`Current Time = ${currentTime}`);
const myTasks = dv.pages()
					.where(p => p.note_type == "atomic")
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

dv.header(2, "Overdue");
// Task, PCode, Project, File, Note Type, Created, Scheduled/Due
dv.table(["Task", "Scheduled","PCode", "Project", "Note", "Created"],
    scheduledTasks
	    .where(t => t.dateSch < 0)
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
    
dv.header(2, "Up Next");
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
							
dv.header(2, "Unscheduled (Limit 50)");
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
```