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
		- Subfolders
			- notebook
	- Experiments
		- Dated Folder note
		- Subfolders
			- data 
			- analysis
			- notebook
		- Could aggregate experimental tasks only in the Project boards and not more widely?
	- Task board - Future Feature
		- Dates Folder note
		- Subfolders
			- notebook
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
	- 

### Splitting the old template
- Working from [22 New Project with Board](04%20Resources/Notebook/Templater/22%20New%20Project%20with%20Board.md)
	- Deleted the other New project template because it was just not updated.
	- Added two new card templates for just Kanban and Experiments
		- Both use the same Board template file
	- Updated this to [20 New Project Base](04%20Resources/Notebook/Templater/20%20New%20Project%20Base.md)
	- Created a standalone [newBoard](04%20Resources/Notebook/Scripts/Templater/newBoard.js) script that is called above and in [26 New Board](04%20Resources/Notebook/Templater/26%20New%20Board.md) templater script
### Updating the creation of new cards
- Took a while but worked through a new card script that works for all locations
	- Two types of cards for the two ttpes of boards
		- Kanban and experiments 
		- Saving task boards for later
		- Files
			- [24 Kanban Card Template](04%20Resources/Notebook/Note%20Templates/24%20Kanban%20Card%20Template.md)
			- [24 Experiment Card Template](04%20Resources/Notebook/Note%20Templates/24%20Experiment%20Card%20Template.md)
			- There is still a decent bit of code overlap between these two and could be further reduced. 
	- References the "board" property in the project file frontmatter
		- So you will need to retrofit the old boards
			- But its better long term because you can keep the links updated if things move
		- Added a new utility built from GPT that returns the path, parent directory or alias of a wikilink 
		- And added the board_type property to the board files
- Ran into some naming issues with the creation of the folder note
	- Selecting the new name worked in the script, but could create some issues downstream
- Thought I may have timing issues but didn't need to add any Timeouts

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
- [x] Update adding new boards, board types and Add Card function to link the project file ✅ 2024-01-22
- [x] Update existing boards with new methods ⏳ 2024-01-23 ✅ 2024-01-23
- [ ] Add a method to add a page to a recent card 