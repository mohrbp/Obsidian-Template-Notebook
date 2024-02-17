---
note_type: page
projectCategory: "null"
project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
people: 
topics: 
created: 2024-02-12T17:37
created_by: BMohr
total_tasks: 0
completed_tasks: 0
incomplete_tasks: 0
---
# Notes

## Testing out using R

### LanzaChat 1

Certainly! Below is an R script that does what you described—convert a JSON object into a directory of Markdown files, filtering by a specific assignee's name, and properly nesting subtasks:

```r
library(jsonlite)
library(purrr)

# Assignee filter
assignee_name <- "YourAssigneeNameHere"

# Read JSON data
json_data <- '{
  "data": [
    // ... (Your JSON entries here)
  ]
}'

# Parse JSON
data <- fromJSON(json_data)

# Recursive function to write md files
write_md_files <- function(items, parent_path = getwd()) {
  walk(items, function(item) {
    if (item$assignee$name == assignee_name && item$resource_type %in% c("task", "milestone")) {
      dir_create(file.path(parent_path, item$gid))
      md_path <- file.path(parent_path, item$gid, paste(item$gid, "md", sep = "."))
      write_lines(paste0("# ", item$name, "\n\n", item$notes), md_path)
      
      if ("subtasks" %in% names(item) && !is.null(item$subtasks)) {
        write_md_files(item$subtasks, parent_path = file.path(parent_path, item$gid))
      }
    }
  })
}

# Create markdown files
write_md_files(data$data)

# Please note: You need to have the 'jsonlite' and 'purrr' packages installed to run this script.
# You can install them with `install.packages(c("jsonlite", "purrr"))` if necessary.
```

Please perform the following before you run this script:

1. Replace `YourAssigneeNameHere` with the actual name of the assignee you want to filter by.
2. Replace the JSON template in the `json_data` variable with your actual JSON data.
3. Run the script in an R environment. Make sure you have `jsonlite` and `purrr` packages installed. If not, you can install them using `install.packages`.

This script will create directories and Markdown files within your current working directory in R. If you wish to specify a different path, pass it to the `parent_path` argument of the `write_md_files` function.

## Json/csv converter with Handlebars

```handlebars
  {{#if subtasks.length}}
    {{#each subtasks}}
      {{../name}}/{{name}}
    {{/each}}
  {{else}}
    {{name}}
  {{/if}}
```

`${#if subtasks.length}${#each subtasks}${../name}/${name]{/each}`

````handlebars
{{#tasks}}{{name}}{{#subtasks}}/{{name}}{{/subtasks}}{{/tasks}}
````
#### File Names

https://github.com/farling42/obsidian-import-json/commit/6ba5e6d0c0b2502dfa92f2d85c1f02b801a3eb59
``` js
	row.dataRoot = objdata;
			if (sourcefilename) row.SourceFilename = sourcefilename;   // provide access to the filename from which the data was taken.

			let notefile = objfield(row, settings.jsonName);
			let notefile : any = settings.jsonName;
			notefile = (notefile.contains("${")) ? (new Function('row', `return \`${notefile.replaceAll("${","${row.")}\``))(row) : objfield(row, notefile);
			// Ignore lines with an empty name field
			if (typeof notefile === "number") notefile = notefile.toString();
			if (!notefile || notefile.length == 0) continue;
```

```typescript
${name}/${subtasks.map(subtask => subtask.name).join(', ')}

```

```
${name}/${subtasks.map(subtask => subtask.name)}

${name}/${subtasks.map(subtask => subtask.name).join('/${name}/')}

${name}/${subtasks.map(subtask => subtask.name)}


${name}/${subtasks.map(subtask => `${name}/${subtask.name}`)}
${name}/${subtasks.map(subtask => subtask.name).join(', ')}


```

## Currently, I do not have a solution to nested subtasks with json
# Tasks
