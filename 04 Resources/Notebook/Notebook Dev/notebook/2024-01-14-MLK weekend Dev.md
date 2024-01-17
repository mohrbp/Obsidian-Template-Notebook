---
note_type: page
projectCategory: 
project:
  - "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
people: 
topics: 
created: 2024-01-14T21:22
created_by: BMohr
total_tasks: 0
completed_tasks: 0
incomplete_tasks: 0
---
# Notes

### Secret Dev Notebook
- Syncing and tracking my development
	- Basically planning to compare the folder to github and upload everything changed
	- Then copy the whole folder
	- Change the update date when you do that. 
		- Shouldn't be bouncing back and forth on dev very much
		- This is just to keep things together. 
- By not having a projectCategory in the create note, when you hit escape it will show the dev notebook. Seems like tasks and stuff still work fine.
	- Need to update GTD to ignore anything that is null in projectCategory

### General Updates
- Home button to take you to your common screens

#### Utilities
- Javascript functions currently stored as 
	- [utils](04%20Resources/Notebook/Scripts/Dataview/utils.js)
- https://forum.obsidian.md/t/dataviewjs-code-reuse-common-place-for-scripts/18611/6
	- ![|200](04%20Resources/Notebook/Notebook%20Dev/notebook/attachments/Pasted%20image%2020240117093103.png)

### Projects Updates 
- Refactor the recent files tables so there aren't three scripts
	- Combining all into recents makes modifications easier
	- Still fairly annoying to update all of the project files to include the new dashboard 
		- I don't think embeding or dv.load actually get the current note information
		- The more this is stored in the frontmatter, probably the better.
			- Eventually we'll have notion like frontmatter tables and adjusting the view length on each project will be easier 
		- The modified and created timelines are different.
			- They juts call a variable, but that is defined in the input. 
			- Having them be different is probably weird - even if its documented 
	- Used this to clean up how the projects are displayed
		- Added a script to pull away just the wiki and markdown links and return them as a a comma separated string
		- Using this to sanitize the Project notebook category
- Tasks need a bit of reformatting
	- Color coding is aggressive. Everything is red all the time
	- I don't wanna see so many task on everything, break the limits to variables at the top of the view
		- Eventually they could be inputs
	- Chelsea recommended
		- Red for Overdue
		- Green for due today
		- something else for due in the next few days
- Creation of projects also needs a few QoL updates
	- Calling the board "experiments" is annoying
		- That's not fitting everywhere 
		- Need to check what else calls that by name
	- Is there really no way to combine the +/- board workflows?
		- That's a pretty big source of duplication at the moment
	- The way cards are made is fairly duplicated too
		- It would be nice not to have to make the experiment folder version every time and to have a bit more flexibility about the type of board you make with a project
		- Its currently a weird lock in

#### Cleaning up the Board Name and Duplication
- Looks like the New Card workflow references the Experiments board by name directly
	- I'd like to track the board in the project folder note metadata
		- Could use just the word, but then if its updated it won't auto update
		- Add a link to the board to all the project metadata
			- That will take a while to do retroactively
	-  

##### Board Types
- Experiment Board
- Kanban
	- Dated or Not
		- Take the default note content
- Task Board


# Tasks
- [ ] Add a Home Button or Hot Key - so annoying 
- [x] Sync Via GitHub and Continue Dev on Macbook ⏳ 2024-01-14 ✅ 2024-01-14
- [ ] Update Projects 
- [x] Collect utility scripts ✅ 2024-01-17
- [x] Refactor RecentsFile tables to remove duplication ✅ 2024-01-17
- [x] Update Task Urgency Colors to be less stressful ✅ 2024-01-17
- [x] Refactor variable Task Limits ✅ 2024-01-17
- [x] Make Dev Notebook and Sync ⏳ 2024-01-14 ✅ 2024-01-14
