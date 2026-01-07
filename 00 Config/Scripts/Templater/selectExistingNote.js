async function selectExistingNote(tp, dv) {
    try {
        // Initialize NotebookManager and load configuration
        const { notebookManager } = await cJS();
        const config = notebookManager.loadConfig(dv);
        
        // Step 1: Determine destination type based on user permissions
        const destinationType = config.admin 
            ? await tp.system.suggester(
                ["Inbox", "Root", "Current"],
                ["Inbox", "Root", "Current"],
                true,
                "Select Note Location"
              )
            : "Root";
        
        // Step 2: Handle Inbox selection
        if (destinationType === "Inbox") {
            const currentYear = tp.date.now("YYYY");
            const inboxPath = `01 Home/!Inbox/${currentYear}`;
            
            // Get all notes in the inbox folder
            const inboxNotes = dv.pages(`"${inboxPath}"`)
                .sort(page => page.file.ctime, 'desc')
                .map(page => notebookManager.createNoteObject(dv, page.file.path));
            
            if (inboxNotes.length === 0) {
                new Notice("No notes found in Inbox");
                return null;
            }
            
            // Format for suggester
            const displays = inboxNotes.map(note => note.name);
            const values = inboxNotes.map(note => note.path);
            
            const selectedPath = await tp.system.suggester(
                displays,
                values,
                true,
                "Select Note from Inbox"
            );
            
            if (!selectedPath) return null;
            
            return tp.file.find_tfile(selectedPath);
        }
        
        // Step 3: Get destination notebook (for Root or Current)
        const destinationNotebook = await notebookManager.getDestinationNotebook(
            tp, 
            dv, 
            destinationType, 
            config
        );
        
        if (!destinationNotebook) {
            new Notice("No destination selected");
            return null;
        }
        
        console.log("destinationNotebook", destinationNotebook);
        
        // Step 4: Get all child notes from the destination
        const allChildNotes = await notebookManager.getAllChildNotes(
            dv, 
            destinationNotebook
        );
        
        console.log("allChildNotes", allChildNotes);
        
        // Check if there are any notes
        if (!allChildNotes || Object.keys(allChildNotes).length === 0) {
            new Notice("No notes found in selected location");
            return null;
        }
        
        // Step 5: Format notes for selection
        const formattedNotes = notebookManager.formatNotesCollection(
            allChildNotes,
            { formatter: 'categorized', showCategory: true }
        );
        
        console.log("formattedNotes", formattedNotes);
        
        if (formattedNotes.displays.length === 0) {
            new Notice("No notes available to select");
            return null;
        }
        
        // Step 6: Let user select a note
        const selectedNote = await tp.system.suggester(
            formattedNotes.displays,
            formattedNotes.values,
            true,
            "Select Existing Note"
        );
        
        if (!selectedNote) return null;
        
        // Extract the note object from the collection format
        const noteObject = Object.values(selectedNote)[0][0];
        console.log("selectedNote", noteObject);
        
        // Return the TFile object
        return tp.file.find_tfile(noteObject.path);
        
    } catch (error) {
        new Notice(`Error selecting note: ${error.message}`);
        console.error("selectExistingNote error:", error);
        return null;
    }
}

module.exports = selectExistingNote;