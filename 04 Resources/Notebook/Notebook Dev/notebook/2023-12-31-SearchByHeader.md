---
completed_tasks: 0
created: 2023-12-31T20:27:00
created_by: BMohr
incomplete_tasks: 0
note_type: page
people: 
project:
  - "[[04 Resources/Notebook/Notebook Dev/Notebook Dev.md|Notebook Dev]]"
projectCategory: 
topics: 
total_tasks: 1
---
# Notes

### Progress
- Created [25 Make Child Card](04%20Resources/Notebook/Templater/25%20Make%20Child%20Card.md)
- Requires "# Child" in the Parent Card to be correctly linked
- So far does not import any properties. 
## Searching headers
https://gist.github.com/serpro69/c3adbd3b1bff5f2c03c59a6453ab883c
- Start with searching headers because its more fun

``` javascript example
let pages = dv.pages('#daylog');

// Loop through pages
for (let p of pages) {
  let noteText = await dv.io.load(p.file.path);

  // define headers to look for
  const headers = ["🧭 Personal", "💻 Work"];

  headers.map((header) => {
    // https://regex101.com/r/liL65A/1
    let regexPattern = new RegExp("#{1,6}\\s(" + header + ")\\n(.+?)(?:\\n#{1,6}|$)", "sg");
    let matches = regexPattern.exec(noteText);
    // check if we got a match and only then insert
    if (matches != null) {
      let fileName = p.file.name;
      let headerName = matches[1];
      let headerText = matches[2];
      // remove trailing line delimiter, if any, and trim whitespaces
      headerText = headerText
        .replace(new RegExp("\n---\n$"), "")
        .trim();
      // I have '- ...' placeholders in each header, so first check if the header section actually has any text
      if (headerText != "- ...") {
        // Insert into document however you like
        dv.paragraph(
          `> [!note] [[${p.file.name}#${headerName}]]` +
          "\n>" + 
          "\n" +
          headerText.split("\n").map((text) => `> ${text}`).join("\n>")
        );
      }
    }
  });
}
```

### Matching all and getting an array of capture groups
https://javascript.info/regexp-groups
## Refactoring

``` javascript
async function embedPageToTarget (tp, Target, Source, TargetHeading = null, NewHeading = null, linkToHeading = false){

  let targetNote = await tp.file.find_tfile(Target);
  let targetNoteContent = await app.vault.read(targetNote);

  let sourceNote = await tp.file.find_tfile(Source);

  (TargetHeading) ? targetHeading = TargetHeading : targetHeading = "# Notebook";
  let headerContent = targetHeading;
  if (NewHeading) headerContent = targetHeading + "\n" + NewHeading + sourceNote.basename;
  let linkContent = "\n ![[" + sourceNote.basename + "]]";
  if (linkToHeading) linkContent = "\n ![[" + sourceNote.path + NewHeading +"|" + sourceNote.basename + "]]";
  let headerReplacementContent = headerContent + linkContent;
  let targetNoteReplaced = targetNoteContent.replace(targetHeading, headerReplacementContent);
  await app.vault.modify(targetNote, targetNoteReplaced);
}
  
module.exports = embedPageToTarget;
```

- A lot of this is actually not useful in most of the implementations. 
  - I'll clone it, remake it simply and then replace it's functionality across the scripts. 

``` javascript
await tp.user.embedPageToTarget(tp, projectFile, (newPath + "/" + today + "-" + fileName), "# Notebook", "## ", linkToHeading = false); 
```

# Tasks
- [x] Refactor EmbedPagetoTarget ⏳ 2023-12-31 ✅ 2024-01-02
