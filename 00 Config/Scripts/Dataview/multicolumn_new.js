function generateMultiColumnMarkdown(data) {
    // Validate input
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Input must be a non-empty array");
    }

    let markdown = "";
    // "> [!multi-column]\n";

    data.forEach(obj => {
        // Assuming 'propertyName' and 'propertyLink' are hardcoded properties
        // Safer to do this so that they can be validated 
        console.log(obj)
        const propertyName = obj.name;
        const propertyLink = obj.link;

        // Check if the hardcoded properties exist in the object
        if (propertyName !== undefined && propertyLink !== undefined) {
            markdown += `> > [!${propertyName}]+ ${propertyName}\n`;
            markdown += `> > \`\`\`dataviewjs \n`;
            markdown += `> > dv.view("00 Config/Scripts/Dataview/notesQuery_new", {"target": ${JSON.stringify(propertyLink)}, "traversalType":"child"})\n`;
            markdown += `> > \`\`\`\n`;
            markdown += ">\n"; // Add a line break after each property
        }
    });

    return markdown;
}

const { DateTime, Duration } = dv.luxon;
const { notebookManager } = await cJS();
let target = input.target;
let targetNote = notebookManager.createNoteObject(dv, target.path);
let nestedInput = {
    parent: [targetNote]
};

// let allChildNotes = await notebookManager.getAllChildNotes(dv, nestedInput);

let allChildNotes = await notebookManager.traverseNotebook(dv, nestedInput, {
    recursive: true,
    includeSource: true,
    formatOutput: false,
    traversalType: 'child_branch'
});

console.log("allChildNotes",allChildNotes)

// let taskFilter = {noteType: { includePaths: targetNote.noteType.path }} 

// for (let cat in allChildNotes) {
//     taskFilter[cat] = {
//         includePaths: [targetNote.path],
//         excludePaths: []
//     };
//     for (let index in allChildNotes[cat]) {
//         taskFilter[cat].includePaths.push(String(allChildNotes[cat][index].path));
//     }
// }

// let subprojects = dv.pages()
//     .filter(p => notebookManager.dataFilter([p], taskFilter).length > 0)

let subProjectPaths = Object.values(allChildNotes)
            .flat()
            .map(note => note.page?.file?.path ?? [])

let subprojects = dv.pages()
                    .file
                    .filter(p => subProjectPaths.includes(p.path))

console.log("subprojects",subprojects)
let markdownText = generateMultiColumnMarkdown(subprojects);

let markdownNotebook = `> [!multi-column]\n` +
            `> > [!Notebook]+ Notebook\n` +
            `> > \`\`\`dataviewjs \n` +
            `> > dv.view("00 Config/Scripts/Dataview/notesQuery_new", {"target": dv.current().file.link, "traversalType":"child_branch"})\n` + 
            `> > \`\`\`\n` +
            `>\n`;

markdownNotebook += markdownText;

dv.paragraph(markdownNotebook)

let elements = document.getElementsByClassName('block-language-dataviewjs');
for (let i = 0; i < elements.length; i++) {
  let item = elements.item(i);
  item.setAttribute("style", "overflow:auto;");
}




