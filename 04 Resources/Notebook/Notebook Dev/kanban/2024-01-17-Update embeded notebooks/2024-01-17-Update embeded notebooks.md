---
note_type: card
projectCategory: 
project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
people: 
topics: 
created: 2024-01-17T17:44:41-06:00
---
# Notes
## Implementation

### Templater Script
[31 Embed Links](04%20Resources/Notebook/Templater/31%20Embed%20Links.md)
- Copied the general structure of the task assigner script with do and tp.suggester while selection
- Added to utility scripts to do the formatting
	- subsetByFolderDepth
		- Takes an array of files paths from dv.pagePaths and shows only the paths or notes at a certain depth
			- Can be adjusted for other file extensions
	- formatPaths
		- Takes an array of file paths and formats them as a list of tasks (for kanban) or as embeddeds with headers (for notebooks)

### Modifications
- There is not a defined sort order to the output
	- Its working kinda okay regardless of that
	- Worth considering if you want to embed only from a folder or a series of tags

## Problem
- Each of the projects, etc. with a notebook folder has all of those notes transcluded in the parent folder note
- This is to serve as a long-read traditional notebook of sorts
- Its very annoying to change where notes live, because then you need to update this series of embeds
	- I am currently defaulting to wikilinks for adding notes and front matter
		- It may be better to use markdown style links and it would take a gpt utility function to make that happen
### Other applications
- Realized this is basically the import for aspects for wildsea
### Additional considerations
- Could have a folder note in the "notebook" folder that aggregates all of the notes
- Embeding this in the project file may be lighter than directly embeding all of the files in the project file
	- Easier to update the project file with new aggregation
	- Slightly more atomic/composable
- Can also use a similar linking strategy to the boards to associate the files
	- Potentially this strategy could be used to add a note to any folder note with a notebook folder in it. 
### some options

#### Templater Burn-in

- Kinda like what you were proposing for the daily log, you could use templater to directly update the text of the project note with the appropriate transcludes
	- It would be nice if you could just bulk update your project files without worrying about running their contents
		- Updating just the appropriate DV queries to avoid the transcluded text is already worrisome 
- How to select
	- notebook folder in subdirectory is not bad
		- leaves you the ability to transclude other folder names
			- Experiments, Meetings, etc
		- Or loop through the folders to transclude everything
- How to burn in
	- Templater - update contents, I guess
	- I know there are some examples of this on the forums
		- Poked around a bit with this before
			- This is deals with burning in tables
			- And dynamic rendering of embeds
				- Neither of which are exactly what I'm looking for
				- Though burning in tables is how you'd keep a daily log
			- ![Dealing with Dataview](04%20Resources/Notebook/Notebook%20Dev/notebook/2023-06-15-AsanaReportingNotes.md#Dealing%20with%20Dataview)
	- This could also be a good use for gpt
	- 

# Tasks

