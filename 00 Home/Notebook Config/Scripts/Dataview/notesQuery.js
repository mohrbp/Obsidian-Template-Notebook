const { DateTime, Duration } = dv.luxon;
const { noteFilter } = await cJS();
let target = input.target;
let targetNote = noteFilter.createNoteObject(dv, target.path);
let nestedInput = {
    parent: [targetNote]
};

let allChildNotes = noteFilter.getAllChildNotes(dv, nestedInput);

let taskFilter = input.include == true ? {noteType: { includePaths: targetNote.noteType.path }} : 
{noteType: { excludePaths: targetNote.noteType.path }}

for (let cat in allChildNotes) {
    taskFilter[cat] = {
        includePaths: [targetNote.path],
        excludePaths: []
    };
    for (let index in allChildNotes[cat]) {
        taskFilter[cat].includePaths.push(String(allChildNotes[cat][index].path));
    }
}

let notes = dv.pages()
    .filter(p => noteFilter.dataFilter([p], taskFilter).length > 0)

console.log(notes)
dv.table(["Name", "Created Date", "noteType", "Parent"],
	notes
	.sort(p => DateTime.fromISO(p.created).diffNow(), "desc")
    .map(p => [
		p.file.link,
		p.created,
		p.noteType,
		noteFilter.convertLinksToCommaSeparatedList(p.parent),
    	])
    //	.limit(25)
    	)
