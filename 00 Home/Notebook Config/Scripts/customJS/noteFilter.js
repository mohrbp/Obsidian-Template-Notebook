class noteFilter {
	
    loadTasksDev(args) {
    const {dv, target, query} = args;
// Usually target is the noteType and query is the result of the the current noteType in the current file
// so target is "Projects" and query is the current Projects links
    // console.log("target2", target, query)
//    let queryLinks = Array.isArray(query) ? query : [query];

    // Create a usable input for the Get Child Notes func
    let input = query;
    let page = dv.page(input[0]["path"])
    let pageNoteType = page.noteType
    let noteType = target[0]["display"]
    console.log("input", input)
    // console.log("noteType", noteType)


    let nestedInput = {[noteType] : []}
    let inputNote = {
        Name : page.file.name,
        Path : page.file.path,
        Link : input,
        Page : page,
        noteType : target[0],
        Folder : page.file.folder
    }
    nestedInput[noteType].push(inputNote);
    let allChildNotes = this.getAllChildNotes(dv, nestedInput)
    let taskFilter = {};

    for (let cat in allChildNotes) {

        taskFilter["noteType"] = {
            excludePaths : pageNoteType[0]["path"]
        }
        taskFilter[cat] = {
            includePaths : [page.file.path],
            excludePaths : []
        }

        for (let index in allChildNotes[cat]) {
            taskFilter[cat]["includePaths"].push(String(allChildNotes[cat][index]["Path"]))
        }

    }

    return dv.pages()
        .filter(p => this.dataFilter([p], taskFilter).length > 0)
        .file
        .tasks
        // // Tasks only in the Tasks Header
        .where(t => t.link.subpath == "Tasks")
        // // Only Parent Tasks, No Subtasks
        // // Subtasks can still be accessed through parent
        .where(t => !t.hasOwnProperty("parent"));
    }

    loadConfig (dv) {

        let config = {
            categories : {},
            collections: {}
        };

        // Load the configuration note
        let configNote = dv.page("/00 Home/Notebook Config/Notebook Config");
        console.log("configNote",configNote, configNote.admin)
        config["admin"] = configNote.admin
        config["templateFolder"] = configNote.templateFolder
        config["excludePaths"] = configNote.excludePaths
        config["user"] = configNote.user
        config["filePath"] = configNote.file.path

        console.log("config 1", config)

        let configCategories;
        configCategories = Object.keys(configNote).reduce((filteredConfigCategories, key) => {
            if (key.startsWith("category")) {
                filteredConfigCategories[key] = configNote[key];
            }
            return filteredConfigCategories;
        }, {});

        for (let key in configCategories) {
            let catName = configCategories[key][0]["display"];
            config["categories"][catName] = {
                Name: catName,
                catNumber: key,
                Link: configCategories[key][0]
                // Add other properties here if needed
            };
        };

        for (let key in configNote.collections) {
            console.log(key)
            let collectionPath = configNote.collections[key];
            let collectionname = collectionPath["display"]
            let collectionPage = dv.page(collectionPath)
            config["collections"][collectionname] = []
            let collectionData = {
                Name: collectionname,
                Link: collectionPath,
                Path: collectionPath["path"],
                noteBook: collectionPage.noteBook,
                noteType: collectionPage.noteType,
                Folder: collectionPage.file.folder,
                catNumber: key,
            };
            config["collections"][collectionname].push(collectionData)
        };
        console.log("config 2", config)

        // Output config
        return config;
    }

    accessCatObject (data, element) {
        let catElements = [];
        Object.keys(data).forEach(category => {
            data[category].forEach(item => {
                catElements.push(item[element]);
            });
        });
        return catElements;
    }

    selectCategories (dv, sourceCategories, targetCategories, configCategories) {
        for (let key in sourceCategories) {
            if (configCategories.hasOwnProperty(key)) {
                // console.log("sourceCategories[key]", sourceCategories[key])
                targetCategories[key] = sourceCategories[key].map(category => ({
                    Name: dv.page(category["path"]).file.name,
                    Link: category,
                    Page: dv.page(category["path"]),
                    Path: category["path"],
                    noteBook: configCategories[key]["Link"],
                    Folder: dv.page(category["path"]).file.folder
                }));
            }
        }
    }
    createSuggesterInputsDevII (dv, inputData, config,  prefix = null, admin) {
        // Function to create suggester inputs
        let inputSug = [], inputVal = []; 
        // Object.keys(inputData).forEach((key, index) => {
        // if (inputData.hasOwnProperty(key)) {
        //     childNotesList[key] = [];
        //     let parentFilter;
        //     if (inputData[key].hasOwnProperty(index)) {
        for (let collection in inputData) {

            let inputCollectionName = collection;
            let inputValNote = inputCollectionName;
            // console.log("inputData collection config", inputData, collection, config )
            let headerNote = {};
            headerNote[collection] = [];
            if (prefix && prefix == "Root") {
            // console.log("inputData[collection]", inputData[collection])

                let collectionNote = dv.page(config[collection][0].Link.path)
                console.log("collectionNote", collectionNote, inputCollectionName)
                let inputCollectionNote = {
                    Name: collectionNote.file.name,
                    Path: collectionNote.file.path,
                    Page: collectionNote,
                    Link: collectionNote.file.link,
                    noteBook: collectionNote.noteBook,
                    noteType: collectionNote.noteType,
                    Folder: collectionNote.file.folder,
                }
                headerNote[collection].push(inputCollectionNote)
                inputValNote = headerNote;

            }

            if (inputData[collection].length > 0) {
                let inputNote = inputData[collection][0];
                if (prefix && prefix == "Selected") { 
                    inputCollectionName = prefix + " " + collection + " " + inputNote["Name"];
                    headerNote[collection].push(inputNote)
                    inputValNote = headerNote;
                    inputData[collection].shift()
                } 

                inputData[collection].forEach(note => {
                    inputSug.unshift(note["Name"]);
                    inputVal.unshift({ [collection]: [note] });
                });
            }

            inputCollectionName = inputCollectionName
            inputSug.unshift(inputCollectionName);
            inputVal.unshift(inputValNote);       
        };

        console.log("inputSug", inputSug, "inputVal", inputVal);

        return { inputSug, inputVal };
    };

    createSuggesterInputsDev (dv, inputData, config,  prefix = null, admin) {
        // Function to create suggester inputs
        let inputSug = [], inputVal = []; 
        for (let cat in inputData) {

            let inputCatName = cat;
            let inputValNote = inputCatName;
            console.log("inputData cat config", inputData, cat, config )
            let headerNote = {};
            headerNote[cat] = [];
            if (prefix && prefix == "Root") {

                inputCatName = cat;
                let categoryNote = dv.page(config[cat].Link.path)
                console.log("categoryNote", categoryNote, inputCatName)
                let inputCatNote = {
                    Name: categoryNote.file.name,
                    Path: categoryNote.file.path,
                    Page: categoryNote,
                    Link: config[cat].Link,
                    noteBook: config[cat].Link,
                    noteType: categoryNote.noteType,
                    Folder: categoryNote.rootFolder,
                }
                headerNote[cat].push(inputCatNote)
                inputValNote = headerNote;

            }

            if (inputData[cat].length > 0) {
                let inputNote = inputData[cat][0];
                if (prefix && prefix == "Selected") { 
                    inputCatName = prefix + " " + cat + " " + inputNote["Name"];
                    headerNote[cat].push(inputNote)
                    inputValNote = headerNote;
                    inputData[cat].shift()
                } 

                inputData[cat].forEach(note => {
                    inputSug.unshift(note["Name"]);
                    inputVal.unshift({ [cat]: [note] });
                });
            }

            inputCatName = inputCatName
            inputSug.unshift(inputCatName);
            inputVal.unshift(inputValNote);       
        }
        console.log("inputSug", inputSug, "inputVal", inputVal)    
        return { inputSug, inputVal };
    };
    createSuggesterInputs (dv, inputData, config,  prefix = null, admin) {
        // Function to create suggester inputs
        let inputSug = [], inputVal = []; 
        for (let cat in inputData) {

            let inputCatName = cat;
            let inputValNote = inputCatName;
            console.log(inputData, cat, config )
            let headerNote = {};
            headerNote[cat] = [];
            if (prefix && prefix == "Root" && admin == true) {

                inputCatName = prefix + " " + cat;
                let categoryNote = dv.page(config[cat].Link.path)
                console.log(inputCatName, categoryNote)
                let inputCatNote = {
                    Name: categoryNote.file.name,
                    Path: categoryNote.file.path,
                    Page: categoryNote,
                    Link: config[cat].Link,
                    noteType: config[cat].Link,
                    Folder: categoryNote.rootFolder,
                }
                headerNote[cat].push(inputCatNote)
                inputValNote = headerNote;

            } else if (prefix && prefix == "Root" && admin == false) {
                // inputCatName = prefix + " " + cat;

            } 

            if (inputData[cat].length > 0) {
                let inputNote = inputData[cat][0];
                if (prefix && prefix == "Selected") { 
                    inputCatName = prefix + " " + cat + " " + inputNote["Name"];
                    headerNote[cat].push(inputNote)
                    inputValNote = headerNote;
                    inputData[cat].shift()
                } 

                inputData[cat].forEach(note => {
                    inputSug.unshift(note["Name"]);
                    inputVal.unshift({ [cat]: [note] });
                });
            }

            inputCatName = "**" + inputCatName + "**"
            inputSug.unshift(inputCatName);
            inputVal.unshift(inputValNote);       
        }
        console.log("inputSug", inputSug, "inputVal", inputVal)    
        return { inputSug, inputVal };
    };

    dataFilter(data, filterCriteria) {
        // console.log("Data", data)
        return data.filter(page => {
            // Check each filter criteria
            // console.log("page", page)
            for (let key in filterCriteria) {
                if (filterCriteria.hasOwnProperty(key)) {
                    let criteria = filterCriteria[key];
                    // console.log("key", key)
                    // Include Paths
                    if (criteria.includePaths && criteria.includePaths.length > 0) {
                        if (!page[key]) return false;
                        let paths = Array.isArray(page[key]) ? page[key].map(p => p.path) : [page[key].path];
                       // console.log("Path", paths, criteria);
                        if (!paths.some(path => criteria.includePaths.includes(path))) {
                           // console.log("false")
                            return false};
                    }

                    // Exclude Paths
                    if (criteria.excludePaths && criteria.excludePaths.length > 0) {
                        if (!page[key]) return false; // Change to false to ensure exclusion is properly checked
                        let paths = Array.isArray(page[key]) ? page[key].map(nt => nt.path) : [page[key].path];
                        if (paths.some(path => criteria.excludePaths.includes(path))) return false;
                    }
                    
                    // Additional Criteria (Example: Check if a property exists and is not null)
                    if (criteria.required && !page[key]) {
                        return false;
                    }

                    // Add more conditions as needed
                }
            }
            return true; // Only return true if all criteria pass
        }).map(page => {
            // Modify elements based on filterCriteria (if needed)
            // For example, you could add or edit properties of each page here
            return page;
        });
    }

    getAllChildNotes (dv, input) {
        let level = 0;
        let allChildNotes = {};
        // console.log("input-func", input, "args", args)
        for (let cat in input) {
            // console.log(input[cat]);
            allChildNotes[cat] = []
            let queue = input[cat];
            // console.log("queue", queue, queue.length)
            while (queue.length > 0) {
                let currentInput = {[cat] : []}
                currentInput[cat].push(queue[0])
                // console.log("currentInput", currentInput)
                queue.shift()
                // console.log("queue", queue, queue.length)
                let childNotesList = this.getChildNotes(dv, currentInput, "ChildCategory");
                // console.log("childNotesList", childNotesList)
                if (this.hasChildNotes(childNotesList)) {
                    allChildNotes[cat].push(...childNotesList[cat]);
                    queue.push(...childNotesList[cat])
                    // console.log("queue", queue, queue.length)
                }
            }
        }
        // console.log("allChildNotes", allChildNotes)   
        return(allChildNotes)

    }

    getChildNotesDev (dv, nestedInput, matchParent = "this", matchNoteBook = false, matchNoteType = null) { 
        let childNotesList = {};
        Object.keys(nestedInput).forEach((key) => {
            // console.log("key", key)
            if (nestedInput.hasOwnProperty(key)) {
            console.log("nestedInput[key]", nestedInput[key])

                childNotesList[key] = [];
                let parentFilter = {};
                Object.keys(nestedInput[key]).forEach((index) => {
                console.log("nestedInput[key][index]", nestedInput[key][index])

                        let parentCollection = nestedInput[key][index];
                        let parentPath = parentCollection["Path"];
                        // console.log("parentCollection", parentCollection, parentPath)
                        if (matchParent == "this") {
                            parentFilter["parent"] = {
                                includePaths: parentPath
                            } 
                        } else if (matchParent == "noteBook") {
                            parentFilter["parent"] = {
                                includePaths: parentCollection["noteBook"]["path"]
                            }  
                        }   
                        if (matchNoteBook == true) {
                            parentFilter["noteBook"] = {
                                includePaths: parentCollection["noteBook"]["path"],
                            }
                        };
                        if (matchNoteType == true) {
                            parentFilter["noteType"] = {
                                includePaths: parentCollection["noteType"]["path"],
                            }
                        } else if (matchNoteType == false) {
                            parentFilter["noteType"] = {
                                excludePaths: parentCollection["noteType"]["path"],
                            }
                        } else if (matchNoteType == null) {
                            let noteTypePath = parentCollection["noteType"]["path"]
                            let noteTypeFile = dv.page(noteTypePath)
                            // console.log("templates", noteTypeFile.adminTemplate)
                            let noteTypePaths = []
                            if (noteTypeFile.adminTemplate) { 
                                noteTypeFile.adminTemplate.forEach((template) => {
                                    // console.log(template, template.path)
                                    noteTypePaths.push(template.path)
                                })
                            }

                            parentFilter["noteType"] = {
                                includePaths: noteTypePaths,
                            }
                        }
                        console.log("parentFilter Dev", parentFilter)
                    
                        let childPages = dv.pages().filter(p => this.dataFilter([p], parentFilter).length > 0);
                        // console.log("childPages", childPages)
                        if (Array.isArray(childPages) && childPages.length > 0) {
                            childPages.forEach((page) => {
                                console.log("page", page)
                                let childPage = {
                                    Name: page.file.name,
                                    Path: page.file.path,
                                    Link: page.file.link,
                                    Page: page,
                                    noteBook: parentCollection["noteBook"],
                                    noteType: page.noteType,
                                    Folder: page.file.folder
                                }
                                childNotesList[key].unshift(childPage)
                        })
                    }
                })
            }
        })  
        // console.log ("childNotesList", childNotesList)
        return childNotesList;
    }

    getChildNotes (dv, nestedInput, mode, eX = "00 Home/Notebook Config/Note Templates/Note Templates.md") { 
        let childNotesList = {};
        Object.keys(nestedInput).forEach((key, index) => {
            if (nestedInput.hasOwnProperty(key)) {
                childNotesList[key] = [];
                let parentCategory;
                let parentPath;
                let parentCategoryName = `parent${key}`;
                let parentFilter;


                if (mode == "RootCategory") {
                    parentCategory = nestedInput[key];
                    console.log("parentCategory", parentCategory)

                    let parentCategoryNote = dv.page(parentCategory["Link"]["path"])
                    parentFilter = {
                        noteBook: {
                            includePaths: parentCategory["Link"]["path"]
                        },
                        [parentCategoryName]: {
                            includePaths: parentCategoryNote.rootNote.path
                        }
                    };
                } else if (nestedInput[key].hasOwnProperty(index)) {
                    if (mode == "ChildCategory") {
                        // console.log("mode", mode)
                        parentCategory = nestedInput[key][index];
                        parentPath = parentCategory["Path"];
                        console.log("parentCategory", parentCategory, parentPath)
                        parentFilter = {
                            noteBook: {
                                includePaths: parentCategory["noteBook"]["path"],
                            },
                            noteType: {
                                excludePaths: eX
                            },
                            [parentCategoryName]: {
                                includePaths: parentPath
                            }
                        };
                        console.log("parentFilter", parentFilter)

                    } else if (mode == "ChildPages") {
                        parentCategory = nestedInput[key][index];
                        parentPath = parentCategory["Path"];
                        let excludeTypes = [eX];
                        excludeTypes.push(parentCategory["noteBook"]["path"]);
                        parentFilter = {
                            noteBook: {
                                excludePaths: excludeTypes
                            },
                            [key]: {
                                includePaths: parentPath
                            }
                        };
                    }
                }
               // console.log("parentFilter", parentFilter)
                let childPages = dv.pages().filter(p => this.dataFilter([p], parentFilter).length > 0);
                // console.log("childPages", childPages)
                if (Array.isArray(childPages) && childPages.length > 0) {
                    childPages.forEach((page) => {
                        console.log("page", page)
                        let childPage = {
                            Name: page.file.name,
                            Path: page.file.path,
                            Link: page[key],
                            Page: page,
                            noteBook: (mode == "RootCategory") ? nestedInput[key]["Link"] : parentCategory["noteBook"],
                            noteType: page.noteType,
                            Folder: page.file.folder
                        }
                        childNotesList[key].unshift(childPage)
                    })
                }
            }
        })
    //  console.log("childNotesList-func", childNotesList)
        return childNotesList;
    }

    hasChildNotes (nestedInput) {
        for (let key in nestedInput) {
            if (nestedInput.hasOwnProperty(key)) {
                for (let index in nestedInput[key]) {
                    if (nestedInput[key].hasOwnProperty(index) && Object.keys(nestedInput[key][index]).length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

}  