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
notes
{{notes}}

### Notes
{{Notes}}
## Aggregation
### Tasks
