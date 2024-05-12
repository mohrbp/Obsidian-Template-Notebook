---
note_type: page
projectCategory: "null"
project: "[[04 Resources/Notebook/Notebook Dev/kanban/Dashboard/Dashboard.md|Dashboard]]"
people: 
topics: 
created: 2024-04-01T13:54
---
# Notes
### Playing with CSS to get this to work
- Multicolumn from the modular CSS layout seems to be working nicely for this
	- https://efemkay.github.io/obsidian-modular-css-layout/multi-column/02-multi-column-callout/
	- https://github.com/efemkay
	- https://forum.obsidian.md/t/modular-css-layout-snippets-for-wide-views-multi-column-and-gallery/40534/12
- Cards from Minimal are useful for this too
	- https://github.com/kepano/obsidian-minimal

> [!multi-column]
> > [!Todo]+ Deliverables Milestone
> > ```dataviewjs 
> > dv.view("04 Resources/notebook/Scripts/Dataview/recents", {"target": dv.current().note_type, "change": "modifiedNotes", "recent": 30})
> > ```
> 
> > [!Summary]+ Funding Milestone
> > - Series A: $ 1.1 mil
> > - Series B: ongoing
> > - Series C: planned
> 
> > [!Todo]+ Deliverables Milestone
> > - [ ] test

```dataviewjs 
dv.view("04 Resources/notebook/Scripts/Dataview/recents", {"target": dv.current().note_type, "change": "modifiedNotes", "recent": 30})
```

const books = dv.pages('"02 Projects"');
books.forEach(el=>{
	let div = dv.el("div",null,{cls:"card"});
	console.log("file::",el.file)
  let eleHtml = `
		<img src="${el.image}" class="book-image" />
		<div class="book-image">
			<a data-href="${el.file.name}" href="${el.file.name}" class="internal-link" target="_blank" rel="noopener">${el.file.name}</a>
		</div>
		<h3>${el.title}</h3>`;
  div.innerHTML = eleHtml;
});

```
# Tasks
