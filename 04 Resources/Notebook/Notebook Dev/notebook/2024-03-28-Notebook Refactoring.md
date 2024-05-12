---
note_type: page
projectCategory: "null"
project: "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
people: 
topics: 
created: 2024-03-28T08:16
---
# Notes
### Built a script to refactor Headings
[refactorNote](04%20Resources/Notebook/Scripts/Templater/refactorNote.js)
[32 Refactor Note](04%20Resources/Notebook/Templater/32%20Refactor%20Note.md)

### Some useful Templater scripts

#### Move the Note to selected location and update frontmatter
![33 Move Note](04%20Resources/Notebook/Templater/33%20Move%20Note.md)

#### Add the created date to the file name
<%*
let created = tp.frontmatter.created
await tp.file.rename(created + "-" + tp.file.title) 
%>

#### Make a folder in this folder for all weeks in 2023
<%*
const dv = this.app.plugins.plugins["dataview"].api;
const { DateTime } = dv.luxon;
let thisPath = tp.file.folder(true);
// Get the first Sunday of the year 2023
let sunday = DateTime.fromObject({ year: 2023, month: 1, day: 1 }, { zone: 'utc' });

// If the first day of the year isn't Sunday, move to the next Sunday
if (sunday.weekday !== 7) {
  sunday = sunday.plus({ days: 7 - sunday.weekday });
}

// Loop through all the weeks of 2023
for (let week = 1; week <= 5; week++) {
    // Format the string as specified: 'WW-MMMDD'
    const formattedDate = `${week.toString().padStart(2, '0')}-${sunday.toFormat('LLLdd')}`;

    // Call your function with the formatted string
    //yourFunction(formattedDate);
    await this.app.vault.createFolder(thisPath + "/" + formattedDate);
	console.log(formattedDate);
    // Go to the next Sunday
    sunday = sunday.plus({ weeks: 1 });
}

%>
# Tasks
