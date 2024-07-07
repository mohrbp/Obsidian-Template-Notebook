async function nuPage(tp, dv) {
    // Load the configuration note and set up defaults based on config
    const {noteFilter} = await cJS();
    let config = noteFilter.loadConfig(dv);
    let configCategories = config["categories"];
    let exclusionTemplate = "01 Home/Notebook Config/Note Templates/Note Templates.md";
    let fileYear = tp.date.now("YYYY");

    // Begin filing the note
    let noteDest = await tp.system.suggester(["Inbox", "Current", "Root"], ["Inbox", "Current", "Root"]);

    // Load variables that will be assigned going through the options below
    let fileTemplate, parentNote, flag;

    if (noteDest !== "Inbox") {
        let currentCategories = {}; inputSug = []; inputVal = [];
        if (noteDest === "Current") {
            let currentNote = dv.page(tp.file.path(true));
            noteFilter.selectCategories(dv, currentNote, currentCategories, configCategories);
            ({ inputSug, inputVal } =  noteFilter.createSuggesterInputs(dv, currentCategories, config = configCategories, noteDest));

        } else if (noteDest === "Root") {
            currentCategories = noteFilter.getChildNotes(dv, configCategories, "RootCategory");
            ({ inputSug, inputVal } = noteFilter.createSuggesterInputs(dv, currentCategories, config = configCategories, noteDest));

        }

        let input;
        do {
            input = await tp.system.suggester(inputSug, inputVal);
        } while (typeof input !== "object");

        // Conditional statements to work through the nested inputs
        // Return either the re-selected parent note or the selected child note if that note doesn't have its own children

        // Finding the noteType Templates for the selected Category file
        let inputPage = noteFilter.accessCatObject(input, "Page")[0]
        let inputTypes = inputPage["noteType"]
        // console.log("inputTypes", inputTypes)
        // Check if there is more than one and get their paths
        let paths = Array.isArray(inputTypes) ? inputTypes.map(p => p.path) : [inputTypes.path];
        // This checks if you selected one of the NoteType Templates, which are only available if Root is the selected option
        // Check if their paths contain the exclusion template - if they do, then they are Root Level and creating a new Category note at root
        if (!paths.some(path => exclusionTemplate.includes(path))) {
            // If its not a new Category File at Root

            let nestedInput = input;
            let level = 0;
            while (true) {
                let childNotesList = noteFilter.getChildNotes(dv, nestedInput, "ChildCategory");
                if (noteFilter.hasChildNotes(childNotesList)) {
                    for (let cat in childNotesList) {
                        childNotesList[cat].unshift(nestedInput[cat][0]);
                    }
                    ({ inputSug, inputVal } = noteFilter.createSuggesterInputs(dv, childNotesList, config = configCategories, prefix = "Selected"));
                    let selectedInput = await tp.system.suggester(inputSug, inputVal);
                    level++;

                    let sameAsParentNote = false;
                    for (let key in selectedInput) {
                        if (selectedInput.hasOwnProperty(key)) {
                            for (let index in selectedInput[key]) {
                                if (selectedInput[key][index]["Path"] == nestedInput[key][index]["Path"]) {
                                    parentNote = selectedInput;
                                    sameAsParentNote = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (sameAsParentNote) {
                        parentNote = selectedInput;
                        break;
                    }
                    nestedInput = selectedInput;
                } else {
                    parentNote = nestedInput;
                    break;
                }
            }
            parentNote = nestedInput;
        } else {
            parentNote = input;
            flag = "New Cat"
        }


        // console.log("parentNote", parentNote)
        if (flag !== "New Cat"){ 
            // Get new note template from noteType link
            let nuTemplate = noteFilter.accessCatObject(parentNote, "noteType");
            let nuTemplateOptions = [nuTemplate[0], ...dv.page(nuTemplate[0].path).pageTemplate];
            let rNuTemplateOptions = nuTemplateOptions.reverse();
            let rNuTemplateNames = rNuTemplateOptions.map(link => link["display"]);
            // suggester to select from any of the available page templates or create a new category page
            fileTemplate = await tp.system.suggester(rNuTemplateNames, rNuTemplateOptions);
        }  else {
            fileTemplate = noteFilter.accessCatObject(parentNote, "noteType")[0];
        }
        // console.log("fileTemplate", fileTemplate)
    }



    // Get folder path
    let targetFolder;
    if (noteDest === "Inbox") {
        targetFolder = `01 Home/Inbox/${fileYear}`;
        fileTemplate = dv.page(exclusionTemplate).defaultTemplate;
    } else {
        targetFolder = String(noteFilter.accessCatObject(parentNote, "Folder"));
    }
  
    let templateType = String(dv.page(fileTemplate.path).templateType);
    let fileName = await tp.system.prompt("Enter Note Name");
    // Check if new noteType is Category for naming
    let fullName = templateType !== "Category"
        ? `${tp.date.now("YYYY-MM-DD")}-${fileName}`
        : fileName;

    // Everyone gets a folder note
    let filePath = `${targetFolder}/${fullName}/${fullName}`;

    let abstractFolder = await app.vault.getAbstractFileByPath("/");
    let templateContent = await tp.file.find_tfile(fileTemplate.path);
    let strTemplateContent = await app.vault.read(templateContent);
    let newTFile = await tp.file.create_new(strTemplateContent, filePath, false, abstractFolder);

    let newDVFile = await dv.page(newTFile.path)
    // console.log("newDVFile", newDVFile)
    // Apply Frontmatter to new file (commented out)
    await app.fileManager.processFrontMatter(newTFile, frontmatter => {
        delete frontmatter["aliases"];
        frontmatter["noteType"] = "[[" + fileTemplate.path.split(".md")[0] + "|" + fileTemplate.display + "]]";
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ss[Z]");
        if (noteDest !== "Inbox"){
            let parentNoteType = accessCatObject(parentNote, "noteType")[0]["display"]
            frontmatter[parentNoteType] = "[[" + String(noteFilter.accessCatObject(parentNote, "Path")).split(".md")[0] + "|" + noteFilter.accessCatObject(parentNote, "Name") + "]]";
            if (templateType == "Category") {
                frontmatter[parentNoteType] = "[[" + newDVFile.file.path.split(".md")[0] + "|" + newDVFile.file.name + "]]";
                frontmatter["parent" + parentNoteType] = "[[" + String(noteFilter.accessCatObject(parentNote, "Path")).split(".md")[0] + "|" + noteFilter.accessCatObject(parentNote, "Name") + "]]"; 
                delete frontmatter["templateType"];
                delete frontmatter["folder"];
                delete frontmatter["pageTemplate"];
            }
        }
    });

    return newTFile;
}

module.exports = nuPage;
