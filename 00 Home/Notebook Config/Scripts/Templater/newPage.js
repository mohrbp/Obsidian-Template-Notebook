async function newPage(tp, dv) {
    // Initialize note filter and load configuration
    const { noteFilter } = await cJS();
    const config = noteFilter.loadConfig(dv);
    
    // Setup metadata
    const metadata = {
        fileYear: tp.date.now("YYYY"),
        today: tp.date.now("YYYY-MM-DD"),
        now: tp.date.now("YYYY-MM-DDTHH:mm:ss[Z]")
    };

    // Step 1: Determine destination type
    const noteDest = config.admin 
        ? await tp.system.suggester(
            ["Inbox", "Root", "Current"],
            ["Inbox", "Root", "Current"],
            true,
            "Select Note Destination"
          )
        : "Root";
        
    // Step 2: Get destination notebook (if not Inbox)
    let destinationNoteBook = null;
    if (noteDest === "Current") {
        // Get current context
        const context = await noteFilter.getCurrentNoteContext(tp, dv);
        console.log(context)
        // Create collection from parent note (or current note if no parent)
        const currentCollection = {
            [context.parentNote.noteBook.display]: [noteFilter.createNoteObject(dv, context.parentNote.path)]
        };
        console.log(currentCollection)
        // Use existing destination notebook determination
        destinationNoteBook = await noteFilter.determineDestinationNotebook(tp, dv, currentCollection, config);
    } else if (noteDest !== "Inbox") {
        const { inputSug, inputVal } = noteFilter.getInputSuggestions(dv, noteDest, config);
        const collection = await tp.system.suggester(inputSug, inputVal, true, "Select a Collection");
        destinationNoteBook = await noteFilter.determineDestinationNotebook(tp, dv, collection, config);
    }

    // Step 3: Get template and location information
    const { fileTemplateNote, targetLocation } = await noteFilter.getTemplateAndLocation(
        tp, dv, noteDest, config, destinationNoteBook
    );

    console.log(targetLocation)
    // Step 4: Get filename and build complete path
    const fileName = await tp.system.prompt("Enter Note Name");
    const filePath = await noteFilter.buildCompletePath(
        targetLocation,
        fileName,
        metadata,
        fileTemplateNote
    );

    // Step 5: Create file and apply frontmatter
    const newFile = await noteFilter.createNewFile(tp, fileTemplateNote, filePath);
    await noteFilter.applyFrontmatter(
        newFile,
        destinationNoteBook,
        fileTemplateNote,
        config,
        noteDest,
        metadata.now
    );

    return newFile;
}

module.exports = newPage;