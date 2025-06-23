class notebookManager {
    // 1. CORE INITIALIZATION & CONFIGURATION
    loadConfig(dv) {
        const configNote = dv.page("/00 Home/Notebook Config/Notebook Config");
        if (!configNote) {
            throw new Error("Configuration note not found");
        }

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
        return Object.keys(collections).reduce((processedCollections, key) => {
            const collectionPath = collections[key];
            processedCollections[collectionPath.display] = [
                this.createNoteObject(dv, collectionPath.path)
            ];
            return processedCollections;
        }, {});
    }

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

    // 2. CONTEXT & NAVIGATION FLOW

   // Main navigation handler that manages all destination types
    async getDestinationNotebook(tp, dv, destinationType, config) {
        // Handle inbox case
        if (destinationType === "Inbox") {
            return null; // Inbox doesn't need a destination notebook
        }

        // Get initial collection based on destination type - Current or Root
        const initialCollection = await this.getInitialCollection(tp, dv, destinationType, config);

        // Navigate to final destination
        return await this.navigateToDestination(tp, dv, initialCollection);
     }   

    // Helper to get the starting point for navigation
    async getInitialCollection(tp, dv, destinationType, config) {
        switch (destinationType) {
            case "Current":
                // Get context from current note
                return await this.getCurrentNoteContext(tp, dv);
                
            case "Root":
                // Get root level collections and let user select
                console.log("config.collections", config.collections)
                const rootCollections = this.traverseNotebook(dv, config.collections, {
                    formatOutput: true,
                    includeSource: true,
                    traversalType: 'children'       
                });

                return await tp.system.suggester(
                        rootCollections.displays,
                        rootCollections.values,
                        true,
                        "Select Collection"
                    );
                
            default:
                throw new Error(`Unsupported destination type: ${destinationType}`);
        }
    }

    // Gets the context for the current note, either from itself or its parent
    async getCurrentNoteContext(tp, dv) {
        const currentFile = tp.file.find_tfile(tp.file.path(true));
        if (!currentFile) {
            throw new Error("No current file found");
        }

        // Create note object and validate properties
        const currentNote = this.createNoteObject(dv, currentFile.path);
        if (!currentNote.noteBook || !currentNote.noteType) {
            throw new Error("Current note lacks required properties");
        }

        // Use parent note if exists, otherwise use current note
        const contextNote = currentNote.parent 
            ? this.createNoteObject(dv, currentNote.parent.path)
            : currentNote;
        
        // Return in collection format
        return {
            [contextNote.noteBook.display]: [contextNote]
        };
   }


     // Main navigation function that handles traversing the note hierarchy
    async navigateToDestination(tp, dv, initialCollection) {
        let currentCollection = initialCollection;
        
        // Helper function to check if two locations are the same
        const isSameLocation = (collection1, collection2) => {
            return Object.keys(collection1).some(key => 
                collection1[key].some(note1 => 
                    collection2[key]?.some(note2 => note2.path === note1.path)
                )
            );
        }

        while (true) {
            // Get and format navigation options
            const options = await this.traverseNotebook(dv, initialCollection, {
                includeSource: true,
                formatOutput: true,
                traversalType: 'children'
            });

            // If no options available or no child notes, we've reached a destination
            if (!options || !this.hasChildNotes(options)) {
                return currentCollection;
            }

            // Let user select next destination
            const nextCollection = await tp.system.suggester(
                options.displays,
                options.values,
                true,
                "Select Destination"
            );
            
            // If same location selected or no selection made, we've reached our destination
            if (!nextCollection || isSameLocation(currentCollection, nextCollection)) {
                return nextCollection || currentCollection;
            }

            currentCollection = nextCollection;
        }
    }

    findNotesWithCriteria (dv, collection, criteria) {

            const normalizePaths = (property) => {
                if (!property) return [];
                
                // Handle array of links
                if (Array.isArray(property)) {
                    return property.map(p => p?.path || p).filter(p => p);
                }
                
                // Handle single link
                if (property.path) {
                    return [property.path];
                }
                
                // Handle string path
                if (typeof property === 'string') {
                    return [property];
                }
                
                return [];
            };

            return Object.entries(collection).reduce((results, [category, referenceNotes]) => {
                console.log(`Processing category: ${category} with ${referenceNotes.length} reference notes`);

                const foundNotes = referenceNotes.reduce((acc, referenceNote) => {     
                    console.log(`Processing reference note: ${referenceNote.name}`);
                    console.log("referenceNote", referenceNote)

                    const referenceNoteTypePath = referenceNote.noteType.path
                    const referenceNoteTypePage = dv.page(referenceNoteTypePath)

                    // if the referenceNote is a collection, then we will reference the root templates for that specific note
                    // otherwise we will use the branch templates as is defined in the Template defined by the noteType of the Reference Note

                    const branchTemplatePaths = this.isCollection(referenceNoteTypePath)
                        ? normalizePaths(referenceNote.page.rootTemplate)
                        : normalizePaths(referenceNoteTypePage.branchTemplate);
                        
                    const leafTemplatePaths = normalizePaths(referenceNoteTypePage?.leafTemplate);

                    const inlinks = referenceNote.page.file.inlinks || [];
                    const referenceParentPaths = normalizePaths(referenceNote.parent);


                    const matches = dv.pages()
                        .filter(page => {

                            const pageParentPaths = normalizePaths(page.parent);

                            const criteriaResults = {};

                            if (criteria.matchNoteBook) {
                                criteriaResults.matchNoteBook = 
                                    page.noteBook?.path === referenceNote.noteBook.path;
                            }

                            if (criteria.excludeNoteType) {
                                criteriaResults.excludeNoteType = 
                                    !(page.noteType?.path === referenceNote.noteType.path);
                            }

                            if (criteria.isParent) {
                                criteriaResults.isParent = 
                                    pageParentPaths.includes(referenceNote.path);
                            }

                            if (criteria.isSibling) {
                                criteriaResults.isSibling = 
                                    pageParentPaths.some(path => referenceParentPaths.includes(path));
                            }

                            if (criteria.isBranch) {
                                criteriaResults.isBranch = 
                                    page.noteType && branchTemplatePaths.includes(page.noteType.path);
                            }

                            if (criteria.isLeaf) {
                                criteriaResults.isLeaf = 
                                    page.noteType && leafTemplatePaths.includes(page.noteType.path);
                            }

                            if (criteria.isLinked) {
                                criteriaResults.isLinked = 
                                    inlinks.some(link => link.path === page.file.path);
                            }

                            // Check if all requested criteria pass
                            const matchesAll = Object.values(criteriaResults)
                                .every(result => result === true);

                            if (matchesAll) {
                                console.log(`Found matching note: ${page.file.name}`, {
                                    appliedCriteria: criteriaResults,  // Shows criteria that were checked
                                    parent: page.parent,
                                    noteType: page.noteType?.path,
                                    noteBook: page.noteBook?.path
                                });
                            }

                            return matchesAll;
                        })
                        .map(page => this.createNoteObject(dv, page.file.path));
                    
                    return [...acc, ...matches];
                }, []);
                
                return foundNotes.length > 0 
                    ? { ...results, [category]: foundNotes }
                    : results;
            }, {});
    };

    async traverseNotebook(dv, sourceCollection, options = {}) {
        const {
            recursive = false,
            includeSource = false,
            formatOutput = false,
            traversalType = 'children' 
        } = options;

        // Define different traversal strategies
        const traversalStrategies = {
            children: {
                criteria: {
                    matchNoteBook: true,
                    isParent: true,
                    isBranch: true
                }
            },
            siblings: {
                criteria: {
                    matchNoteBook: true,
                    isSibling: true
                }
            },
            template: {
                criteria: {
                    matchNoteBook: true,
                    isBranch: true,
                    isLeaf: true
                }
            }
        };

        const getNotesForStrategy = collection => {
            const strategy = traversalStrategies[traversalType];
            return this.findNotesWithCriteria(dv, collection, strategy.criteria);
        };


        // Utility function for function composition
        const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

        // Pure function for recursive processing using immutable patterns
        const processRecursively = collection => {
            const processCategory = ([category, notes]) => {

                const processNote = (accumulator, note) => {
                    const childNotes = getNotesForStrategy({ [category]: [note] });
                    const categoryChildren = childNotes[category] || [];
                    
                    return {
                        processed: [...accumulator.processed, ...categoryChildren],
                        toProcess: [...accumulator.toProcess, ...categoryChildren]
                    };
                };

                const processAllNotes = (notesToProcess, accumulated = []) => {
                    if (notesToProcess.length === 0) return accumulated;
                    
                    const [currentNote, ...remainingNotes] = notesToProcess;
                    const result = processNote(
                        { processed: accumulated, toProcess: [] }, 
                        currentNote
                    );
                    
                    return processAllNotes(
                        [...remainingNotes, ...result.toProcess],
                        result.processed
                    );
                };

                return [category, processAllNotes(notes)];
            };

            return Object.fromEntries(
                Object.entries(collection).map(processCategory)
            );
        };
        // Pure function to combine source and child notes
        const combineSourceAndChildren = (sourceCollection, childNotes) => 
            Object.entries(sourceCollection).reduce((acc, [category, notes]) => ({
                ...acc,
                [category]: [...notes, ...(childNotes[category] || [])]
            }), {});

        // Main processing pipeline
        const process = pipe(
            getNotesForStrategy,
            childNotes => {
                if (recursive) return processRecursively(sourceCollection);
                if (includeSource) return combineSourceAndChildren(sourceCollection, childNotes);
                return childNotes;
            },
            result => formatOutput ? this.formatNotesCollection(result) : result
        );

        return process(sourceCollection);
    }


    // // New consolidated helper function for finding notes
    // findNotes(dv, sourceCollection, options = {}) {
    //     const {
    //         recursive = false,
    //         includeSource = false,
    //         formatOutput = false
    //     } = options;


    //     // Utility function for function composition
    //     const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

    //     // Pure function to get child notes
    //     const getChildNotes = collection => {

    //         return this.findNotesWithCriteria(dv, collection, {
    //             matchNoteBook: true,
    //             // excludeNoteType: this.isCollection(noteTypePath),
    //             // this implementation is hella confusion, if the noteType is a Collection, 
    //             // then this is true and so the reference note type "Collection", won't be included
    //             isParent: true, 
    //             isBranch: true
    //         });
    //     };

    //     // Pure function for recursive processing using immutable patterns
    //     const processRecursively = collection => {
    //         const processCategory = ([category, notes]) => {
    //             const processNote = (accumulator, note) => {
    //                 const childNotes = getChildNotes({ [category]: [note] });
    //                 const categoryChildren = childNotes[category] || [];
                    
    //                 return {
    //                     processed: [...accumulator.processed, ...categoryChildren],
    //                     toProcess: [...accumulator.toProcess, ...categoryChildren]
    //                 };
    //             };

    //             const processAllNotes = (notesToProcess, accumulated = []) => {
    //                 if (notesToProcess.length === 0) return accumulated;
                    
    //                 const [currentNote, ...remainingNotes] = notesToProcess;
    //                 const result = processNote(
    //                     { processed: accumulated, toProcess: [] }, 
    //                     currentNote
    //                 );
                    
    //                 return processAllNotes(
    //                     [...remainingNotes, ...result.toProcess],
    //                     result.processed
    //                 );
    //             };

    //             return [category, processAllNotes(notes)];
    //         };

    //         return Object.fromEntries(
    //             Object.entries(collection).map(processCategory)
    //         );
    //     };

    //     // Pure function to combine source and child notes
    //     const combineSourceAndChildren = (sourceCollection, childNotes) => 
    //         Object.entries(sourceCollection).reduce((acc, [category, notes]) => ({
    //             ...acc,
    //             [category]: [...notes, ...(childNotes[category] || [])]
    //         }), {});

    //     // Main processing pipeline
    //     const process = pipe(
    //         getChildNotes,
    //         childNotes => {
    //             if (recursive) return processRecursively(sourceCollection);
    //             if (includeSource) return combineSourceAndChildren(sourceCollection, childNotes);
    //             return childNotes;
    //         },
    //         result => formatOutput ? this.formatNotesCollection(result) : result
    //     );

    //     return process(sourceCollection);
    // }

    // This function theoretically feeds the down stream table generation
    getAllChildNotes(dv, rootCollections) {
        return this.findNotes(dv, rootCollections, {
            recursive: true
        });
    }

    // Main formatting functions
    // Format collection of notes
    formatNotesCollection(collections, options = {}) {

        const formatNoteDisplay = (note, category, options = {}) => {
            const {
                formatter = 'default',
                showCategory = false,
                customFormat = null
            } = options;

            // console.log('Note object:', note);
            // console.log('Note page:', note.page);
            // Consider where to add filtering of these notes based on their content
            // Not sure if it makes sense to do that here or earlier in the code

            // Define formatters inline
            const displayFormatters = {
                default: (note, category) => ({
                    display: note.name,
                    value: note
                }),
                
                // collection: (note, category) => ({
                //     // Example: Show notebook type and name for collections
                //     display: `📚 ${note.noteBook?.display} - ${note.name}`,
                //     value: note
                // }),
                
                categorized: (note, category) => ({
                    // Example: Show folder path and note type
                    display: `${category} : [${note.noteType?.display}] ${note.name}`,
                    value: note
                }),

                // Example of a more complex formatter
                collection: (note, category) => ({
                    display: `${category} | ${note.folder} | ${note.noteType?.display || 'No Type'} | ${note.name}`,
                    value: note
                })
            };

            const isCollection = this.isCollection(note.noteType?.path);
            
            // Example: You could add more complex formatting logic
            let selectedFormatter = 'default';
            if (isCollection) {
                selectedFormatter = 'collection';
            } else if (showCategory) {
                selectedFormatter = 'categorized';
            } else if (note.noteType?.display === 'Special Type') {
                selectedFormatter = 'detailed';
            }

            if (displayFormatters[formatter]) {
                selectedFormatter = formatter;
            }

            return displayFormatters[selectedFormatter](note, category);
        }   


        return Object.entries(collections)
            .flatMap(([category, notes]) => 
                notes.map(note => {
                    const formatted = formatNoteDisplay(note, category, options);
                    return {
                        display: formatted.display,
                        value: { [category]: [formatted.value] }
                    };
                })
            )
            .reduce((result, formatted) => ({
                displays: [...result.displays, formatted.display],
                values: [...result.values, formatted.value]
            }), { displays: [], values: [] });
    }

    async generateNoteTable(dv, targetNote, options = {}) {
        const {
            sortByCreated = true,
            limit = null
        } = options;

        // Create initial collection structure
        const sourceCollection = {
            [targetNote.noteBook.display]: [targetNote]
        };

        // Use findNotes to get all related notes
        const relatedNotes = await this.traverseNotebook(dv, sourceCollection, {
            recursive: true,
            includeSource: true,
            formatOutput: false,
            traversalType: "children"
        });

        // Flatten the notes from all categories
        const allNotes = Object.values(relatedNotes)
            .flat()
            .map(note => note.page);

        // Sort notes if requested
        if (sortByCreated) {
            allNotes.sort((a, b) => 
                DateTime.fromISO(b.created).diff(DateTime.fromISO(a.created))
            );
        }

        // Apply limit if specified
        const limitedNotes = limit ? allNotes.slice(0, limit) : allNotes;

        // Generate table data
        const tableData = limitedNotes.map(note => [
            note.file.link,
            note.created,
            note.noteType,
            note.file.folder,
            this.convertLinksToCommaSeparatedList(note.parent)
        ]);

        return {
            headers: ["Name", "Created Date", "noteType", "Parent"],
            rows: tableData
        };
    }

    // Add helper method for converting links to comma-separated list
    convertLinksToCommaSeparatedList(links) {
        if (!links) return '';
        const linkArray = Array.isArray(links) ? links : [links];
        return linkArray
            .map(link => link.path || link)
            .filter(Boolean)
            .join(', ');
    }



    // 3. TEMPLATE HANDLING & SELECTION

    async getTemplateAndLocation(tp, dv, destinationType, config, destinationNotebook = null) {
        // if Inbox use inbox template and path
        if (destinationType === "Inbox") {
            return this.getInboxTemplateAndLocation(dv, config);
        }

        const fileTemplateNote = await this.selectNoteTemplate(tp, dv, destinationNotebook);
        const targetLocation = await this.getLocationConfig(tp, fileTemplateNote, destinationNotebook);
        return { fileTemplateNote, targetLocation };
    }

    getInboxTemplateAndLocation(dv, config) {
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

    async selectNoteTemplate(tp, dv, destinationNotebook) {
        const noteTypePath = this.accessCollectionAttribute(destinationNotebook, "noteType")[0].path.toLowerCase();
        const noteBookPath = this.accessCollectionAttribute(destinationNotebook, "path")[0];


        // check if this note is the root collection note, if so use root template
        if (this.isCollection(noteTypePath)) {
            return this.extractTemplates(dv.page(noteBookPath).rootTemplate);

        }

        // Need to double check if the use of noteTypePath here is making the template files in config always the reference
        // for selecting a new note template rather than the ones linked in the parent
        // This is using the template file in config and this is the intended behavior

        // if not root collection note, get the leaf and branch templates from the noteType template in the Config folder
        const noteTypePage = dv.page(noteTypePath);
        let templates = [];

        if (noteTypePage.leafTemplate) {
            templates = templates.concat(this.extractTemplates(noteTypePage.leafTemplate));
        }
        if (noteTypePage.branchTemplate) {
            templates = templates.concat(this.extractTemplates(noteTypePage.branchTemplate));
        }

        const selectedTemplate = await tp.system.suggester(
            templates.map(item => item.display),
            templates,
            true,
            "Select Note Template"
        );

        return dv.page(selectedTemplate.path);
    }

    extractTemplates(templates) {
        if (!templates) return [];
        return Array.isArray(templates) ? templates : [templates];
    }

    // 4. LOCATION & PATH MANAGEMENT

    // Takes a template and destination, returns a complete location configuration
    async getLocationConfig(tp, fileTemplateNote, destinationNotebook) {
        const baseFolder = this.accessCollectionAttribute(destinationNotebook, "folder")[0];
        
        // If no folder specified in template, use standard location
        if (!fileTemplateNote.folder) {
            return { 
                basePath: baseFolder, 
                subPath: null, 
                type: "standard" 
            };
        }
        
        // Handle folder selection if multiple options exist
        const subPath = Array.isArray(fileTemplateNote.folder) 
            ? await this.selectFolder(tp, fileTemplateNote.folder)
            : fileTemplateNote.folder;
            
        return {
            basePath: baseFolder,
            subPath: subPath,
            type: "custom"
        };
    }

  // Helper function for folder selection
    async selectFolder(tp, folderOptions) {
        // For single folder option, return it directly
        if (folderOptions.length <= 1) {
            return folderOptions[0];
        }
        
        // Create display options for folder selection
        const options = folderOptions.map(path => ({
            display: path.split('/').pop(), // Get last folder component
            fullPath: path
        }));

        // Prompt user to select folder
        return await tp.system.suggester(
            options.map(opt => opt.display),
            options.map(opt => opt.fullPath),
            false,
            "Select Subfolder"
        );
    }

    // SECTION 5 NOTE CREATION & FILE OPERATIONS

   // Creates a complete file path and creates the new note
    async createNote(tp, targetLocation, fileName, metadata, fileTemplateNote) {
        // Build the complete file path
        const fullPath = await this.buildNotePath(
            targetLocation, 
            fileName, 
            metadata, 
            fileTemplateNote
        );
        
        // Get template content and create file
        const templateContent = await this.getTemplateContent(tp, fileTemplateNote);
        const abstractFolder = await app.vault.getAbstractFileByPath("/");
        
        return tp.file.create_new(
            templateContent,
            fullPath,
            false,
            abstractFolder
        );
    }

    // Helper function to build complete note path
    buildNotePath(targetLocation, fileName, metadata, fileTemplateNote) {

        // Create filename with date if required
        const fullName = fileTemplateNote.dated 
            ? `${metadata.today}-${fileName}` 
            : fileName;
        
        // Build base path depending on location type
        const { basePath, subPath, type } = targetLocation;
        const notePath = type === "inbox"
            ? `${basePath}/${metadata.fileYear}/${fullName}`
            : subPath 
                ? `${basePath}/${subPath}/${fullName}`
                : `${basePath}/${fullName}`;
                
        // Add folder structure if it's a folder note
        return fileTemplateNote.folderNote 
            ? `${notePath}/${fullName}` 
            : notePath;
    }


    async getTemplateContent(tp, fileTemplateNote) {
    const templateFile = await tp.file.find_tfile(fileTemplateNote.file.path);
        if (!templateFile) {
            throw new Error(`Template file not found: ${fileTemplateNote.file.path}`);
        }
        return await app.vault.read(templateFile);
    }

    // 6. FRONTMATTER MANAGEMENT

    async applyFrontmatter(newFile, destinationNotebook, fileTemplateNote, config, destinationType, timestamp) {
        await app.fileManager.processFrontMatter(newFile, frontmatter => {
            this.cleanupTemplateFrontmatter(frontmatter);
            this.addCoreFrontmatter(frontmatter, fileTemplateNote, config, timestamp);
            
            if (destinationType !== "Inbox") {
                this.addDestinationFrontmatter(frontmatter, destinationNotebook);
            }
        });
    }

    cleanupTemplateFrontmatter(frontmatter) {
        const keysToRemove = ["aliases", "dated", "folderNote", "folder", "modified"];
        keysToRemove.forEach(key => delete frontmatter[key]);
    }

    addCoreFrontmatter(frontmatter, fileTemplateNote, config, timestamp) {
        frontmatter["noteType"] = this.createWikiLink(
            fileTemplateNote.file.path,
            fileTemplateNote.aliases[0]
        );
        frontmatter["created"] = timestamp;
        frontmatter["user"] = this.createWikiLink(
            config.filePath,
            config.user
        );
    }

    addDestinationFrontmatter(frontmatter, destinationNotebook) {
        frontmatter["parent"] = this.createWikiLink(
            this.accessCollectionAttribute(destinationNotebook, "path")[0],
            this.accessCollectionAttribute(destinationNotebook, "name")[0]
        );
        
        frontmatter["noteBook"] = this.createWikiLink(
            this.accessCollectionAttribute(destinationNotebook, "noteBook")[0].path,
            this.accessCollectionAttribute(destinationNotebook, "noteBook")[0].display
        );
    }

    createWikiLink(path, display) {
        const cleanPath = path.split(".md")[0];
        return `[[${cleanPath}|${display}]]`;
    }

    // 8. UTILITY FUNCTIONS
    accessCollectionAttribute(data, element) {
        return Object.keys(data).reduce((catElements, category) => {
            data[category].forEach(item => {
                catElements.push(item[element]);
            });
            return catElements;
        }, []);
    }

    isCollection(noteTypePath) {
        return noteTypePath?.toLowerCase()?.includes("collection") ?? false;
    }

    hasChildNotes(collection) {
        if (!collection) return false;
        return Object.values(collection).some(
            categoryNotes => categoryNotes && categoryNotes.length > 0
        );
    }

    matchNotePaths(collection1, collection2) {
        return Object.keys(collection1).some(key => 
            collection1[key].some(note1 => 
                collection2[key]?.some(note2 => note2.path === note1.path)
            )
        );
    }

}
