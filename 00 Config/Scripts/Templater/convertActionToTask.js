// ============================================================================
// convertActionToTask.js
// Templater script to convert an Action (checkbox) into a Task note
// Usage: Called via Advanced URI with parameters
// ============================================================================

async function convertActionToTask(tp, dv, actionText, actionPath, scheduledDate = "") {
    
    // Initialize NotebookManager and load configuration
    const { notebookManager } = await cJS();
    const config = notebookManager.loadConfig(dv);
    
    // Setup metadata
    const metadata = {
        fileYear: tp.date.now("YYYY"),
        today: tp.date.now("YYYY-MM-DD"),
        now: tp.date.now("YYYY-MM-DDTHH:mm:ss[Z]")
    };

    // Clean the action text
    let cleanText = actionText
        .replace(/([⌛⏳✅]) ?(\d{4}-\d{2}-\d{2})\s*/g, '')
        .trim();

    // Get the parent note (the note containing the action)
    const parentNote = notebookManager.createNoteObject(dv, actionPath);
    
    // Create destination notebook collection
    const destinationNotebook = {
        [parentNote.noteBook.display]: [parentNote]
    };

    // Get parent noteType to find Task template
    const parentNoteType = dv.page(parentNote.noteType.path);
    
    // Find Task template in leaf or branch templates
    let taskTemplateInfo = null;
    let index = 1;
    
    // Check leaf templates
    while (parentNoteType[`leafTemplate${index}`]) {
        const template = parentNoteType[`leafTemplate${index}`];
        if (template && template.path && template.path.toLowerCase().includes('task')) {
            taskTemplateInfo = {
                templatePath: template.path,
                fieldName: 'leafTemplate',
                index: index
            };
            break;
        }
        index++;
    }
    
    // If not found in leaf, check branch templates
    if (!taskTemplateInfo) {
        index = 1;
        while (parentNoteType[`branchTemplate${index}`]) {
            const template = parentNoteType[`branchTemplate${index}`];
            if (template && template.path && template.path.toLowerCase().includes('task')) {
                taskTemplateInfo = {
                    templatePath: template.path,
                    fieldName: 'branchTemplate',
                    index: index
                };
                break;
            }
            index++;
        }
    }
    
    if (!taskTemplateInfo) {
        throw new Error("No Task template found in parent noteType");
    }

    // Get the template note
    const fileTemplateNote = dv.page(taskTemplateInfo.templatePath);
    
    // Create templateInfo object (mimicking getTemplateAndLocation output)
    const templateInfo = {
        templateNote: fileTemplateNote,
        fieldName: taskTemplateInfo.fieldName,
        index: taskTemplateInfo.index
    };

    // Get target location using notebookManager's getLocationConfig
    const targetLocation = await notebookManager.getLocationConfig(
        tp, 
        dv, 
        templateInfo, 
        destinationNotebook
    );

    // Create the task note
    const newFile = await notebookManager.createNote(
        tp,
        targetLocation,
        cleanText,
        metadata,
        fileTemplateNote
    );

    // Apply frontmatter
    await notebookManager.applyFrontmatter(
        newFile,
        destinationNotebook,
        fileTemplateNote,
        config,
        "Current", // Using "Current" as destination type since we know the parent
        metadata.now
    );

    // If scheduled date was provided, update it
    if (scheduledDate) {
        await app.fileManager.processFrontMatter(newFile, frontmatter => {
            frontmatter.scheduled = scheduledDate;
        });
    }

    // Handle embedding
    await notebookManager.handleNoteEmbed(
        tp,
        dv,
        newFile,
        destinationNotebook,
        fileTemplateNote,
        templateInfo
    );

    // Optional: Remove the original checkbox
    // This would require finding and removing the checkbox line from actionPath
    // For now, we'll leave it as manual cleanup

    return newFile;
}

module.exports = convertActionToTask;