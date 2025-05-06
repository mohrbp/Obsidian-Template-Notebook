class noteFilter {

    // SECTION 1: CONFIGURATION AND INITIALIZATION
    loadConfig(dv) {
        const configNote = dv.page("/00 Home/Notebook Config/Notebook Config");
        return {
            admin: configNote.admin,
            templateFolder: configNote.templateFolder,
            excludePaths: configNote.excludePaths,
            user: configNote.user,
            filePath: configNote.file.path,
            collections: this.loadCollections(dv, configNote.collections)
        };
    }

    loadCollections(dv, collections) {
        return Object.keys(collections).reduce((acc, key) => {
            const collectionPath = collections[key];
            acc[collectionPath.display] = [this.createNoteObject(dv, collectionPath.path)];
            return acc;
        }, {});
    }

    async getCurrentNoteContext(tp, dv) {
        // Get the current file
        const currentFile = tp.file.find_tfile(tp.file.path(true));
        if (!currentFile) {
            throw new Error("No current file found");
        }

        // Get the current note's metadata
        const currentNote = this.createNoteObject(dv, currentFile.path);
        
        // Ensure the current note has required properties
        if (!currentNote.noteBook || !currentNote.noteType) {
            throw new Error("Current note lacks required noteBook or noteType properties");
        }

        // Try to get parent note, fallback to current note if no parent
        try {
            const parentNote = currentNote.parent ? dv.page(currentNote.parent.path) : null;
            if (parentNote) {
                return {
                    currentNote,
                    parentNote
                };
            }
        } catch (error) {
            console.log("No parent note found, using current note as context");
        }

        // Return current note as context if no parent
        return {
            currentNote,
            parentNote: currentNote
        };
    }

    // SECTION 2: TEMPLATE AND LOCATION HANDLING
    async getTemplateAndLocation(tp, dv, noteDest, config, destinationNoteBook = null) {
        if (noteDest === "Inbox") {
            const noteTemplate = dv.page(config.templateFolder[0].path);
            const fileTemplateNote = dv.page(noteTemplate.inboxTemplate.path);
            return {
                fileTemplateNote,
                targetLocation: {
                    basePath: "00 Home/Inbox",
                    type: "inbox"
                }
            };
        }

        // Both "Root" and "Current" cases can use the same template selection logic
        const selectedTemplate = await this.selectTemplate(tp, dv, destinationNoteBook);
        const fileTemplateNote = await dv.page(selectedTemplate.path);

        return {
            fileTemplateNote,
            targetLocation: await this.determineTargetLocation(tp, fileTemplateNote, destinationNoteBook)
        };
    }

    async selectTemplate(tp, dv, destinationNoteBook) {
        const templates = this.getTemplateSuggestions(dv, destinationNoteBook);
        return await tp.system.suggester(
            templates.map(item => item.display),
            templates,
            true,
            "Select Note Template"
        );
    }

    getTemplateSuggestions(dv, destinationNoteBook) {
        const destNoteTypePath = this.accessCollectionAttribute(destinationNoteBook, "noteType")[0].path.toLowerCase();
        const NoteBookPath = this.accessCollectionAttribute(destinationNoteBook, "path")[0];
        let templates = [];

        if (destNoteTypePath.includes("collection")) {
            templates = this.extractTemplates(dv.page(NoteBookPath).rootTemplate);
        } else {
            const noteTypePage = dv.page(destNoteTypePath);
            if (noteTypePage.leafTemplate) {
                templates = templates.concat(this.extractTemplates(noteTypePage.leafTemplate));
            }
            if (noteTypePage.branchTemplate) {
                templates = templates.concat(this.extractTemplates(noteTypePage.branchTemplate));
            }
        }
        return templates;
    }

    // SECTION 3: PATH HANDLING
    async determineTargetLocation(tp, fileTemplateNote, destinationNoteBook) {
        const baseFolder = this.accessCollectionAttribute(destinationNoteBook, "folder")[0];

        // If template has no folder attribute, return standard location
        if (!fileTemplateNote.folder) {
            return {
                basePath: baseFolder,
                type: "standard"
            };
        }

        // Handle folder attribute
        if (Array.isArray(fileTemplateNote.folder)) {
            if (fileTemplateNote.folder.length > 1) {
                // Multiple folder options - let user choose
                const folderOptions = fileTemplateNote.folder.map(path => ({
                    display: this.getLastFolderComponent(path),
                    fullPath: path
                }));

                const selectedFolder = await tp.system.suggester(
                    folderOptions.map(opt => opt.display),
                    folderOptions.map(opt => opt.fullPath),
                    false,
                    "Select Subfolder"
                );

                return {
                    basePath: baseFolder,
                    subPath: selectedFolder,
                    type: "custom"
                };
            } else {
                // Single folder in array
                return {
                    basePath: baseFolder,
                    subPath: fileTemplateNote.folder[0],
                    type: "custom"
                };
            }
        } else {
            // Single folder string
            return {
                basePath: baseFolder,
                subPath: fileTemplateNote.folder,
                type: "custom"
            };
        }
    }

    async buildCompletePath(targetLocation, fileName, metadata, fileTemplateNote) {
        const { basePath, subPath, type } = targetLocation;
        
        // Handle dated files
        const fullName = fileTemplateNote.dated 
            ? `${metadata.today}-${fileName}` 
            : fileName;
        
        // Build base path
        let finalPath;
        if (type === "inbox") {
            finalPath = `${basePath}/${metadata.fileYear}/${fullName}`;
        } else {
            // Handle nested paths
            finalPath = subPath 
                ? `${basePath}/${subPath}/${fullName}`
                : `${basePath}/${fullName}`;
        }

        // Handle folder notes
        return fileTemplateNote.folderNote 
            ? `${finalPath}/${fullName}` 
            : finalPath;
    }

        // SECTION 4: NOTE CREATION AND FRONTMATTER
    async createNewFile(tp, fileTemplateNote, filePath) {
        const templateContent = await tp.file.find_tfile(fileTemplateNote.file.path);
        const strTemplateContent = await app.vault.read(templateContent);
        const abstractFolder = await app.vault.getAbstractFileByPath("/");
        return tp.file.create_new(strTemplateContent, filePath, false, abstractFolder);
    }

    async applyFrontmatter(newTFile, destinationNoteBook, fileTemplateNote, config, noteDest, now) {
        await app.fileManager.processFrontMatter(newTFile, frontmatter => {
            // Remove template frontmatter
            const keysToRemove = ["aliases", "dated", "folderNote", "folder", "modified"];
            keysToRemove.forEach(key => delete frontmatter[key]);

            // Add core frontmatter
            frontmatter["noteType"] = `[[${fileTemplateNote.file.path.split(".md")[0]}|${fileTemplateNote.aliases[0]}]]`;
            frontmatter["created"] = now;
            frontmatter["user"] = `[[${config.filePath.split(".md")[0]}|${config.user}]]`;

            // Add destination-specific frontmatter
            if (noteDest !== "Inbox") {
                frontmatter["parent"] = `[[${this.accessCollectionAttribute(destinationNoteBook, "path")[0].split(".md")[0]}|${this.accessCollectionAttribute(destinationNoteBook, "name")[0]}]]`;
                frontmatter["noteBook"] = `[[${this.accessCollectionAttribute(destinationNoteBook, "noteBook")[0].path.split(".md")[0]}|${this.accessCollectionAttribute(destinationNoteBook, "noteBook")[0].display}]]`;
            }
        });
    }

    // SECTION 5: DESTINATION AND NAVIGATION
    getInputSuggestions(dv, noteDest, config) {
        if (noteDest === "Root") {
            const currentCollections = this.getChildNotes(dv, config.collections, "this", true, false);
            return this.createSuggesterInputs(dv, currentCollections, config.collections, noteDest, config.admin);
        }
        return { inputSug: [], inputVal: [] };
    }

    async determineDestinationNotebook(tp, dv, collection, config) {
        while (true) {
            const root = this.accessCollectionAttribute(collection, "noteType")[0].path.toLowerCase();
            let childNotesList = this.getChildNotes(
                dv, 
                collection, 
                "this", 
                true, 
                root.includes("collection") ? false : null
            );

            if (this.hasChildNotes(childNotesList)) {
                for (let cat in childNotesList) {
                    childNotesList[cat].unshift(collection[cat][0]);
                }

                const { inputSug, inputVal } = this.createSuggesterInputs(
                    dv, 
                    childNotesList, 
                    config.collections, 
                    "Selected", 
                    config.admin
                );
                
                const selectedNotebook = await tp.system.suggester(
                    inputSug, 
                    inputVal, 
                    true, 
                    "Select a Notebook"
                );

                if (this.isSameAsDestination(collection, selectedNotebook)) {
                    return selectedNotebook;
                }
                collection = selectedNotebook;
            } else {
                return collection;
            }
        }
    }

    // SECTION 6: UTILITY FUNCTIONS
    createNoteObject(dv, path) {
        const page = dv.page(path);
        return {
            name: page.file.name,
            path: page.file.path,
            link: page.file.link,
            page: page,
            noteBook: page.noteBook,
            noteType: page.noteType,
            folder: page.file.folder
        };
    }

    accessCollectionAttribute(data, element) {
        return Object.keys(data).reduce((catElements, category) => {
            data[category].forEach(item => {
                catElements.push(item[element]);
            });
            return catElements;
        }, []);
    }

    determineTemplateType(template) {
        if (!template) return "standard";
        if (template.hasOwnProperty("folder") && Array.isArray(template.folder)) {
            return template.folder.length > 1 ? "multi-folder" : "single-folder";
        }
        return "standard";
    }

    extractTemplates(templates) {
        if (!templates) return [];
        return Array.isArray(templates) ? templates : [templates];
    }

    getLastFolderComponent(folderPath) {
    return folderPath.split('/').pop();
    }

    // SECTION 7: HELPER FUNCTIONS FOR COLLECTION HANDLING
    createSuggesterInputs(dv, inputData, config, prefix = null, admin) {
        let inputSug = [], inputVal = [];

        for (let collection in inputData) {
            let inputCollectionName = collection;
            let inputValNote = collection;
            let headerNote = { [collection]: [] };

            if (prefix === "Root") {
                let collectionNote = this.createNoteObject(dv, config[collection][0].link.path);
                headerNote[collection].push(collectionNote);
                inputValNote = headerNote;
            }

            if (inputData[collection].length > 0) {
                let inputNote = inputData[collection][0];
                if (prefix === "Selected") {
                    inputCollectionName = `${prefix} ${collection} ${inputNote.name}`;
                    headerNote[collection].push(inputNote);
                    inputValNote = headerNote;
                    inputData[collection].shift();
                }

                inputData[collection].forEach(note => {
                    inputSug.unshift(note.name);
                    inputVal.unshift({ [collection]: [note] });
                });
            }

            inputSug.unshift(inputCollectionName);
            inputVal.unshift(inputValNote);
        }

        return { inputSug, inputVal };
    }

    getChildNotes(dv, nestedInput, matchParent = "this", matchNoteBook = false, matchNoteType = null) {
        let childNotesList = {};

        Object.keys(nestedInput).forEach(cat => {
            childNotesList[cat] = [];

            nestedInput[cat].forEach(parentCollection => {
                let parentFilter = this.buildParentFilter(
                    dv, 
                    parentCollection, 
                    matchParent, 
                    matchNoteBook, 
                    matchNoteType
                );
                
                let childPages = dv.pages().filter(p => 
                    this.dataFilter([p], parentFilter).length > 0
                );

                childPages.forEach(page => {
                    childNotesList[cat].unshift(
                        this.createNoteObject(dv, page.file.path)
                    );
                });
            });
        });

        return childNotesList;
    }

    hasChildNotes(nestedInput) {
        return Object.keys(nestedInput).some(key => 
            nestedInput[key].some(item => Object.keys(item).length > 0)
        );
    }

    getAllChildNotes(dv, input) {
        let allChildNotes = {};

        for (let cat in input) {
            allChildNotes[cat] = [];
            let queue = input[cat];

            while (queue.length > 0) {
                let currentInput = { [cat]: [queue.shift()] };
                let root = this.accessCollectionAttribute(currentInput, "noteType")[0].path.toLowerCase();
                let childNotesList = root.includes("collection") ?
                    this.getChildNotes(dv, currentInput, "this", true, false, false) :
                    this.getChildNotes(dv, currentInput, "this", true, null, true);

                if (this.hasChildNotes(childNotesList)) {
                    allChildNotes[cat].push(...childNotesList[cat]);
                    queue.push(...childNotesList[cat]);
                }
            }
        }

        return allChildNotes;
    }

    isSameAsDestination(collection, selectedNotebook) {
        for (let key in selectedNotebook) {
            if (selectedNotebook.hasOwnProperty(key)) {
                for (let index in selectedNotebook[key]) {
                    if (selectedNotebook[key][index].path === collection[key][index].path) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    buildParentFilter(dv, parentCollection, matchParent, matchNoteBook, matchNoteType) {
        let parentFilter = {};

        if (matchParent === "this") {
            parentFilter.parent = { includePaths: parentCollection.path };
        } else if (matchParent === "noteBook") {
            parentFilter.parent = { includePaths: parentCollection.noteBook.path };
        }

        if (matchNoteBook) {
            parentFilter.noteBook = { includePaths: parentCollection.noteBook.path };
        }

        if (matchNoteType !== null) {
            parentFilter.noteType = { 
                [matchNoteType ? "includePaths" : "excludePaths"]: parentCollection.noteType.path 
            };
        }

        return parentFilter;
    }

    dataFilter(data, filterCriteria) {
        return data.filter(page => {
            for (let key in filterCriteria) {
                if (filterCriteria.hasOwnProperty(key)) {
                    let criteria = filterCriteria[key];
                    
                    if (criteria.includePaths && criteria.includePaths.length > 0) {
                        if (!page[key]) return false;
                        let paths = Array.isArray(page[key]) 
                            ? page[key].map(p => p.path) 
                            : [page[key].path];
                        if (!paths.some(path => criteria.includePaths.includes(path))) 
                            return false;
                    }

                    if (criteria.excludePaths && criteria.excludePaths.length > 0) {
                        if (!page[key]) return false;
                        let paths = Array.isArray(page[key]) 
                            ? page[key].map(nt => nt.path) 
                            : [page[key].path];
                        if (paths.some(path => criteria.excludePaths.includes(path))) 
                            return false;
                    }

                    if (criteria.required && !page[key]) return false;
                }
            }
            return true;
        });
    }
}