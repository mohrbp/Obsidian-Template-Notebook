---
note_type: card
projectCategory: 
project:
  - "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
people: 
topics: 
created: 2024-01-31T09:57:44-06:00
parent_project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev|Notebook Dev]]"
---
# Notes
## Problem
- You frequently will write a task in the note that you are using to complete other tasks and then need to move that task to a new note where the new work happens
- Would be nice to keep that link in place and not just copy and paste the task after you create a new note

## Implementation
- Previously, you built a fairly complicated QuickAdd macro to Forward many types of content
- Probably only need to forward to a new note
	- As long as you can add a note to a card, idk why would really would need to forward it to a new Card

### Move new Page to a tp function
- Its got its own function now
- [newPage](04%20Resources/Notebook/Scripts/Templater/newPage.js)
- And is called through this templater [11 New Page](04%20Resources/Notebook/Templater/11%20New%20Page.md)

### Adding newPage to Tasks

- [06 Task Forward](04%20Resources/Notebook/Templater/06%20Task%20Forward.md)
	- Adding to either recent or new notes
	- This will probably just become the base on the general purpose task assigner
- I'd like it to be able to add cards too
	- Its somewhat tricky to then make the appropriate card and link if you are going to do that...
	- Maybe?
	- I already have a newCard Function
		- Whoops nope, its newBoard

### Challenges to address
- I'd like to clean up the link formatting because the regex/js I have from gpt is much better than me awkwardly formatting wikilinks 
	- Which won't always work
	- If I have the path, I can have a formatted, unaliased, markdown link in 1 line, without using a utility function
		- If its all in templater, I don't mind writing a function for it so its easy to modify/clean up
- The buildPageAndLink func returns just the name, despite having the tFile
	- I've written several thigns that awkwardly fetch the tFile after that and that's dumb
	- If I want the path, I need to TFile
- Cleaned that up nicely - I think
	- Replaced the output with new_TFile is most cases
	- Then called the .basename of that in place of the newFile
		- Didn't bother fixing too much downstream of that
- Updated the buttons to call the shorter templater scripts

### Cleaning up links
- So, part of the problem is that the properties seem to only tolerate wikilinks
	- Though they all have the full path in the, so that's not insurmontable
	- Just interconverting is sub par
	- https://forum.obsidian.md/t/properties-support-internal-markdown-links/63825
	- https://forum.obsidian.md/t/properties-support-external-markdown-links/76918
- Seems like links in Yaml isn't widely standard anyways
	- Could include some other formatted metadata, but bleh

# Tasks
- [x] Re-implement Task Forwarding ✅ 2024-02-18
