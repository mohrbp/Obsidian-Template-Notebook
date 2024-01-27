async function linkFolderOfNotes (tp, dv){

var dataviewUtils = require(app.vault.adapter.basePath + "/04 Resources/Notebook/Scripts/Dataview/utils.js");


let links = "";
let depth = 1;
var paths = dv.pagePaths(`"02 Projects"`);
do {
  selection = await tp.system.suggester(["next folder", "notes", "escape"], ["1", "2", "3"]);
  
  if (selection == "1") {
  	folderPaths = await dataviewUtils.subsetByFolderDepth(paths, depth, false, 'md');
    folder = await tp.system.suggester(folderPaths,folderPaths);
    paths = dv.pagePaths(`"` + folder + `"`);
    depth = depth + 1;
     } else if (selection == "2") {
 	notes = dv.pages(`"` + folder + `"`).file;
 	notePaths = (notes.path);
 	break;
     } else if (selection == "3") {            
        break;
        }
  }
while (selection);
console.log(notePaths);
return dataviewUtils.formatPaths(notePaths, "embeds");
}
module.exports = linkFolderOfNotes;