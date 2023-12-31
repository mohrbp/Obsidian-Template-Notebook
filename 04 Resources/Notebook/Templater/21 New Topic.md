<%*
// Config
const user = "BMohr";
// Initialize dataview plugin variable
const dv = this.app.plugins.plugins["dataview"].api;

let target_Folder;
let selected_Topic;

let choice = await tp.system.suggester(["New Topic Category", "Existing Topic"], ["New Topic Category", "Existing Topic"])

if (choice == "New Topic Category") {
target_Folder = "03 Areas";
} else if (choice == "Existing Topic") {
/// Choose from all topics 
/// Does not only include projects from that folder
/// Match is fuzzy
let selected_topics = dv.pages()
	.where(p => p.note_type == "Topic")
	.file.sort(n => n.name);
suggestions2 = selected_topics.name;
values2 = selected_topics;
selected_Topic = await tp.system.suggester(suggestions2,values2);
/// Trimming the filepath from the Folder Note and finding the notebook for this project
let selected_FilePath = selected_Topic.folder;
target_Folder = selected_FilePath;
}



// Find and Select Templates
let selected_templates = dv.pages()
	.where(p => p.note_type == "topic template")
	.where(p => p.template_type == "All")
	.file.sort(n => n.name);
let suggestions3 = selected_templates.name;
let values3 = selected_templates.path;
let selected_Template = await tp.system.suggester(suggestions3,values3);	

// Write File Name and add Folder Path
let fileName = await tp.system.prompt("Enter Topic Name");
let filePath = await target_Folder + "/" + fileName + "/" + fileName;

// Build new file
let newFile = await tp.user.buildPageAndLink(tp, selected_Template, filePath, "/", false); 

// Link to Target Topic
if (target_Folder != "03 Areas") {await tp.user.embedPageToTarget(tp, selected_Topic.name, newFile, "# Notebook", "# Notebook", linkToHeading = true)};


// Apply Frontmatter to new file
let new_Tfile = await tp.file.find_tfile(newFile);
await app.fileManager.processFrontMatter(
      new_Tfile,
      frontmatter => {
		// Remove Excess Template Frontmatter
		delete frontmatter['template_type'];
		// Update Template Frontmatter
		frontmatter["note_type"] = String("Topic");
		// Update Topic Frontmatter
		frontmatter["topics"] = String("[[" + new_Tfile.path + "|" + new_Tfile.basename + "]]");
		/// If the selected project isn't a projectCategory, add the parent project, otherwise add the projectCategory
		(target_Folder != "03 Areas") ? frontmatter["parent_topic"] = String(selected_Topic.link) : frontmatter["parent_topic"] = null;

        // Apply Default frontmatter
		frontmatter["people"] = null;
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");
        frontmatter["created_by"] = user; 
        // Apply projectCategory/Template Specific frontmatter
      })
_%>