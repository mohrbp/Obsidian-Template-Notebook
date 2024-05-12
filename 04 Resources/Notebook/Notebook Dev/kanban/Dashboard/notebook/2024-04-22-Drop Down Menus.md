---
note_type: page
projectCategory: "null"
project:
  - "[[04 Resources/Notebook/Notebook Dev/kanban/Dashboard/Dashboard.md|Dashboard]]"
people: 
topics: 
created: 2024-04-22T12:25
selectedHour: "03"
enteredText: Wonderful!
---
# Notes

## Using dropdown to filter by metadata



``` dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/datadependentdropdown", {"category": 'project'})
```


## Fuck me does JS do cool stuff sometimes
### Select a Tag

``` dataviewjs
const container = dv.container;
const selectElement = dv.el('select');
let tagSet = new Set(dv.pages().file.tags); 

for (let tag of tagSet) {
    const option_tag = dv.el('option', `${tag}`);
    selectElement.appendChild(option_tag);
}

container.appendChild(selectElement);

const dynamicContentContainer = dv.el('div');
container.appendChild(dynamicContentContainer);

selectElement.addEventListener('change', function() {
    dynamicContentContainer.innerHTML = '';

    let selectedValue = this.value;
    let tag_pages = dv.pages(`${selectedValue}`);

    dynamicContentContainer.appendChild(dv.el('span', `<br><b>${selectedValue}</b><br>`));

    for (let page of tag_pages) {
    dynamicContentContainer.appendChild(dv.el('span', `${page.file.link}<br>`));
    }
});
```
### Select an Hour
``` dataviewjs
function renderTimeDropdown(frontmatterField) {
    const select = dv.el('select');
    select.innerHTML = '<option value="">--</option>'; // Add empty option as default

    // Populate select dropdown with 24-hour time format options
    for (let hour = 1; hour < 25; hour++) {
        const hourString = hour.toString().padStart(2, '0'); // Ensure two-digit format
        const option = dv.el('option', hourString);
        option.value = hourString;
        select.appendChild(option);
    }

    // Event listener to update frontmatter field with selected hour
    select.addEventListener('change', () => {
        const selectedHour = select.value;
        let file = app.workspace.getActiveFile();
        app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter[frontmatterField] = selectedHour;
        });
    });

    dv.span(select);
}

// Example usage:
renderTimeDropdown("selectedHour");

```

```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/selectHour", {"targetField": "TestField for whom?"})
```

``` dataviewjs
function renderTextField(frontmatterField) {
    const input = dv.el('input');
    input.type = 'text';

    // Event listener to update frontmatter field with entered text
    input.addEventListener('change', () => {
        const enteredText = input.value;
        let file = app.workspace.getActiveFile();
        app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter[frontmatterField] = enteredText;
        });
    });

    dv.span(input);
}

// Example usage:
renderTextField("enteredText");

```

``` dataviewjs
function renderTimeDropdown(frontmatterField) {
    const hourSelect = dv.el('select');
    hourSelect.innerHTML = '<option value="">--</option>'; // Add empty option as default

    const minuteSelect = dv.el('select');
    minuteSelect.innerHTML = '<option value="">--</option>'; // Add empty option as default

    // Populate hour select dropdown with 24-hour format options
    for (let hour = 0; hour < 24; hour++) {
        const hourString = hour.toString().padStart(2, '0'); // Ensure two-digit format
        const option = dv.el('option', hourString);
        option.value = hourString;
        hourSelect.appendChild(option);
    }

    // Populate minute select dropdown with options from 00 to 59
    for (let minute = 0; minute < 60; minute++) {
        const minuteString = minute.toString().padStart(2, '0'); // Ensure two-digit format
        const option = dv.el('option', minuteString);
        option.value = minuteString;
        minuteSelect.appendChild(option);
    }

    // Event listener to update frontmatter field with selected hour and minute
    const updateFrontmatter = () => {
        const selectedHour = hourSelect.value;
        const selectedMinute = minuteSelect.value;
        let file = app.workspace.getActiveFile();
        app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter[frontmatterField] = `${selectedHour}:${selectedMinute}`;
        });
    };

    hourSelect.addEventListener('change', updateFrontmatter);
    minuteSelect.addEventListener('change', updateFrontmatter);

    dv.span(hourSelect);
    dv.span(minuteSelect);
}

// Example usage:
renderTimeDropdown("selectedTime");

```
``` dataviewjs
function renderTimeDropdown(frontmatterField) {
    const select = dv.el('select');

    // Add empty option as default
    const defaultOption = dv.el('option', '--');
    defaultOption.value = '';
    select.appendChild(defaultOption);

    // Populate select dropdown with 24-hour time format options
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const hourString = hour.toString().padStart(2, '0'); // Ensure two-digit format for hour
            const minuteString = minute.toString().padStart(2, '0'); // Ensure two-digit format for minute
            const option = dv.el('option', `${hourString}:${minuteString}`);
            option.value = `${hourString}:${minuteString}`;
            select.appendChild(option);
        }
    }

    // Event listener to update frontmatter field with selected time
    select.addEventListener('change', () => {
        const selectedTime = select.value;
        let file = app.workspace.getActiveFile();
        app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter[frontmatterField] = selectedTime;
        });
    });

    dv.span(select);
}

// Example usage:
renderTimeDropdown("selectedTime");

```

# Tasks

