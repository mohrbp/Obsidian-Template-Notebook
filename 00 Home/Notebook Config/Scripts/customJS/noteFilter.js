class noteFilter {

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


    loadTasks(dv, target) {
        let targetNote = this.createNoteObject(dv, target.path);
        let nestedInput = {
            parent: [targetNote]
        };

        let allChildNotes = this.getAllChildNotes(dv, nestedInput);
        let taskFilter = this.createTaskFilter(targetNote, allChildNotes);

        return dv.pages()
            .filter(p => this.dataFilter([p], taskFilter).length > 0)
            .file
            .tasks
            .where(t => t.link.subpath == "Tasks")
            .where(t => !t.hasOwnProperty("parent"));
    }

    createTaskFilter(targetNote, allChildNotes) {
        let taskFilter = { noteType: { excludePaths: targetNote.noteType.path }};
        
        for (let cat in allChildNotes) {
            taskFilter[cat] = {
                includePaths: [targetNote.path],
                excludePaths: []
            };
            for (let index in allChildNotes[cat]) {
                taskFilter[cat].includePaths.push(String(allChildNotes[cat][index].path));
            }
        }
        
        return taskFilter;
    }

    convertLinksToCommaSeparatedList(text) {
        // Function to Format Links for Tasks Table
        // Regular expression to match Markdown links
        const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

        // Regular expression to match Wiki links
        const wikiRegex = /\[\[([^\]]+)\]\]/g;

        // Array to store all links
        const linksArray = [];

        // Find Markdown links and add to the array
        let markdownMatch;
        while ((markdownMatch = markdownRegex.exec(text)) !== null) {
        const linkText = markdownMatch[1];
        const linkUrl = markdownMatch[2];
        linksArray.push(`[${linkText}](${linkUrl})`);
        }

        // Find Wiki links and add to the array
        let wikiMatch;
        while ((wikiMatch = wikiRegex.exec(text)) !== null) {
        const wikiLink = wikiMatch[1];
        linksArray.push(`[[${wikiLink}]]`);
        }
        // Join the links with commas and return the result
        return linksArray.join(', ');
    }


    loadConfig(dv) {
        const configNote = dv.page("/00 Home/Notebook Config/Notebook Config");

        let config = {
            admin: configNote.admin,
            templateFolder: configNote.templateFolder,
            excludePaths: configNote.excludePaths,
            user: configNote.user,
            filePath: configNote.file.path,
            collections: this.loadCollections(dv, configNote.collections)
        };

        return config;
    }

    loadCollections(dv, collections) {
        return Object.keys(collections).reduce((acc, key) => {
            const collectionPath = collections[key];
            acc[collectionPath.display] = [ this.createNoteObject(dv, collectionPath.path) ];
            return acc;
        }, {});
    }

    accessCollectionAttribute(data, element) {
        return Object.keys(data).reduce((catElements, category) => {
            data[category].forEach(item => {
                catElements.push(item[element]);
            });
            return catElements;
        }, []);
    }

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

    dataFilter(data, filterCriteria) {
        return data.filter(page => {
            for (let key in filterCriteria) {
                if (filterCriteria.hasOwnProperty(key)) {
                    let criteria = filterCriteria[key];
                    
                    if (criteria.includePaths && criteria.includePaths.length > 0) {
                        if (!page[key]) return false;
                        let paths = Array.isArray(page[key]) ? page[key].map(p => p.path) : [page[key].path];
                        if (!paths.some(path => criteria.includePaths.includes(path))) return false;
                    }

                    if (criteria.excludePaths && criteria.excludePaths.length > 0) {
                        if (!page[key]) return false;
                        let paths = Array.isArray(page[key]) ? page[key].map(nt => nt.path) : [page[key].path];
                        if (paths.some(path => criteria.excludePaths.includes(path))) return false;
                    }

                    if (criteria.required && !page[key]) return false;
                }
            }
            return true;
        });
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
                    this.getChildNotes(dv, currentInput, "this", true, false) :
                    this.getChildNotes(dv, currentInput, "this", true, null, true);

                if (this.hasChildNotes(childNotesList)) {
                    allChildNotes[cat].push(...childNotesList[cat]);
                    queue.push(...childNotesList[cat]);
                }
            }
        }

        return allChildNotes;
    }

    getChildNotes(dv, nestedInput, matchParent = "this", matchNoteBook = false, matchNoteType = null, allTemplates = false) {
        let childNotesList = {};

        Object.keys(nestedInput).forEach(cat => {
            childNotesList[cat] = [];

            nestedInput[cat].forEach(parentCollection => {
                let parentFilter = this.buildParentFilter(dv, parentCollection, matchParent, matchNoteBook, matchNoteType, allTemplates);
                let childPages = dv.pages().filter(p => this.dataFilter([p], parentFilter).length > 0);

                childPages.forEach(page => {
                    childNotesList[cat].unshift(this.createNoteObject(dv, page.file.path));
                });
            });
        });

        return childNotesList;
    }

    buildParentFilter(dv, parentCollection, matchParent, matchNoteBook, matchNoteType, allTemplates) {
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
            parentFilter.noteType = { [matchNoteType ? "includePaths" : "excludePaths"]: parentCollection.noteType.path };
        } else {
            let noteTypePaths = [];
            let noteTypeFile = dv.page(parentCollection.noteType.path);

            if (noteTypeFile.adminTemplate) {
                noteTypeFile.adminTemplate.forEach(template => noteTypePaths.push(template.path));
            }

            if (allTemplates && noteTypeFile.allTemplate) {
                noteTypeFile.allTemplate.forEach(template => noteTypePaths.push(template.path));
            }

            parentFilter.noteType = { includePaths: noteTypePaths };
        }
        return parentFilter;
    }

    hasChildNotes(nestedInput) {
        return Object.keys(nestedInput).some(key => 
            nestedInput[key].some(item => Object.keys(item).length > 0)
        );
    }

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
            let childNotesList = this.getChildNotes(dv, collection, "this", true, root.includes("collection") ? false : null);

            if (this.hasChildNotes(childNotesList)) {
                for (let cat in childNotesList) {
                    childNotesList[cat].unshift(collection[cat][0]);
                }

                const { inputSug, inputVal } = this.createSuggesterInputs(dv, childNotesList, config.collections, "Selected", config.admin);
                const selectedNotebook = await tp.system.suggester(inputSug, inputVal, true, "Select a Notebook");

                if (this.isSameAsDestination(collection, selectedNotebook)) {
                    return selectedNotebook;
                }
                collection = selectedNotebook;
            } else {
                return collection;
            }
        };
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

    getTemplateSuggestions(dv, destinationNoteBook) {
        const destNoteTypePath = this.accessCollectionAttribute(destinationNoteBook, "noteType")[0].path.toLowerCase();
        const NoteBookPath = this.accessCollectionAttribute(destinationNoteBook, "path")[0];
        let templates = [];

        if (destNoteTypePath.includes("collection")) {
            templates = this.extractTemplates(dv.page(NoteBookPath).rootTemplate);
        } else {
            const noteTypePage = dv.page(destNoteTypePath);
            if (noteTypePage.allTemplate) {
                templates = templates.concat(this.extractTemplates(noteTypePage.allTemplate));
            }
            if (noteTypePage.adminTemplate) {
                templates = templates.concat(this.extractTemplates(noteTypePage.adminTemplate));
            }
        }
        return templates;
    }

    extractTemplates(templates) {
        if (!templates) return [];
        return Array.isArray(templates) ? templates : [templates];
    }

    async getTargetFolderAndTemplate(tp, dv, noteDest, fileYear, fileTemplate, config, destinationNoteBook) {
        console.log(noteDest)
        if (noteDest === "Inbox") {
            const noteTemplate = dv.page(config.templateFolder[0].path);
            const fileTemplateNote = dv.page(noteTemplate.inboxTemplate.path);
            console.log(fileTemplateNote)
            return {
                targetFolder: `00 Home/Inbox/${fileYear}`,
                fileTemplateNote: fileTemplateNote
            };
        }

        const fileTemplateNote = await dv.page(fileTemplate.path);
        let targetFolder;

        if (fileTemplateNote.hasOwnProperty("folder") && Array.isArray(fileTemplateNote.folder)) {
            const appendPath = fileTemplateNote.folder.length > 1
                ? await tp.system.suggester(fileTemplateNote.folder.map(this.getLastFolderComponent), fileTemplateNote.folder)
                : fileTemplateNote.folder[0];
            targetFolder = `${this.accessCollectionAttribute(destinationNoteBook, "folder")}/${appendPath}`;
        } else {
            targetFolder = this.accessCollectionAttribute(destinationNoteBook, "folder");
        }

        return { targetFolder, fileTemplateNote };
    }

    getLastFolderComponent(path) {
        const pathComponents = path.split('/');
        return pathComponents[pathComponents.length - 1];
    }

    buildFilePath(tp, fileTemplateNote, targetFolder, fileName, today) {
        const fullName = fileTemplateNote.dated ? `${today}-${fileName}` : fileName;
        return fileTemplateNote.folderNote ? `${targetFolder}/${fullName}/${fullName}` : `${targetFolder}/${fullName}`;
    }

    async createNewFile(tp, fileTemplateNote, filePath) {
        const templateContent = await tp.file.find_tfile(fileTemplateNote.file.path);
        const strTemplateContent = await app.vault.read(templateContent);
        const abstractFolder = await app.vault.getAbstractFileByPath("/");
        return tp.file.create_new(strTemplateContent, filePath, false, abstractFolder);
    }

    async applyFrontmatter(newTFile, destinationNoteBook, fileTemplateNote, config, noteDest, now) {
        await app.fileManager.processFrontMatter(newTFile, frontmatter => {
            // Removing template frontmatter
            const keysToRemove = ["aliases", "dated", "folderNote", "folder", "modified"];
            keysToRemove.forEach(key => delete frontmatter[key]);

            // Adding new frontmatter based on creation
            frontmatter["noteType"] = `[[${fileTemplateNote.file.path.split(".md")[0]}|${fileTemplateNote.aliases[0]}]]`;
            frontmatter["created"] = now;
            frontmatter["user"] = `[[${config.filePath.split(".md")[0]}|${config.user}]]`;

            // Adding Category Specific frontmatter
            if (noteDest !== "Inbox") {
                frontmatter["parent"] = `[[${this.accessCollectionAttribute(destinationNoteBook, "path")[0].split(".md")[0]}|${this.accessCollectionAttribute(destinationNoteBook, "name")[0]}]]`;
                frontmatter["noteBook"] = `[[${this.accessCollectionAttribute(destinationNoteBook, "noteBook")[0].path.split(".md")[0]}|${this.accessCollectionAttribute(destinationNoteBook, "noteBook")[0].display}]]`;
            }
        });
    }
}

