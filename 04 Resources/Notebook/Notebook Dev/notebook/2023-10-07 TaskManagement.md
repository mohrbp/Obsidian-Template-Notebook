---
completed_tasks: 2
created: 2023-10-07
incomplete_tasks: 0
note_type: page
parent: "[[01 Home/!Inbox/2023/2023-10-02 WeeklyReview]]"
people: None
topics: "[[03 Areas/Software/Obsidian/Obsidian|Obsidian]]"
total_tasks: 2
projectCategory: "null"
project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
---
# Notes
## Daily Notes Dashboard
- This is really a point of navigation for me and how I want to be getting around my notes
	- Like quick switcher and stuff are fine, but this is where I want recently worked on stuff
- Can I have it as two columns? One for modified and one for created? 
- Worth considering Cards in this context, but it might not be appropriate here
	- Kinda cool that you can make them sortable, which may be useful in other places?
		- obsidian://show-plugin?id=obsidian-sortable
		- Sorting tables is probably useful.
## Forwarded from 2023-10-07 UpdatingProjectTracking
```

dv.taskList(
  dv.current()
    .file.tasks
    .mutate(t => t.visual = t.text.split("").reverse().join("") ),
  false)
```
```
// find dates based on format [[YYYY-MM-DD]]

const findDated = (task)=>{

if( !task.completed ) {

task.link = " " + "[[" + task.path + "|*]]";

task.date="";

const found = task.text.match(/\[\[([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))\]\]/);

if(found) task.date = moment(found[1]);

return true;

}

}
const myTasks = dv.pages('"3 Projects"')
	.where()
	.file.tasks.where(t => findDated(t));

dv.header(2,"Overdue");

dv.taskList(myTasks.filter(t=> moment(t.date).isBefore(moment(),"day")).sort(t=>t.date));

dv.header(2,"Today");

dv.taskList(myTasks.filter(t=> moment(t.date).isSame(moment(),"day")).sort(t=>t.date));

dv.header(2,"Upcoming");

dv.taskList(myTasks.filter(t=> moment(t.date).isAfter(moment(),"day")).sort(t=>t.date));
```

