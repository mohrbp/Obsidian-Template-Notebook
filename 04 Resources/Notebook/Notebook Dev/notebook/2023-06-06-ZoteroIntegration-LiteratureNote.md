---
completed_tasks: 1
created: 2023-06-06
edits:
  - 2023-06-06
  - 2023-06-07
  - 2023-06-08
  - 2023-06-15
note_type: page
forwarded-from: "[2023-06-05-WeeklyReview](Notebooks/ByYear/2023/Journal/23/2023-06-05-WeeklyReview.md)"
incomplete_tasks: 0
projectCategory: "null"
topics: "[[03 Areas/Software/Obsidian/Obsidian|Obsidian]]"
total_tasks: 1
project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
---
# Notes
## Purpose
![Literature Review](01%20Home/2023/Notebook%20Design%20Docs/2023%20Notebook%20Design%20Document.md#Literature%20Review)
- You're getting most of the way there but aren't logging things
	- You've done sooooo much reading, but where is it distilled?
- Also your imports are pretty ugly and not useful for sharing into other downstream notes and analyses

## Drafting a literature Note
**Two Parts**
### Importing Highlights
- I use the Zotero Integration plugin for Obsidian
	- https://github.com/mgmeyers/obsidian-zotero-integration
	- This requires BetterBibTex Zotero Add-in
		- https://retorque.re/zotero-better-bibtex/installation/
		- ![](01%20Home/2023/23-Jun04/attachments/zotero-better-bibtex-6.7.79.xpi)
	- I Also use ZotFile to manage my attachments at a second location (e.g. in my zotero library)
		- ![](01%20Home/2023/23-Jun04/attachments/zotfile-5.1.2-fx.xpi)
- ZI uses a template file for importing highlights and annotations into a file in Obsidian
	- There is a large discussion on the Obsidian forum about template design
		- https://forum.obsidian.md/t/zotero-integration-import-templates/36310/112?page=4
		- All the below templates have come from this thread
	- [espaliaTemplate](01%20Home/2023/Notebook%20Design%20Docs/Templates/Depreciated/ZoteroIntegration/espaliaTemplate.md)
		- This is the dated template I have used for a while
	- [topheeTemplate](01%20Home/2023/Notebook%20Design%20Docs/Templates/Depreciated/ZoteroIntegration/topheeTemplate.md)
		- This is a more updated one that I will be using to adapt to my current purposes
	- [Mohr_ZI_ImportTemplate](01%20Home/2023/Notebook%20Design%20Docs/Templates/Depreciated/ZoteroIntegration/Mohr_ZI_ImportTemplate.md)
		- This is where I will make actual changes and use for the import

#### What does the template need to do?
- Import Image captures
- Highlights <- this is the big one
	- What do each Highlight colors mean
		- Yellow normal highlights
			- ideally comments in bold above
		- Red - Key Words
			- To be wrapped in `[[ ]]` and become "linking tags/MOC"
			- Key phrases (whispers??) could also be linked
		- Green - Headers
			- Easy to add "###" at the front 
			- It might be difficult to work with comments in addition to the highlight
				- It would be nice to be able to append a comment to add to the header
				- Easy to have that as a nice to have for the future, where you just don't add comments to green highlights
			- Linkable
		- Blue - A big F'ing deal
- Comments
	- How to arrange comments vs Highlights
		- I am quite liking the Bold 
#### Testing and Dev
- Using [Decrulle et al. - 2021 - Engineering gene overlaps to sustain genetic const](04%20Resources/Literature/Decrulle%20et%20al.%20-%202021%20-%20Engineering%20gene%20overlaps%20to%20sustain%20genetic%20const.pdf) as a Test document because it contains Yellow, Red, Blue and Green highlights, pictures and annotations.

### Collecting a reading session
- This is getting at the things I listed above
- This is a templater template fired off of QuickAdd to create a suggester for relevant YAML fields 
# Tasks
- [x] Prepare Literature review note ⏫ 📅 2023-06-07 ✅ 2023-06-08



Date:: [[01 Home/2023/23-Jun04/2023-06-06]]
#📓notebook