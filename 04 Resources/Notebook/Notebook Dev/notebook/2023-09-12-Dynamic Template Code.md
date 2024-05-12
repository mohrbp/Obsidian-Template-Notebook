---
topics: "[[03 Areas/Software/Obsidian/Obsidian|Obsidian]]"
note_type: page
projectCategory: "null"
project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
created: 2023-09-12
---

## Development
- Worth noting that this method uses dataview with the dv.pages command in order to collect all the info
- It was difficult to tell what the appropriate way to get the output of the suggestor into the file include, but I borrowed from another source and found you need a tR statement along with the ${} notation
- These three posts were helpful
	- [Folder templates with quick switcher](https://zachyoung.dev/posts/folder-templates-with-quick-switcher)
	- [Templater - How to select and include template from tp.system.suggester? - Help - Obsidian Forum](https://forum.obsidian.md/t/templater-how-to-select-and-include-template-from-tp-system-suggester/45158/2)
	- [Help combining templates, javascript If-Then and Suggester - Help - Obsidian Forum](https://forum.obsidian.md/t/help-combining-templates-javascript-if-then-and-suggester/60672/5)
	- Plus docs 
		- [Execution Commands - Templater](https://silentvoid13.github.io/Templater/commands/execution-command.html)
		- [tp.file - Templater](https://silentvoid13.github.io/Templater/internal-functions/internal-modules/file-module.html#tpfileincludeinclude_link-string--tfile)

## Code
```

<%* 
const dv = this.app.plugins.plugins["dataview"].api

const bucketID = await tp.system.suggester(t => t, ["yes", "no"]);
const allProjects = dv.pages('"Notebook/Templates"')

if ( !bucketID ) {
  window.alert("No project was chosen! Expect anomalies")
  return
}

const chosenProjects = allProjects
  .where( p => p.template == bucketID )
  .file
  .sort( f => f.name )
  
const chosen = await tp.system.suggester(chosenProjects.name, chosenProjects.name)
tR += await tp.file.include(`[[${chosen}]]`)
%>
```



