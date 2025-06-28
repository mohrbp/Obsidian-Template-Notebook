async function newNote(tp, dv) {

        // Initialize NotebookManager and load configuration
        const { notebookManager } = await cJS();
        const config = notebookManager.loadConfig(dv);
        // Setup metadata
        const metadata = {
            fileYear: tp.date.now("YYYY"),
            today: tp.date.now("YYYY-MM-DD"),
            now: tp.date.now("YYYY-MM-DDTHH:mm:ss[Z]")
        };

        // Step 1: Determine destination type based on user permissions
        const destinationType = config.admin 
            ? await tp.system.suggester(
                ["Inbox", "Root", "Current"],
                ["Inbox", "Root", "Current"],
                true,
                "Select Note Destination"
              )
            : "Root";
            
        // Step 2: Get destination notebook (if not Inbox)
        const destinationNotebook = await notebookManager.getDestinationNotebook(
            tp, 
            dv, 
            destinationType, 
            config
        );
        console.log("destinationNotebook", destinationNotebook)
        // Step 3: Get template and location information
        const { fileTemplateNote, targetLocation } = await notebookManager.getTemplateAndLocation(
            tp, 
            dv, 
            destinationType, 
            config, 
            destinationNotebook
        );

        // Step 4: Get filename and Create file and apply frontmatter
        const fileName = await tp.system.prompt("Enter Note Name");
        const newFile = await notebookManager.createNote(
            tp,
            targetLocation,
            fileName,
            metadata,
            fileTemplateNote
        );
        await notebookManager.applyFrontmatter(
            newFile,
            destinationNotebook,
            fileTemplateNote,
            config,
            destinationType,
            metadata.now
        );

        return newFile;
}

module.exports = newNote;