<%*
// Config
const user = "BMohr";
// Initialize dataview plugin variable
const dv = this.app.plugins.plugins["dataview"].api;
const target_Folder = "02 Projects";

// Find and Select Templates
let selected_templates = dv.pages()
	.where(p => p.note_type == "projectCategory template")
	.file.sort(n => n.name);
let suggestions3 = selected_templates.name;
let values3 = selected_templates.path;
let selected_Template = await tp.system.suggester(suggestions3,values3);	

// Write File Name and add Folder Path
let fileName = await tp.system.prompt("Enter Project Category");
let filePath = await target_Folder + "/" + fileName + "/" + fileName;

// Build new file
let newFile = await tp.user.buildPageAndLink(tp, selected_Template, filePath, "/", false); 

// Apply Frontmatter to new file
let new_Tfile = await tp.file.find_tfile(newFile);
await app.fileManager.processFrontMatter(
      new_Tfile,
      frontmatter => {
		// Remove Excess Template Frontmatter
		delete frontmatter['template_type'];
		// Update Template Frontmatter
		frontmatter["note_type"] = "projectCategory";
		frontmatter["projectCategory"] = String("[[" + new_Tfile.path + "|" + new_Tfile.basename + "]]");
        // Apply Default frontmatter
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");
        frontmatter["created_by"] = user; 
      })

_%>
