const { DateTime, Duration } = dv.luxon;

let target = input.target;
let query = dv.current()[target];
// Assign variables for recency 
let recentLow = 3;
let createdNotes = dv.pages()
	.where(p => String(p[target]).indexOf(query) != -1)
	.where(p => p.note_type == "page" | p.note_type == "card")
	.where(p => DateTime.fromISO(p.created).diffNow().as("minutes") > - (recentLow * 1440))


// Format file based on file frontmatter and other info
for (let n of createdNotes) {
	if (n.created) {
	n.createdTime = Math.abs(Math.round(n.created.diffNow().as("minutes")))
	n.createdAgo = n.createdTime + " hours ago"
	};
};

let sortedNotes = createdNotes
	.sort(p => new DateTime(p.created).diffNow(), "desc")
dv.header(3, "Recently Created Notes");
dv.el("b", "Notes created within " + recentLow + " days, where " + target + " = " + query);
dv.table(["Created", "Time", "Note", "Project Notebook"],
    sortedNotes
    .map(p => [
		new DateTime(p.created).toFormat("ccc DD"),
		new DateTime(p.created).toFormat("t"),
		p.file.link,
        p.project
        ])
);