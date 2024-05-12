function updateFrontmatterButton(frontmatterField, buttonText) {
    const button = dv.el('button', buttonText);
    const { DateTime } = dv.luxon;
    let file = app.workspace.getActiveFile();

    button.onclick = () => {
        const currentDate = DateTime.now().toISO({ includeOffset: true }); // Get current date and time in ISO format
        app.fileManager.processFrontMatter(file, (frontmatter) => {
            if (!frontmatter[frontmatterField]) {
                frontmatter[frontmatterField] = [];
            }
            frontmatter[frontmatterField].push(currentDate); // Append currentDate to the specified field
        });
    };
    
	if((dv.current()[frontmatterField] == "") | (dv.current()[frontmatterField] == null)) {
		button.style.display = "block";  // Show the button if the field is empty
		//console.log("if")
	} else if((dv.current()[frontmatterField] != "") | (dv.current()[frontmatterField] != null)) {
		//console.log("else")
		button.style.display = "none"; // Hide the button if the field is not empty
		dv.paragraph("Clicked")
	}	
	//console.log(dv.current()[frontmatterField])
}

// Showing the Button:
let targetField = input.targetField;
let fieldName = input.fieldName;
updateFrontmatterButton(targetField, fieldName);