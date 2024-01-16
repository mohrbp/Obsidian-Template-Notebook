---
{{#each memberships}}
{{#contains project.name "Assays"}}
status: {{section.name}}
{{else}}
project: {{project.name}}
{{/contains}}
{{/each}}
date-created: {{substring created_at 0 10}}
{{#if parent}}
task-type:: subtask
{{name}}
{{else}}
task-type: parent
{{/if}}
{{#if completed_at}}
archive-status: Archive
{{name}}
{{else}}
archive-status:
{{/if}}
{{#each custom_fields}}
{{#contains name "experiment-type"}}
experiment-type: {{display_value}}
{{name}}
{{/contains}}
{{/each}}
---
# Inline metadata
{{name}}
assignee:: {{#if assignee}}[[{{assignee.name}}]]{{/if}}
experiment-name:: [[{{name}}]]

# Content
## Task Description
{{notes}}

## Aggregation
### Tasks
``` dataview
table without id 
file.link as Name, ("<progress value="+((completed-tasks/total-tasks))+" max=1></progress>") as Status, completed-tasks as Complete, total-tasks as "Total Tasks"
Where contains(experiment-name, "{{name}}")
Sort file.name desc
```
### Embeds
``` dataviewjs
dv.pages()
	.where(b => JSON.stringify(b.file.outlinks).includes("{{name}}")
	&& b.file.name != "changelog"
	&& b.file.name != {{name}})
	.forEach(p => dv.paragraph(dv.fileLink(p.file.name, true)))
```


