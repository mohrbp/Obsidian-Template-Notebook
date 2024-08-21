async function wildseaTemplate(tp, dv){

  // Build project Folder Structure
// await this.app.vault.createFolder(tp.file.folder(true) + "/Aspects");
// await this.app.vault.createFolder(tp.file.folder(true) + "/Aspects/Teeth");
// await this.app.vault.createFolder(tp.file.folder(true) + "/Aspects/Tides");
// await this.app.vault.createFolder(tp.file.folder(true) + "/Aspects/Veils");

//await this.app.vault.createFolder(tp.file.folder(true) + "/Aspects/Mutation");
//await this.app.vault.createFolder(tp.file.folder(true) + "/Inventory");
//await this.app.vault.createFolder(tp.file.folder(true) + "/Inventory/Gear");
//await this.app.vault.createFolder(tp.file.folder(true) + "/Inventory/Items");
//await this.app.vault.createFolder(tp.file.folder(true) + "/Inventory/Resources");
//await this.app.vault.createFolder(tp.file.folder(true) + "/Inventory/Resources/Salvage");
//await this.app.vault.createFolder(tp.file.folder(true) + "/Inventory/Resources/Specimen");
//await this.app.vault.createFolder(tp.file.folder(true) + "/Inventory/Resources/Whispers");
//await this.app.vault.createFolder(tp.file.folder(true) + "/Inventory/Trash");
//await this.app.vault.createFolder(tp.file.folder(true) + "/Journal");
//await this.app.vault.createFolder(tp.file.folder(true) + "/Tracks");

let newCharacterPath = await tp.file.path(true);
let newCharacterName = await tp.file.title;
let newCharacterFolder = await tp.file.folder(true);
let characterTemplateNote =  await dv.page(newCharacterPath);
console.log(newCharacterPath, newCharacterName, newCharacterFolder, characterTemplateNote, tp.file.find_tfile(newCharacterPath))
let subTemplates = await characterTemplateNote.adminTemplate;
let newTFiles = [];
let templateTFile, newTFile, strTemplateContent;
console.log("subTemplates", subTemplates)
for (let template of subTemplates) {
    if (template.path.contains("Aspect")) {
        let aspects = ["Teeth", "Tides", "Veils"];
        templateTFile = tp.file.find_tfile(template.path);
        strTemplateContent = await app.vault.read(templateTFile);

        for (let a of aspects) {
            let aspectPath = "/Aspects/" + a + "/" + a;
            newTFile = await tp.file.create_new(strTemplateContent, aspectPath, false, newCharacterFolder);
            newTFiles.push(newTFile);
        }
    } else if (template.path.contains("Inventory")) {
	    templateTFile = tp.file.find_tfile(template.path);
	    strTemplateContent = await app.vault.read(templateTFile);

        let inventoryPath = "/Inventory/Inventory";
        newTFile = await tp.file.create_new(strTemplateContent, inventoryPath, false, newCharacterFolder);
        newTFiles.push(newTFile);

    } else if (template.path.contains("Journal")) {
	    templateTFile = tp.file.find_tfile(template.path);
	    strTemplateContent = await app.vault.read(templateTFile);

        let journalPath = "/Journal/Journal";
        newTFile = await tp.file.create_new(strTemplateContent, journalPath, false, newCharacterFolder);
        newTFiles.push(newTFile);    
    } else if (template.path.contains("Track")) {
	    templateTFile = tp.file.find_tfile(template.path);
	    strTemplateContent = await app.vault.read(templateTFile);

        let tracksPath = "/Tracks/Tracks";
        newTFile = await tp.file.create_new(strTemplateContent, tracksPath, false, newCharacterFolder);
        newTFiles.push(newTFile); 
    }
}

for (let tFile of newTFiles) {
    await app.fileManager.processFrontMatter(tFile, frontmatter => {
        // Removing template frontmatter
        delete frontmatter["aliases"];
        delete frontmatter["dated"];
        delete frontmatter["folderNote"];
        delete frontmatter["folder"];
        delete frontmatter["modified"];
        frontmatter["parent"] = "[[" + newCharacterPath.split(".md")[0] + "|" +  newCharacterName + "]]";
        frontmatter["noteBook"] = "[[" + characterTemplateNote.noteBook["path"].split(".md")[0] + "| Wildsea]]"
    });
}

await console.log(newTFiles);
  
}

module.exports = wildseaTemplate;