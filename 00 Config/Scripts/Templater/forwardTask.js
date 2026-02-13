// ============================================================================
// forwardTask.js
// Templater script to forward a Task to a new parent and move file if needed
// Usage: Called via Advanced URI with parameters
// ============================================================================

async function forwardTask(tp, dv, taskPath, newParentPath) {
    
    // Initialize NotebookManager
    const { notebookManager } = await cJS();
    
    // Get the task file and new parent
    const taskFile = tp.file.find_tfile(taskPath);
    if (!taskFile) {
        throw new Error(`Task file not found: ${taskPath}`);
    }
    
    const taskPage = dv.page(taskPath);
    const newParentNote = notebookManager.createNoteObject(dv, newParentPath);
    const newParentPage = dv.page(newParentPath);
    
    // Get new parent's noteType
    if (!newParentPage.noteType || !newParentPage.noteType.path) {
        throw new Error("New parent has no noteType");
    }
    
    const newParentNoteType = dv.page(newParentPage.noteType.path);
    
    // Find Task template in new parent's noteType
    let taskTemplateInfo = null;
    let index = 1;
    
    // Check leaf templates
    while (newParentNoteType[`leafTemplate${index}`]) {
        const template = newParentNoteType[`leafTemplate${index}`];
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
        while (newParentNoteType[`branchTemplate${index}`]) {
            const template = newParentNoteType[`branchTemplate${index}`];
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
        throw new Error("New parent cannot accept Task notes (no Task template found)");
    }

    // Get folder configuration from new parent's noteType
    const folderFieldName = `${taskTemplateInfo.fieldName.replace('Template', 'Folder')}${taskTemplateInfo.index}`;
    const subPath = newParentNoteType[folderFieldName] || null;
    
    // Build target folder path
    let targetFolder;
    if (subPath) {
        targetFolder = `${newParentPage.file.folder}/${subPath}`;
    } else {
        targetFolder = newParentPage.file.folder;
    }
    
    // Get current task location
    const currentFolder = taskFile.parent.path;
    const shouldMove = currentFolder !== targetFolder;
    
    // Step 1: Update frontmatter to add new parent
    await app.fileManager.processFrontMatter(taskFile, frontmatter => {
        // Get current parents
        let currentParents = [];
        if (frontmatter.parent) {
            currentParents = Array.isArray(frontmatter.parent) 
                ? frontmatter.parent 
                : [frontmatter.parent];
        }
        
        // Create new parent link
        const newParentLink = `[[${newParentPath}|${newParentPage.file.name}]]`;
        
        // Check if already exists
        const alreadyExists = currentParents.some(p => {
            const path = typeof p === 'string' 
                ? p.match(/\[\[([^\]|]+)/)?.[1] 
                : p.path;
            return path === newParentPath;
        });
        
        if (!alreadyExists) {
            frontmatter.parent = [...currentParents, newParentLink];
        }
    });
    
    // Step 2: Move file if needed
    if (shouldMove) {
        // Ensure target folder exists
        const targetFolderPath = targetFolder;
        const folderExists = await app.vault.adapter.exists(targetFolderPath);
        
        if (!folderExists) {
            await app.vault.createFolder(targetFolderPath);
        }
        
        // Build new file path
        const newFilePath = `${targetFolder}/${taskFile.name}`;
        
        // Move the file
        await app.fileManager.renameFile(taskFile, newFilePath);
        
        console.log(`Task moved from ${taskPath} to ${newFilePath}`);
        
        // Get the moved file for embedding
        const movedFile = tp.file.find_tfile(newFilePath);
        
        // Step 3: Handle embedding in new parent
        const templateInfo = {
            templateNote: dv.page(taskTemplateInfo.templatePath),
            fieldName: taskTemplateInfo.fieldName,
            index: taskTemplateInfo.index
        };
        
        const destinationNotebook = {
            [newParentNote.noteBook.display]: [newParentNote]
        };
        
        await notebookManager.handleNoteEmbed(
            tp,
            dv,
            movedFile,
            destinationNotebook,
            templateInfo.templateNote,
            templateInfo
        );
        
        return { moved: true, newPath: newFilePath };
    } else {
        // File doesn't need to move, just handle embedding
        const templateInfo = {
            templateNote: dv.page(taskTemplateInfo.templatePath),
            fieldName: taskTemplateInfo.fieldName,
            index: taskTemplateInfo.index
        };
        
        const destinationNotebook = {
            [newParentNote.noteBook.display]: [newParentNote]
        };
        
        await notebookManager.handleNoteEmbed(
            tp,
            dv,
            taskFile,
            destinationNotebook,
            templateInfo.templateNote,
            templateInfo
        );
        
        return { moved: false, newPath: taskPath };
    }
}

module.exports = forwardTask;