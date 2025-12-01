const { notebookManager } = await cJS();
const { dvHelperFuncs } = await cJS();
const { DateTime } = dv.luxon;

// Get target note
const targetNote = notebookManager.createNoteObject(dv, input.target.path);

// Create initial collection structure
const sourceCollection = {
    [targetNote.noteBook.display]: [targetNote]
};

// Use findNotes to get all related notes
const relatedNotes = await notebookManager.traverseNotebook(dv, sourceCollection, {
    recursive: true,
    includeSource: true,
    formatOutput: false,
    traversalType: input.traversalType
});

// Flatten the notes from all categories
const allNotes = Object.values(relatedNotes)
    .flat()
    .map(note => note.page);

// console.log("allNotes", allNotes)
// Sort notes if requested
// if (sortByCreated) {
//     allNotes.sort((a, b) => 
//         DateTime.fromISO(b.created).diff(DateTime.fromISO(a.created))
//     );
// }

// Apply limit if specified
if(input.limit) {
    limit = input.limit
} else {
    limit = 25
}
const limitedNotes = limit ? allNotes.slice(0, limit) : allNotes;

// // Create table 
// // Pull table data from notes
// const tableData = await notebookManager.generateNoteTable(dv, targetNote, {
//     sortByCreated: true,
//     limit: 25 // optional
// });
// Build table 
// const tableData = limitedNotes.map(note => [
//     note.file.link,
//     note.created,
//     note.noteType,
//     note.parent,
//     this.convertLinksToCommaSeparatedList(note.parent)
// ]);

// return {
//     headers: ["Name", "Created Date", "noteType", "Parent"],
//     rows: tableData
// };

// // Display table using dataview
// dv.table(
//     tableData.headers,
//     tableData.rows
// );

dv.table(["Name", "Created Date", "noteType", "Parent"],
    limitedNotes
    .sort(p => DateTime.fromISO(p.created).diffNow(), "desc")
    .map(p => [
        p.file.link,
        p.created,
        p.noteType,
        p.parent
        ])
    //  .limit(25)
        )