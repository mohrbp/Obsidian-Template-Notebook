function generateMultiColumnMarkdown(data) {
    // Validate input
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Input must be a non-empty array");
    }

    let markdown = "> [!multi-column]\n";

    data.forEach(obj => {
        // Assuming 'propertyName' and 'propertyValue' are hardcoded properties
        // Safer to do this so that they can be validated 
        const propertyName = obj.name;
        const propertyValue = obj.frontmatter.project;

        // Check if the hardcoded properties exist in the object
        if (propertyName !== undefined && propertyValue !== undefined) {
            markdown += `> > [!${propertyName}]+ ${propertyName}\n`;
            markdown += `> > \`\`\`dataviewjs \n`;
            markdown += `> > dv.view("04 Resources/notebook/Scripts/Dataview/notesQuery", {"targetProject": "${propertyName}"})\n`;
            markdown += `> > \`\`\`\n`;
            markdown += ">\n"; // Add a line break after each property
        }
    });

    return markdown;
}

let target = input.target;
let query = dv.current()[target];

let subprojects = dv.pages()
	.where(p => p.note_type == "project" | p.note_type == "card")
	.where(p => String(p.parent_project).indexOf(query) != -1)
	.file

//let headers = subprojects.name.values
// headers.unshift("notebook")


let markdownText = generateMultiColumnMarkdown(subprojects);

dv.paragraph(markdownText)

let elements = document.getElementsByClassName('block-language-dataviewjs');
for (let i = 0; i < elements.length; i++) {
  let item = elements.item(i);
  item.setAttribute("style", "overflow:auto;");
}




