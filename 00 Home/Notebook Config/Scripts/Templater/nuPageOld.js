async function nuPage(tp, dv) {
    // Load the configuration note and set up defaults based on config
    const {noteFilter} = await cJS();
    let config = noteFilter.loadConfig(dv);
    let admin = config["admin"];
    let configCategories = config["categories"];
    let configCollections = config["collections"];
    let exclusionTemplate = "00 Home/Notebook Config/Note Templates/Note Templates.md";
    let fileYear = tp.date.now("YYYY");

    // Begin filing the note
    let noteDest;
    if (admin == true) {
        noteDest = await tp.system.suggester(["Inbox",
                                             // "Current", Feature not yet available
                                              "Root"],
                                            ["Inbox",
                                             // "Current",
                                              "Root"],
                                               true, "Select Note Destination");
    } else if (admin == false) {
        noteDest = "Root"
    };
    // Load variables that will be assigned going through the options below
    let fileTemplate;
    let destinationNoteBook;

    if (noteDest !== "Inbox") {

        // Select Which Notebook

        let currentCollections = {}; inputSug = []; inputVal = [];
        if (noteDest === "Current") {
           
        } else if (noteDest === "Root") {
            console.log("configCollections", configCollections);

            currentCollections = noteFilter.getChildNotes(dv, configCollections, "this", true, false)
            console.log("currentCollections", currentCollections);
            ({ inputSug, inputVal } = noteFilter.createSuggesterInputs(dv, currentCollections, configCollections, noteDest, admin));

        }

        let collection;
        collection = await tp.system.suggester(inputSug, inputVal, true, "Select a Collection");
        console.log("collection", collection);
        // // Finding the noteType Templates for the selected Collection 
        let root = noteFilter.accessCollectionAttribute(collection, "noteType")[0]["path"].toLowerCase()
        console.log("root", root)

        let level = 0;
        while (true) {
            let childNotesList
            console.log(level)
            if (root.includes("collection")) {
                console.log("root note")
                childNotesList = noteFilter.getChildNotes(dv, collection, "this", true, false);
            } else {
                console.log("other note")
                childNotesList = noteFilter.getChildNotes(dv, collection, "this", true, null);
            }
            // console.log("childNotesList 1", childNotesList);
            if (noteFilter.hasChildNotes(childNotesList)) {
                for (let cat in childNotesList) {
                    childNotesList[cat].unshift(collection[cat][0]);
                }
                // console.log("childNotesList 2", childNotesList);

                ({ inputSug, inputVal } = noteFilter.createSuggesterInputs(dv, childNotesList, configCollections, "Selected", admin));
                let selectedNotebook = await tp.system.suggester(inputSug, inputVal, true, "Select a Notebook");
                level++;
                let sameAsDestNote = false;
                for (let key in selectedNotebook) {
                    if (selectedNotebook.hasOwnProperty(key)) {
                        for (let index in selectedNotebook[key]) {
                            if (selectedNotebook[key][index]["Path"] == collection[key][index]["Path"]) {
                                destinationNoteBook = selectedNotebook;
                                sameAsDestNote = true;
                                break;
                            }
                        }
                    }
                }
                // console.log(sameAsDestNote)
                if (sameAsDestNote) {
                    destinationNoteBook = selectedNotebook;
                    break;
                }
                collection = selectedNotebook;
            } else {
                destinationNoteBook = collection;
                break;
            }
        }
        destinationNoteBook = collection;
    
    console.log("destinationNoteBook", destinationNoteBook)
    console.log(noteFilter.accessCollectionAttribute(destinationNoteBook, "noteBook")[0].display)
    let NoteBookFile = noteFilter.accessCollectionAttribute(destinationNoteBook, "Page")[0]
    let NoteBookPath = noteFilter.accessCollectionAttribute(destinationNoteBook, "Path")[0]
    console.log("NoteBookPath", NoteBookPath, "NoteBookFile", NoteBookFile)
    let destNoteType = noteFilter.accessCollectionAttribute(destinationNoteBook, "noteType")[0];
    let destNoteTypePath = destNoteType.path
    console.log("destNoteType", destNoteType)

    let destNoteBookTemplates = [];

    let destNoteTemplatePath = destNoteType["path"].toLowerCase()
        if (destNoteTemplatePath.includes("collection")) {
            let rootTemplate = dv.page(NoteBookPath).rootTemplate
            console.log("rootTemplate", rootTemplate)
            if (rootTemplate != null) {
                if (Array.isArray(rootTemplate)) {
                    rootTemplate.forEach((template) => destNoteBookTemplates.push(template))
                    console.log("destNoteBookTemplates 1 A", destNoteBookTemplates)

                } else {
                    destNoteBookTemplates.push(rootTemplate)
                    console.log("destNoteBookTemplates 1 B", destNoteBookTemplates)

                }
            }
            console.log("destNoteBookTemplates 1 ", destNoteBookTemplates)

        } else {
            let allTemplate = dv.page(destNoteTypePath).allTemplate
            console.log("allTemplate", allTemplate)
            if (allTemplate != null) {
                if (Array.isArray(allTemplate)) {
                    allTemplate.forEach((template) => destNoteBookTemplates.push(template))
                } else {
                    destNoteBookTemplates.push(allTemplate)
                }
            }
            let adminTemplate = dv.page(destNoteTypePath).adminTemplate
            if (admin == true) {
                if (adminTemplate != null) {
                    if (Array.isArray(adminTemplate)) {
                        adminTemplate.forEach((template) => destNoteBookTemplates.push(template))
                    } else {
                        destNoteBookTemplates.push(adminTemplate)
                    }
                }

            }
            console.log("destNoteBookTemplates 2", destNoteBookTemplates)
        }

    // Suggester to select from any of the available page templates or create a new category page
    fileTemplate = await tp.system.suggester(destNoteBookTemplates.map(item => item.display), destNoteBookTemplates, true, "Select Note Template");
    console.log("fileTemplate", fileTemplate)
    }
    // Get folder path
    let targetFolder;
    let fileTemplateNote;
    // set it conretely for the inbox
    if (noteDest === "Inbox") {
        targetFolder = `00 Home/Inbox/${fileYear}`;
        noteTemplate = dv.page(config["templateFolder"][0]["path"]);
        fileTemplate = noteTemplate["inboxTemplate"]
        fileTemplateNote = dv.page(fileTemplate.path)

        // console.log("fileTemplate", fileTemplate)
    } else {
    // Everything else is querying the folder of the template note and will generate a suggester if there is more than one
        fileTemplateNote = dv.page(fileTemplate.path)
        console.log("fileTemplateNote", fileTemplateNote)
        if (fileTemplateNote.hasOwnProperty("folder") && Array.isArray(fileTemplateNote["folder"])) {
            console.log("fileTemplateNote[folder]", fileTemplateNote["folder"])
            let appendPath;
            if (fileTemplateNote["folder"].length > 1 ) {
                let pathSug = fileTemplateNote["folder"];
                appendPath = await tp.system.suggester(fileTemplateNote["folder"].map(path => {
                    const pathComponents = path.split('/');
                    return pathComponents[pathComponents.length - 1];
                }), fileTemplateNote["folder"])
            } else {
                appendPath = fileTemplateNote["folder"][0]
            }
            targetFolder = String(noteFilter.accessCollectionAttribute(destinationNoteBook, "Folder")) + "/" + appendPath;
        } else {
           targetFolder = String(noteFilter.accessCollectionAttribute(destinationNoteBook, "Folder"));
        }
    }

    console.log("targetFolder", targetFolder)
    let fileName = await tp.system.prompt("Enter Note Name");

    let datedNote = fileTemplateNote.dated
    let folderNote = fileTemplateNote.folderNote

    let fullName = datedNote == true
        ? `${tp.date.now("YYYY-MM-DD")}-${fileName}`
        : fileName;

    let filePath = folderNote == true
        ? `${targetFolder}/${fullName}/${fullName}`
        : `${targetFolder}/${fullName}`;

    let templateType = String(fileTemplateNote.templateType);
    console.log("fileName", fileName, datedNote, folderNote, fullName, filePath)

    let abstractFolder = await app.vault.getAbstractFileByPath("/");
    let templateContent = await tp.file.find_tfile(fileTemplate.path);
    let strTemplateContent = await app.vault.read(templateContent);
    let newTFile = await tp.file.create_new(strTemplateContent, filePath, false, abstractFolder);
    let TFilePath = newTFile.path.split(".md")[0];
    console.log("TFilePath", TFilePath)
    let newDVFile = await dv.page(TFilePath);
    console.log("newDVFile", newDVFile)
    // Apply Frontmatter to new file (commented out)
    console.log(config, config["filePath"])
    await app.fileManager.processFrontMatter(newTFile, frontmatter => {
        // Removing template frontmatter
        delete frontmatter["aliases"];
        delete frontmatter["dated"];
        delete frontmatter["folderNote"];
        delete frontmatter["folder"];
        delete frontmatter["modified"];

        // Adding new frontmatter based on creation
        frontmatter["noteType"] = "[[" + fileTemplate.path.split(".md")[0] + "|" + fileTemplate.display + "]]";
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ss[Z]");
        frontmatter["user"] = "[[" + config["filePath"].split(".md")[0] + "|" + config["user"] +"]]";

        // Adding Category Specific frontmatter
        if (noteDest !== "Inbox"){
            frontmatter["parent"] = "[[" + String(noteFilter.accessCollectionAttribute(destinationNoteBook, "Path")).split(".md")[0] +
             "|" + noteFilter.accessCollectionAttribute(destinationNoteBook, "Name") + "]]"; 
            frontmatter["noteBook"] = "[[" + noteFilter.accessCollectionAttribute(destinationNoteBook, "noteBook")[0].path.split(".md")[0] +
             "|" + noteFilter.accessCollectionAttribute(destinationNoteBook, "noteBook")[0].display + "]]";
        }
    });

    return newTFile;
}

module.exports = nuPage;