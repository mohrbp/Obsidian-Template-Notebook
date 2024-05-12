---
completed_tasks: 1
created: 2023-10-08
incomplete_tasks: 0
note_type: page
parent: "[[01 Home/2023/41-Oct08/2023-10-08]]"
people: None
topics: "[[03 Areas/Software/Obsidian/Obsidian|Obsidian]]"
total_tasks: 1
projectCategory: "null"
project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
---
# Notes

## Documentation
[Luxon Formatting](https://moment.github.io/luxon/#/formatting)
- Generally speaking, I tried to avoid unnecessary formatting before any comparisons or calculations
- used Diff and DiffNow rather than parsing a date as a string and matching
	- That was leading to some weirdness with the local time vs the ISO time 
	- Also only wanted to covert to my time format once
	- Needed to parse the diff as minutes in order to do the comparison
		- Needed to set an upper bound for the comparison so it didn't get everything modified since the note
			- Used 1500 minutes to catch any late night work - but they will show up the next day too

## What I made
### Modified Files
``` dataviewjs
const today = dv.current().file.name
const today_test = "2023-10-07"

const noteDate = DateTime.fromISO(today_test);
const todayFiles = dv.pages()
    .sort(p => p.file.mtime.diffNow(), "desc")
    .where(p => {
        return p.file.mtime.diff(noteDate).as('minutes') > 0;
    });


dv.table(["Modified Time", "File", "Parent", "Created"],
    todayFiles.map(p => [
		new DateTime(p.file.mtime).toFormat("t"),
        p.file.link,
        p.parent,
        "[[" + (new DateTime(p.file.ctime).toFormat("y-MM-dd")) + "]]"
    ])
);
```


## Working through some options
new Date(dv.current().file.name).toISOString()
`$=new Date("2023-10-08").toISOString()`
`$=new Date(dv.current().file.mtime).toISOString()`

new Date("2023-10-08").toLocaleString()
`$=new Date("2023-10-08").toLocaleString()`

$=DateTime.fromISO("2023-10-08").toLocaleString()
`$=DateTime.fromISO("2023-10-08").toLocaleString()`

$=DateTime.fromISO("2023-10-08").setLocale('us').toFormat("y-M-dd")
`$=DateTime.fromISO("2023-10-08").setLocale('us').toFormat("y-M-dd")`


`$= new DateTime(dv.current().file.mtime).toFormat("y-M-dd")`

`$= DateTime.fromISO(dv.current().file.mtime).toFormat("y-M-dd")`

`$=DateTime.now().setZone("system")`
`$=DateTime.now().toLocaleString()`

new Date(dv.current().file.name).toISOString()
`$=new Date(dv.current().file.name).toISOString()`

new Date(dv.current().file.name).toLocaleString()
`$=new Date(dv.current().file.name).toLocaleString()`

# Tasks
- [x] Review and Update the Created and Modified Dash Board 📅 2023-10-08 ✅ 2023-10-08