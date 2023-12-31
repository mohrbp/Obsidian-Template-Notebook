const { DateTime, Duration } = dv.luxon;

let target = input.target;
let query = dv.current()[target];
// Assign variables for recency 
let recentLow = 3;

let modifiedNotes = dv.pages()
	.where(p => String(p[target]).indexOf(query) != -1)
	.where(p => p.note_type == "page" | p.note_type == "card")
	.where(p => DateTime.fromISO(p.file.mtime).diffNow().as("minutes") > -(recentLow * 1440));


// Format file based on file frontmatter and other info
for (let n of modifiedNotes) {
	if (n.file.mtime) {
	n.modifiedTime = Math.abs(Math.round(n.file.mtime.diffNow().as("hours")))
	n.modified = n.modifiedTime + " hours ago"
	};
};

let sortedNotes = modifiedNotes
	.sort(p => DateTime.fromISO(p.file.mtime).diffNow(), "desc");
dv.header(3, "Recently Modified Notes");
dv.el("b", "Notes modified within " + recentLow + " days, where " + target + " = " + query);
dv.table(["Created","Last Modified", "Note","Project Notebook"],
    sortedNotes
    .map(p => [
		new DateTime(p.created).toFormat("ccc DD"),
		p.modified,
		p.file.link,
        p.project,
    ])
    .limit(25)
);