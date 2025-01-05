const { DateTime, Duration } = dv.luxon;
const { noteFilter } = await cJS();
const { dvHelperFuncs } = await cJS();

let target = input.target;
let targetNote = noteFilter.createNoteObject(dv, target.path);
let nestedInput = {
    parent: [targetNote]
};

let allChildNotes = noteFilter.getAllChildNotes(dv, nestedInput);

let taskFilter = dvHelperFuncs.createTaskFilter(targetNote, allChildNotes, include = true)

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
        p.file.folder,
		dvHelperFuncs.convertLinksToCommaSeparatedList(p.parent),
    	])
    //	.limit(25)
    	)
