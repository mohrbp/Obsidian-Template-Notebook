---
note_type: card
projectCategory: 
project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
people: 
topics: 
created: 2024-01-17T12:53:14-06:00
---
# Notes
## Working on solutions 
- Make a Create a board script
	- Add
		- selection of board name and template from a list
		- add board link as Project metadata
	- Needs to be an actual tp.user func to be called in the templater command
		- Call this at the end of the Create a Project templater, with the option of if you want to use it or not 
	- Make a button that has select project in front of the tp.user to add a board to a project
		- Could also include your catches for there already being a board
- Templates for different types of boards
	- Kanban 
		- Undated folder notes
	- Experiments
		- Dated Folder note
	- Task board
		- Dates Folder note
		- Aggregated as a task
		- Need to update the tasks assigner
			- To find these boards
				- Ask if you want to assign to a note or board
				- call the board something different and then you'll be able to aggregate the "-[ ]" from this note
			- to select a header
			- to create a note from the template
- Create new card
	- A separate function from create new task
		- JK THEY ARE ALL CARDS - This needs to just avoid the task boards, because those aren't cards?
			- I guess they're both and that's that.
	- Needs to actually use the template from the board as the default
		- Right now it prompts you to select again, which is kinda wild and could lead to trouble
	- Select from projects
		- Find their board from their frontmatter
		- Find the default note type from the content
		- Prompt for what to add
- Add a page to card
	- If they're all folder notes, why not be able to add pages to all of them
	- not sure they really need a notebook folder, but it could be convenient 

## Identifying problems
### Cleaning up the Board Name and Duplication
- Creation of projects also needs a few QoL updates
	- Calling the board "experiments" is annoying
		- That's not fitting everywhere 
		- Need to check what else calls that by name
	- Is there really no way to combine the +/- board workflows?
		- That's a pretty big source of duplication at the moment
	- The way cards are made is fairly duplicated too
		- It would be nice not to have to make the experiment folder version every time and to have a bit more flexibility about the type of board you make with a project
		- Its currently a weird lock in
- Looks like the New Card workflow references the Experiments board by name directly
	- I'd like to track the board in the project folder note metadata
		- Could use just the word, but then if its updated it won't auto update
		- Add a link to the board to all the project metadata
			- That will take a while to do retroactively
	-  

### Adding to cards
- Since most cards are folder notes, it makes sense to be able to add new pages to them
	- The embeds are still fine given that 

### Board Types
- Experiment Board
- Kanban
	- Dated or Not
		- Take the default note content
- Task Board
	- i.e. aggregate task items from this note into the GTD


# Tasks
- [ ] Add a method to add a page to a recent card ⌛ 2024-01-17 
