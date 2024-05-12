---
note_type: page
projectCategory: "null"
project:
  - "[[04 Resources/Notebook/Notebook Dev/kanban/Task Forwarding/Task Forwarding.md|Task Forwarding]]"
people: 
topics: 
created: 2023-12-27T00:00:00.000-06:00
refactored: 2024-04-02T18:11
count: 0
cssclasses: []
---
# Notes

## Buttons in Dataview
https://forum.obsidian.md/t/using-metaedit-buttons-templater-nldates-and-dataview-together/35911
https://www.reddit.com/r/ObsidianMD/comments/rre6wk/button_to_add_or_substract_from_yaml_or_dataview/

```dataviewjs
dv.view("04 Resources/Notebook/Buttons/increment", {"target": "total_tasks"})
```

https://forum.obsidian.md/t/is-there-a-plugin-that-allows-you-to-make-a-drop-down-list-like-this/57017/7
```dataviewjs
const selectElement = dv.el('select');
const option1 = dv.el('option', "Option 1");
const option2 = dv.el('option', "Option 2");
const option3 = dv.el('option', "Option 3");

selectElement.appendChild(option1);
selectElement.appendChild(option2);
selectElement.appendChild(option3);

selectElement;
```

```dataviewjs
const button = dv.el('button', 'Click me');

button.onclick = () => {
	//Whatever code you want to execute
    console.log('Button clicked!');
};

dv.table(
	["Column 1","Buttons"], 
	[["Bar",button]]
);

```

https://stackoverflow.com/questions/9643311/pass-a-string-parameter-in-an-onclick-function
### I wonder how hard it is to add buttons to tables?
#### Minimally lets you click to complete a task (with the date!)

#### Also could add forwarding and scheduling

### Advanced URI

<a href="Advanced Uri link"><button>name of the button</button></a>

### Meta Bind
Meta Bind has an in plugin help page. `BUTTON[help-button]` Isn't that cool?
https://forum.obsidian.md/t/create-button-using-javascript-meta-bind/75240

```meta-bind-button
style: primary
label: Help Commands
actions:
  - type: command
    command: command-palette:open
  - type: input
    str: help
```


#### Button definition
```meta-bind-button
style: destructive
label: Light Mode
id: light-mode
hidden: false
actions:
  - type: command
    command: theme:use-light
```

``` meta-bind-button
style: primary
label: Dark Mode
id: dark-mode
hidden: false
actions:
  - type: command
    command: theme:use-dark
```
```
style: destructive
label: Light Mode
id: light-mode
hidden: false
actions:
  - type: command
    command: theme:use-light
```

``` 
style: primary
label: Dark Mode
id: dark-mode
hidden: false
actions:
  - type: command
    command: theme:use-dark
```
#### Inline buttons
Theme Switcher: `BUTTON[light-mode, dark-mode]`

#### Incrementing button
##### Code
```
label: "+1"
hidden: true
id: "count-increment"
style: default
actions:
  - type: updateMetadata
    bindTarget: count
    evaluate: true
    value: x + 1
```

```
label: "-1"
hidden: true
id: "count-decrement"
style: default
actions:
  - type: updateMetadata
    bindTarget: count
    evaluate: true
    value: x - 1
```

```
label: "Reset"
hidden: true
id: "count-reset"
style: default
actions:
  - type: updateMetadata
    bindTarget: count
    evaluate: false
    value: 0
```

`BUTTON[count-decrement, count-reset, count-increment]` `VIEW[{count}]`
##### Button
```meta-bind-button
label: "+1"
hidden: true
id: "count-increment"
style: default
actions:
  - type: updateMetadata
    bindTarget: count
    evaluate: true
    value: x + 1
```
```meta-bind-button
label: "-1"
hidden: true
id: "count-decrement"
style: default
actions:
  - type: updateMetadata
    bindTarget: count
    evaluate: true
    value: x - 1
```

```meta-bind-button
label: "Reset"
hidden: true
id: "count-reset"
style: default
actions:
  - type: updateMetadata
    bindTarget: count
    evaluate: false
    value: 0
```

`BUTTON[count-decrement, count-reset, count-increment]` `VIEW[{count}]`
```meta-bind-button
style: destructive
label: Light Mode
id: light-mode
hidden: true
actions:
  - type: command
    command: theme:use-light
```

```meta-bind-button
style: primary
label: Dark Mode
id: dark-mode
hidden: true
actions:
  - type: command
    command: theme:use-dark
```
### Help Button 
![[04 Resources/Notebook/Notebook Dev/kanban/Task Forwarding/notebook/2023-12-27-Help Button.md|2023-12-27-Help Button]]
# Tasks
- [ ] Review what it takes to add buttons to dataview tables
