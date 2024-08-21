async function nuPage(tp, dv) {
    const { noteFilter } = await cJS();
    const config = await initializeConfig(dv, noteFilter);
    const noteDest = await determineNoteDestination(tp, config.admin);
    
    if (noteDest === "Inbox") {
        await createInboxNote(tp, dv, config, noteFilter);
    } else {
        const destinationNoteBook = await selectDestinationNotebook(tp, dv, noteFilter, noteDest, config);
        const targetFolder = await determineTargetFolder(destinationNoteBook, noteFilter, config);
        await createNoteFromTemplate(tp, dv, config, targetFolder, noteFilter);
    }
}

async function initializeConfig(dv, noteFilter) {
    const config = noteFilter.loadConfig(dv);
    config.fileYear = tp.date.now("YYYY");
    return config;
}

async function determineNoteDestination(tp, isAdmin) {
    return isAdmin 
        ? await tp.system.suggester(["Inbox", "Root"], ["Inbox", "Root"], true, "Select Note Destination")
        : "Root";
}

async function selectDestinationNotebook(tp, dv, noteFilter, noteDest, config) {
    let currentCollections = {};
    if (noteDest === "Root") {
        currentCollections = noteFilter.getChildNotes(dv, config.collections, "this", true, false);
    }

    const { inputSug, inputVal } = noteFilter.createSuggesterInputs(dv, currentCollections, config.collections, noteDest, config.admin);
    let collection = await tp.system.suggester(inputSug, inputVal, true, "Select a Collection");

    let level = 0;
    while (true) {
        const childNotesList = noteFilter.getChildNotes(dv, collection, "this", true, false);
        if (noteFilter.hasChildNotes(childNotesList)) {
            ({ inputSug, inputVal } = noteFilter.createSuggesterInputs(dv, childNotesList, config.collections, "Selected", config.admin));
            collection = await tp.system.suggester(inputSug, inputVal, true, "Select a Notebook");
            level++;
        } else {
            return collection;
        }
    }
}

async function determineTargetFolder(destinationNoteBook, noteFilter, config) {
    const fileTemplateNote = dv.page(destinationNoteBook.path);
    const folderPaths = fileTemplateNote.folder || [];
    return folderPaths.length > 1
        ? await tp.system.suggester(folderPaths.map(getFolderName), folderPaths)
        : `${noteFilter.accessCatObject(destinationNoteBook, "Folder")}/${folderPaths[0]}`;
}

function getFolderName(path) {
    return path.split('/').pop();
}

async function createNoteFromTemplate(tp, dv, config, targetFolder, noteFilter) {
    const fileName = await tp.system.prompt("Enter Note Name");
    const fileTemplateNote = dv.page(config.template.path);
    const fullName = fileTemplateNote.dated ? `${tp.date.now("YYYY-MM-DD")}-${fileName}` : fileName;
    const filePath = fileTemplateNote.folderNote
        ? `${targetFolder}/${fullName}/${fullName}`
        : `${targetFolder}/${fullName}`;

    const templateContent = await tp.file.find_tfile(fileTemplateNote.path);
    const strTemplateContent = await app.vault.read(templateContent);
    const newTFile = await tp.file.create_new(strTemplateContent, filePath, false, "/");

    await applyFrontmatter(newTFile, config, noteFilter);
    return newTFile;
}

async function applyFrontmatter(newTFile, config, noteFilter) {
    await app.fileManager.processFrontMatter(newTFile, frontmatter => {
        delete frontmatter.aliases;
        delete frontmatter.dated;
        delete frontmatter.folderNote;
        delete frontmatter.folder;
        delete frontmatter.modified;

        frontmatter.noteType = `[[${fileTemplate.path.split(".md")[0]}|${fileTemplate.display}]]`;
        frontmatter.created = tp.date.now("YYYY-MM-DDTHH:mm:ss[Z]");
        frontmatter.user = `[[${config.filePath.split(".md")[0]}|${config.user}]]`;

        if (noteDest !== "Inbox") {
            frontmatter.parent = `[[${noteFilter.accessCatObject(destinationNoteBook, "Path").split(".md")[0]}|${noteFilter.accessCatObject(destinationNoteBook, "Name")}]]`;
            frontmatter.noteBook = `[[${noteFilter.accessCatObject(destinationNoteBook, "noteBook")[0].path.split(".md")[0]}|${noteFilter.accessCatObject(destinationNoteBook, "noteBook")[0].display}]]`;
        }
    });
}
