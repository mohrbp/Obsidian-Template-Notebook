---
completed_tasks: 1
created: 2023-10-10
incomplete_tasks: 0
note_type: page
parent: "[[01 Home/2023/41-Oct08/2023-10-10]]"
people: None
topics: "[[03 Areas/Software/Obsidian/Obsidian|Obsidian]]"
total_tasks: 1
projectCategory: "null"
project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
---
# Notes
## Purpose
- Making a place to catch my thoughts on the changes I made to my notebook over the weekend and any subsequent changes needed 

## Thoughts
### File C.time vs created
- File C.time got allll messed up when I swapped computers, which frankly - good
- Created needs to include the time and be referenced instead of C.time
- I think the consequences of this for "modified" are different
	- Need to consider further
	- The goal has always been a changelog
		- Maybe only possible through git
### What do I need to change?
#### Daily Note Dashboard
- Still need a tracker of total and done (or percent done) by project task (thought about this as a either a bar plot or line graph with points - to see it over time) 
	- That sounds like it will be any export and run in R then re-import? - icky or using Obsidian Charts, which....
	- This is more a count of complete and incomplete rather than the GTD tracking
#### GTD
- Need to aggregate "To be scheduled and To be Rescheduled" by project
	- Could show on the daily note by project priority
- Show the scheduled date on the Scheduled tasks
	- Kinda useless without. 
- There is some wonky-ness with anything created today
	- Its comparing to the beginning of the day and these were created later than that, but if only the Date is provided then there won't be a good comparison 
		- Make sure created and scheduled have a time associated that is acknowledged 
			- Or that the comparison is actually to 10 minutes before today (or something)
				- Included a section that adds or subtracts 10 minutes to avoid exact (0) minute comparisons 
			- Whoops,  had the inequalities wrong too 
				- Added some console logs to try to catch those
				- Have not push this to all of my project tasks yet but tried to hit the ones I'm working on today

#### Project Task Dashboard
- I think I need to do a bit better job of pulling in all the places these notes could be linked
	- Getting anything that has this as a parent is probably smart
- Added Dashboard stuff to [Nutritional Enrichment](02%20Projects/I1017%205_7%20Assay%20Platform/Nutritional%20Enrichment/Nutritional%20Enrichment.md) and [Rewiring Redox](02%20Projects/I1017%205_7%20Assay%20Platform/Project%20Management/kanban/Rewiring%20Redox/Rewiring%20Redox.md)
#### Topics
- Converted [Enterprise Empowerment](03%20Areas/Stewardship/Enterprise%20Empowerment/Enterprise%20Empowerment.md) into a topic.

#### DataviewJS
- Running slow on my work laptop - pretty nice on the mac really 
	- Could be hardware acceleration 
	- Could be the searches that I am doing 
		- I moved the sort function to the other side of the where, which theoretically should reduce the burden on that, but idk
	- 

# Tasks
- [x] Sync Work phone with notebook (including scripts) 📅 2023-10-10 ✅ 2023-10-10
