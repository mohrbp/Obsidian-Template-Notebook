const { DateTime, Duration } = dv.luxon;

// Select the related notes to targets
let target = input.target;
let query = dv.current()[target];

// Assign variables for recency 
let recent = input.recent
let recentLow = recent;

// Load Utilities
//var dataviewUtils = require(app.vault.adapter.basePath + "/04 Resources/Notebook/Scripts/Dataview/utils.js");
function convertLinksToCommaSeparatedList(text) {
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

// Select the type of change to aggregate
let change = input.change;
if (change === 'modifiedNotes') {
    // Filter notes by the file.mtime
	title = "Modified"
    } else if (change === 'createdNotes') {
  	// Filter notes by the created date
	title = "Created"
}

// Filter down to the selected ntoes
let notes = dv.pages()
	.where(p => String(p[target]).indexOf(query) != -1)
	.where(p => p.note_type == "page" | p.note_type == "card")
	.filter(p => {
	if (change === 'modifiedNotes') {
    // Filter notes by the file.mtime
  	return (DateTime.fromISO(p.file.mtime).diffNow().as("minutes") > -(recentLow * 1440));
    } else if (change === 'createdNotes') {
  	// Filter notes by the created date
  	return (DateTime.fromISO(p.created).diffNow().as("minutes") > -(recentLow * 1440));
	} 
  	});

// Add new keys for the hours elapsed since the change, Assign lastChange to a key for the DateTime property of interest
for (let n of notes) {
	if (change === 'modifiedNotes') {
	n.modifiedTime = Math.abs(Math.round(n.file.mtime.diffNow().as("hours")))
	n.modifiedNotes = n.modifiedTime + " hours ago"
	n.lastChange = n.file.mtime;
	} else if (change === 'createdNotes') {
	n.createdTime = Math.abs(Math.round(n.created.diffNow().as("minutes")))
	n.createdNotes = n.createdTime + " hours ago"
	n.lastChange = n.created;
	};
};

let sortedNotes = notes
	.sort(p => DateTime.fromISO(p.lastChange).diffNow(), "desc");

dv.header(3, "Recently " + title +" Notes");
dv.el("b", "Notes modified within " + recentLow + " days, where " + target + " = " + query);
dv.table(["Created Date", title, "Note","Project Notebook"],
	sortedNotes
    .map(p => [
		DateTime.fromISO(p.created).toFormat("ccc DD"),
		p[change],
		p.file.link,
		convertLinksToCommaSeparatedList(p.project),
    	])
    	.limit(25)
    	)

