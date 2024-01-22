---
completed_tasks: 6
created: 2023-06-15
edits:
  - 2023-06-15
  - 2023-06-16
note_type: page
incomplete_tasks: 1
projectCategory: 
total_tasks: 7
project:
  - "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
---
# Content
## The problem

![A Structure to capture experiments ran by me and my reports](01%20Home/2023/Notebook%20Design%20Docs/2023%20Notebook%20Design%20Document.md#A%20Structure%20to%20capture%20experiments%20ran%20by%20me%20and%20my%20reports)

## Work towards this
### Importing from Asana
- Exports are available as JSON and CSV
- I think I need to sanitize the CSV because of "Section/Column" having a dis-allowed character 
- Greater flexibility using the JSON,
	-  don't know that I need local storage for that, 
		- but that's not really a thing I'm looking for 
			- Definitely want backups of the Asana page for data tracking
- I have a Handlebar Template to import Asana JSON
	- It's development is captured [2023-06-15-AsanaReportingNotes](04%20Resources/Notebook/Notebook%20Dev/notebook/2023-06-15-AsanaReportingNotes.md)
	- The fundamental learning was to use functions like `{{substring JSONitem X Y}}` rather than `{{substring {{JSONitem}} X Y}}`
	- The JSON importer tool appears to use the entire Handlebar Helper Library 
		- https://github.com/Budibase/handlebars-helpers
		- Using Contains and Substr
```
await tp.file.move('General/Exp/' + tp.frontmatter["experiment-type"] + '/' + '{{#if completed_at}}/archive/{{else}}{{/if}}' + tp.frontmatter["date-created"] + "-" + tp.config.target_file.basename + '/' + tp.frontmatter["date-created"] + "-" + tp.config.target_file.basename) 
```
#### Dealing with Dataview
- Burning out the Markdown of the tables
	- You can use the dv.markdownTable options in dataviewjs to make tables that export and render as markdown
	- https://github.com/blacksmithgu/obsidian-dataview/issues/42#issuecomment-1208172616

- This data table query shows how to access and filter the file.outlinks
``` 
dv.table(["File", "Out"],
	dv.pages()
	.filter(b => JSON.stringify(b.file.outlinks).includes("DAHPAssay"))
	.map(b => [b.file.link, b.file.outlinks]))
```

``` 
dv.pages()
	.filter(b => JSON.stringify(b.file.outlinks).includes("DAHPAssay")).forEach(p => dv.paragraph(dv.fileLink(p.file.name, true)))
```
- this "works", but is glitchy. May need to click through the blocks to make sure everything is rendered before outputting
	- But the outputs look okay too.
	- Annoying that you can't click into any of the links
		- That's why having the tasks above is nice


- These are Markdown pasting examples
	- The embeds are "working" okay so far
	- Probably want to try to burn in the progress bars

``` 
// Render a simple table of book info sorted by rating.
const table = dv.markdownTable(["File", "experiment-name", "mtime"], dv.pages('"General/Resources/Team/Yejun Kim"')
    .where(b => b.experiment-name.contains("DAHPAssay")))

dv.paragraph(table);
```
``` dataviewjs
// Render a simple table of book info sorted by rating.
const table = dv.markdownTable(["File", "experiment-name", "mtime"], dv.pages('"General/Resources/Team/Yejun Kim"')
    .where(b => b.experiment-name.contains("DAHPAssay")))

dv.paragraph(table);
```
``` 
const markdown = dv.markdownList([1, 2, 3]);
dv.paragraph(markdown);
```
``` dataviewjs
const markdown = dv.markdownList([1, 2, 3]);
dv.paragraph(markdown);
```
``` 
var pages = dv.pages().filter(page => page.file.name.includes('P1248'))
var pages = pages.sort(page => page.file.mtime, 'desc')
let embeds = pages.file.name.map( name => '![[' + name + ']]')
dv.list(embeds)
```
``` dataviewjs
var pages = dv.pages().filter(page => page.file.name.includes('P1248'))
var pages = pages.sort(page => page.file.mtime, 'desc')
let embeds = pages.file.name.map( name => '![[' + name + ']]')
dv.list(embeds)
```


### File structure Re-org
- Already started, but I think I want to be a bit more aggressive about it to pull Important stuff closer to the top and keep the functional parts close enough together.
- Definitely don't want to increase path lengths any further than necessary 
### A flexible way to generate templates for reports
- Current implementation
	- Reports bring slides as pptx into the meeting
		- I export those slides as images and import them into the meeting note
			- This will save them in the attachments folder (along with the pptx when it was linked)
	- I will highlight the slides on a given topic and run a macro
		- Two macros - one for each type of target note
		- Selected lines (usually the transcluded pptx slide images) are pasted into a new note of the given template
			- We are asked for project, team-member and experiment name (if applicable)
			- a templater tp.file.move command is used to place the file in a subfolder of the team-member 
				- Cell-free Team is also a team-member and works equivalently
		- The original file (the meeting you're selecting from) is refocused
		- A second capture is run, using the format for the capture as the a transcluded **Markdown** style link. This doesn't work with wiki links because of the lack of escape characters in the Team-members names 
			- Hyphenating them would solve this
			- Only a problem if it doesn't export correctly
- **Nope. this doesn't work** A Button linked to a quick add Multi
	- These are the problems
		- These need to be a macro in order to capture correctly
		- I've made two new notes which capture into the appropriate teams folder 
			- These are distinct from the macros that I use since file structure and such is different
	- Multi contains
		- Experimental Note template - team variant
		- Atomic note -team variant
- Team variants use
	- `{{FIELD:<FIELDNAME>}}` as defined in the QuickAdd docs https://quickadd.obsidian.guide/docs/FormatSyntax to suggest the value
		- Suggestor doesn't work with inline link
	- For lead and team (not sure if this works with a list)
		- Doesnt work inline as a list
	- Haven't really aligned on what makes the most sense here
		- I think leaving the MOC style links to the reports makes some sense, but also prevents them from being autosuggested
- Need to move the file using templater command after this selection 
	- This is realistically probably neater than putting it in the long file name to generate
- Need to rearrange folders for 1 each for individuals and team members
	- General/Resources/Team/ReportNameorTeam/Meetings/YYYY-MM-MMM 
		- Meeting notes go directly in these folders
		- Attachments are in subfolder under Meetings
		- Notes are in each monthly folder 
			- These are all of the extract experimental and atomic notes from our meetings
			- Trying to avoid file spam while keeping stuff in a usable location.
### Having a clean "Experimental Note" template
- I have one for my reports, which will let me capture what they are showing me in meetings into the appropriate aggregator
- I will just add the inline metadata field for experiment-name: when I need it - shouldn't be too bad since it can be autocompleted through the link
- Tempting to go to Fileclasses and auto-populated metadata for stuff like this
	- Particularly if Metadata Menu can auto suggest all of the experiments from the file 
		- lol the extra move would be to only select the actives ones. 
# Action Items
- [x] Make atomic notes for Reports ✅ 2023-06-15
- [x] Redo meeting notes for group and reports ✅ 2023-06-15
- [x] Make an import template for Asana JSON content ✅ 2023-06-15
- [x] Templater script to move Asana import files to proper location ✅ 2023-06-23
- [>] [2024-01-18-Obsidian Metadata Bulk Edit](04%20Resources/Notebook/Notebook%20Dev/notebook/2024-01-18-Obsidian%20Metadata%20Bulk%20Edit.md) Test obsidian-metadata to update status
- [-] Exporting with New Tool
- [x] Re-organize notes to decrease path length and maximize functional visibility ✅ 2023-06-23




Date:: [[01 Home/2023/06-Jun/24/2023-06-15]]
#Organization/Obsidian