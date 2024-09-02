async function newPage(tp, dv) {
    // Load the note filter and configuration
    const { noteFilter } = await cJS();
    const config = noteFilter.loadConfig(dv);
    const admin = config.admin;
    const fileYear = tp.date.now("YYYY");
    const today = tp.date.now("YYYY-MM-DD");
    const now = tp.date.now("YYYY-MM-DDTHH:mm:ss[Z]")

    // Determine the destination for the new note
    const noteDest = admin ? await tp.system.suggester(["Inbox", "Root"], ["Inbox", "Root"], true, "Select Note Destination") : "Root";
    
    let fileTemplate, destinationNoteBook;

    // For destinations other than Inbox
    if (noteDest !== "Inbox") {
        // Get possible input suggestions
        let { inputSug, inputVal } = noteFilter.getInputSuggestions(dv, noteDest, config);

        // Select the collection
        const collection = await tp.system.suggester(inputSug, inputVal, true, "Select a Collection");

        // Determine the destination notebook
        destinationNoteBook = await noteFilter.determineDestinationNotebook(tp, dv, collection, config);

        // Get available templates for the selected notebook
        const destNoteBookTemplates = noteFilter.getTemplateSuggestions(dv, destinationNoteBook);
        fileTemplate = await tp.system.suggester(destNoteBookTemplates.map(item => item.display), destNoteBookTemplates, true, "Select Note Template");
    }

    // Determine the target folder and file template note
    const { targetFolder, fileTemplateNote } = await noteFilter.getTargetFolderAndTemplate(tp, dv, noteDest, fileYear, fileTemplate, config, destinationNoteBook);
    // Prompt for the filename and construct the file path
    const fileName = await tp.system.prompt("Enter Note Name");
    const filePath = await noteFilter.buildFilePath(tp, fileTemplateNote, targetFolder, fileName, today);
    // Create the new file and apply frontmatter
    const newTFile = await noteFilter.createNewFile(tp, fileTemplateNote, filePath);
    await noteFilter.applyFrontmatter(newTFile, destinationNoteBook, fileTemplateNote, config, noteDest, now);

    return newTFile;
}

module.exports = newPage;