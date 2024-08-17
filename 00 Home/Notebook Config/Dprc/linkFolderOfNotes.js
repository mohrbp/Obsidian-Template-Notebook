async function linkFolderOfNotes (tp, dv){

//var dataviewUtils = require(app.vault.adapter.basePath + "/04 Resources/Notebook/Scripts/Dataview/utils.js");
function formatPaths(data, formatType) {
  if (!Array.isArray(data) || data.length === 0) {
    return "Invalid input data.";
  }

  if (formatType !== "tasks" && formatType !== "embeds") {
    return "Invalid format type. Use `tasks` for a bulleted list and `embeds` for links under level 2 headers.";
  }

  let formattedData = "";

  if (formatType === "tasks") {
    formattedData = data.map(item => `- [ ] [${item.split('/').pop().replace(/\.[^/.]+$/, "")}](${item.replace(/\s/g, "%20")})`).join('\n');
  } else if (formatType === "embeds") {
    formattedData = data.map(item => `## ${item.split('/').pop().replace(/\.[^/.]+$/, "")}\n![${item.split('/').pop().replace(/\.[^/.]+$/, "")}](${item.replace(/\s/g, "%20")})`).join('\n');
  }

  return formattedData;
}

function subsetByFolderDepth(paths, depth, includeExtension, extension) {
  const subset = [];
  const seenPaths = new Set();

  paths.forEach(path => {
    const folders = path.split('/');
    const folderDepth = folders.length - 1;

    if (folderDepth >= depth) {
      const subsetPath = folders.slice(0, depth + 1).join('/');
      const hasExtension = subsetPath.endsWith(`.${extension}`);  
      if (
        !seenPaths.has(subsetPath) &&
        ((includeExtension && hasExtension) || (!includeExtension && !hasExtension))
      ) {
        seenPaths.add(subsetPath);
        subset.push(subsetPath);
      }
    }
  });

  return subset;
}

let links = "";
let depth = 1;
var paths = dv.pagePaths(`""`);
do {
  selection = await tp.system.suggester(["next folder", "notes", "escape"], ["1", "2", "3"]);
  
  if (selection == "1") {
  	folderPaths = await subsetByFolderDepth(paths, depth, false, 'md');
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
let linkType = await tp.system.suggester(["embeds", "tasks"],["embeds", "tasks"]);
return formatPaths(notePaths, linkType);
}
module.exports = linkFolderOfNotes;