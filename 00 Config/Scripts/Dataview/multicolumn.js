function generateMultiColumnMarkdown(data) {
    // Validate input
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Input must be a non-empty array");
    }

    let markdown = "";
    // "> [!multi-column]\n";

    data.forEach(obj => {
        // Assuming 'propertyName' and 'propertyValue' are hardcoded properties
        // Safer to do this so that they can be validated 
        console.log(obj)
        const propertyName = obj.file.name;
        const propertyValue = obj.parent;

        // Check if the hardcoded properties exist in the object
        if (propertyName !== undefined && propertyValue !== undefined) {
            markdown += `> > [!${propertyName}]+ ${propertyName}\n`;
            markdown += `> > \`\`\`dataviewjs \n`;
            markdown += `> > dv.view("00 Config/Scripts/Dataview/notesQuery", {"target": dv.current().file.link})\n`;
            markdown += `> > \`\`\`\n`;
            markdown += ">\n"; // Add a line break after each property
        }
    });

    return markdown;
}

const { DateTime, Duration } = dv.luxon;
const { noteFilter } = await cJS();
let target = input.target;
let targetNote = noteFilter.createNoteObject(dv, target.path);
let nestedInput = {
    parent: [targetNote]
};

let allChildNotes = noteFilter.getAllChildNotes(dv, nestedInput);


let taskFilter = {noteType: { includePaths: targetNote.noteType.path }} 

for (let cat in allChildNotes) {
    taskFilter[cat] = {
        includePaths: [targetNote.path],
        excludePaths: []
    };
    for (let index in allChildNotes[cat]) {
        taskFilter[cat].includePaths.push(String(allChildNotes[cat][index].path));
    }
}

let subprojects = dv.pages()
    .filter(p => noteFilter.dataFilter([p], taskFilter).length > 0)


let markdownText = generateMultiColumnMarkdown(subprojects);

let markdownNotebook = `> [!multi-column]\n` +
            `> > [!Notebook]+ Notebook\n` +
            `> > \`\`\`dataviewjs \n` +
            `> > dv.view("00 Config/Scripts/Dataview/notesQuery", {"target": dv.current().file.link})\n` + 
            `> > \`\`\`\n` +
            `>\n`;

markdownNotebook += markdownText;

dv.paragraph(markdownNotebook)

let elements = document.getElementsByClassName('block-language-dataviewjs');
for (let i = 0; i < elements.length; i++) {
  let item = elements.item(i);
  item.setAttribute("style", "overflow:auto;");
}




