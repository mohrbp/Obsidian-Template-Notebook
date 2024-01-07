const { DateTime, Duration } = dv.luxon;
let target = input.target;
let query = dv.current()[target];

// Assign variables for recency 
let recentLow = 3;
let recentMid = 7;
let recentHigh = 14;

const currentTime = dv.date(`today`);
// console.log(`Current Time = ${currentTime}`);
const myTasks = dv.pages()
			.where(p => String(p[target]).indexOf(query) != -1)
			.where(p => p.note_type == "page" | p.note_type == "card")
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
	if (dv.page(task.path).file.frontmatter.projectCategory) {
	task.projectCategory = dv.page(task.path).file.frontmatter.projectCategory
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
	if (task.dateSch < (1400 * recentLow)){
	task.visual = red;
	} else if ((task.dateSch < (1400 * recentMid)) && (task.dateSch > (1400 * recentLow))) {
	task.visual = orange;
	} else if (task.dateSch > (1400 * recentMid)) {
	task.visual = green;
	};
	task.visual += task.text.replace(/[📅📆⌛⏳].*$/g, "");
	};
};

let overdueTasks = scheduledTasks
	    .where(t => t.dateSch < 0)
dv.el("b", "Tasks within " + recentHigh + " days, where " + target + " = " + query);
if(overdueTasks.length > 0 ){
dv.header(3, "⚠️Overdue⚠️");
// Task, projectCategory, project, File, Note Type, Created, Scheduled/Due
dv.table(["Task", "Scheduled","Project Category", "Project", "Note", "Created"],
    overdueTasks
	    .map(t => [
		t.visual,
		t.timingSch.toFormat("DD"),		
		t.projectCategory,
		t.project,
		t.parent,
		DateTime.fromISO(t.created).toFormat("DD"),
		])
		.sort(t => DateTime.fromISO(t.scheduled))
    )
}

    
dv.header(3, "Up Next");
// Task, projectCategory, project, File, Note Type, Created, Scheduled/Due
dv.table(["Task", "Scheduled","Project Category", "Project", "Note", "Created"],
    scheduledTasks
		.where(t => t.dateSch >= 0 && t.dateSch < (1440 * recentHigh))
	    .map(t => [
		t.visual,
		t.timingSch.toFormat("DD"),		
		t.projectCategory,
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
// Task, projectCategory, project, File, Note Type, Created, Scheduled/Due
dv.table(["Task","Project Category", "Project", "Note", "Created"],
    unscheduledTasks.map(t => [
		t.visual,
		t.projectCategory,
		t.project,
		t.parent,
		DateTime.fromISO(t.created).toFormat("DD"),
		])
		.sort(t => DateTime.fromISO(t.created))
		.limit(50)
    )

// Recently completed tasks sorted by recent first to limit scope of search on completed tasks
const myRecentCompleteTasks = dv.pages()
					.where(p => String(p[target]).indexOf(query) != -1)
					.where(p => p.note_type == "page" | p.note_type == "card")
					.where(p => DateTime.fromISO(p.file.mtime).diffNow().as("minutes") > - (recentLow * 1440))
					.file.tasks
						.where(t => t.checked === true);

for (let task of myRecentCompleteTasks) {
	task.visual = "";
	if (typeof (task.created) == "undefined") {
	task.created = dv.page(task.path).file.frontmatter.created
	};
	if (dv.page(task.path).file.frontmatter.projectCategory) {
	task.projectCategory = dv.page(task.path).file.frontmatter.projectCategory
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
// Task, projectCategory, project, File, Note Type, Created, Scheduled/Due
dv.table(["Task","Project Category", "Project", "Note", "Created"],
    myRecentCompleteTasks.map(t => [
		t.visual,
		t.projectCategory,
		t.project,
		t.parent,
		DateTime.fromISO(t.created).toFormat("DD"),
		])
		.sort(t => DateTime.fromISO(t.created))
		.limit(25)
    )
							