## GTD
### Talking about it 
![Tasks](03%20Areas/Software/Obsidian/Work%20Obsidian.md#Tasks)

### Sample Data
- Need to make some notes and tasks with the appropriate properties to test the aggregation
	- Gonna try first with [Isoprene IVPP Assay](02%20Projects/P1270%20Sumitomo/Isoprene%20IVPP%20Assay/Isoprene%20IVPP%20Assay.md) because it may be simplest still and has stuff scheduled in the future already

### Things I was attempting
- I was trying to get the file metadata to be the fallback for any scheduled and start dates for the tasks, but I couldn't get the metadata from the file after filtering to the task
	- not sure how to get what I want from the task File

const findDated = (task)=>{
	let taskFile = app.fileManager.vault.getAbstractFileByPath(task.path)
	task.link = " " + "[[" + task.path + "|*]]";
	console.log(`${taskFile?.frontmatter?.start}`);
	if( !task.start ) {
		task.start = "";
		const startDate = taskFile.frontmatter;
		if(startDate) task.start = moment(startDate[1]);
		return true;
	}
}

Not sure why I can't access what I want in the below object
`$=app.fileManager.vault.getAbstractFileByPath(dv.current().file.path)
#### The alternative
- Just use the date information in the tasks themselves for now


#### More Code

 await dv.pages().where(p => p.note_type == 'Project Task' && String(p.file.link).includes(selectedProject) == true).file;


`$=dv.pages().where(p => String(p.project_task).includes(dv.current().file.link) == true).file.tasks.path;

    .where(p => {
        const createdDate = formatDate(new Date(p.file.ctime));
        const modifiedDate = formatDate(new Date(p.file.mtime));
        return noteDate === createdDate || noteDate === modifiedDate;
    })


=this.file`



    .where(p => {
        const createdDate = formatDate(new Date(p.file.ctime));
        const modifiedDate = formatDate(new Date(p.file.mtime));
        return noteDate === createdDate || noteDate === modifiedDate;
    })

$=dv.pages().where(p => String(p.project_task).includes(dv.current().file.link) == true).file.tasks.where(t => t.checked === false).mutate(t => t.due ?? "2023-10-08"; return t;)`

```javascript
someArray.filter(f => f.some(s => s.id === myId)).concat([{ id: myId }])
```

![](02%20Projects/P1270%20Sumitomo/Isoprene%20IVPP%20Assay/attachments/Pasted%20image%2020231008170853.png)

$=app.fileManager.vault.getAbstractFileByPath(dv.current().file.path)`

=this.file`

const findDated = (task)=>{
	let taskFile = app.fileManager.vault.getAbstractFileByPath(task.path)
	task.link = " " + "[[" + task.path + "|*]]";
	console.log(`${taskFile?.frontmatter?.start}`);
	if( !task.start ) {
		task.start = "";
		const startDate = taskFile.frontmatter;
		if(startDate) task.start = moment(startDate[1]);
		return true;
	}
}

=this.file.tasks.due`

## The finished Project Task GTD Query (for now) 
```
const currentTime = dv.date(`today`)
const myTasks = dv.pages()
					.where(p => String(p.project_task).includes(dv.current().file.link) == true)
					.file.tasks
						.where(t => t.checked === false)
							

for (let task of myTasks) {
	if (typeof (task.created) == "undefined") {
	task.created = dv.page(task.path).file.frontmatter.created
	}
	if (dv.page(task.path).file.frontmatter.scheduled) {
	task.scheduled = dv.page(task.path).file.frontmatter.scheduled
	}
	if (dv.page(task.path).file.frontmatter.start) {
	task.start = dv.page(task.path).file.frontmatter.start
	} 
}

const myStartedTasks = myTasks
						.where(t => {
							const cTime = DateTime.fromISO(t.created);
							if (typeof (t.start) == "undefined") {
								return cTime.diff(currentTime).as(`minutes`) < 0;
							} else {
								const sTime = DateTime.fromISO(t.start); 
								const createdTime = (cTime.diff(sTime).as(`minutes`) < 0) ? sTime : cTime;
								return createdTime.diff(currentTime).as(`minutes`) < 0;
							}
						})

const myScheduledTasks = myStartedTasks
							.where(t => {
							return typeof(t.scheduled) != "undefined"})
							
dv.header(2, "Up Next")
dv.taskList(myScheduledTasks
				.where(t => {
					return DateTime.fromISO(t.due).diff(currentTime).as(`minutes`) > 0; }))

dv.header(2, "Scheduled or Waiting")
dv.taskList(myScheduledTasks)

dv.header(2, "Needs Scheduled")
dv.taskList(myStartedTasks
				.where(t => {
					return typeof(t.scheduled) == "undefined"}))

dv.header(2, "Needs Re-Scheduled")
dv.taskList(myStartedTasks
				.where(t => {
				const dTime = DateTime.fromISO(t.due);
				return dTime.diff(currentTime).as(`minutes`) < 0}))
```

## Task Query for Daily Note
- I wanted to add a sum of number of tasks to be schedule and re-scheduled by Project or Project Task
	- [How can I calculate my total number of the complete tasks in the specific period? - Help - Obsidian Forum](https://forum.obsidian.md/t/how-can-i-calculate-my-total-number-of-the-complete-tasks-in-the-specific-period/53461/5)
	- [Can I Count The Number of Open Tasks and Group By Page? - Help - Obsidian Forum](https://forum.obsidian.md/t/can-i-count-the-number-of-open-tasks-and-group-by-page/39604/2)
	- [Help with using Dataview to get task count - Help - Obsidian Forum](https://forum.obsidian.md/t/help-with-using-dataview-to-get-task-count/47525/5)

### Tried this too
```
TABLE WITHOUT ID
	key as Tasks,
	length(rows) AS Total,
	rows.file.link AS "Files for total",
	length(filter(rows.tasks, (r) => r.completed)) AS Completed,
	filter(rows, (r) => r.tasks.completed).file.link AS "Files for completed"
FROM ""
WHERE file.
FLATTEN file.tasks as tasks
GROUP BY tasks.text
SORT length(rows) DESC
```


# Tasks
- [x] Re-do Project and Project Tasks meetings setup 📅 2023-10-08 ✅ 2023-10-08
- [>] [[04 Resources/Notebook/Notebook Dev/notebook/2023-10-08 LuxonDataView]] Review and Update the Created and Modified Dash Board 📅 2023-10-08
