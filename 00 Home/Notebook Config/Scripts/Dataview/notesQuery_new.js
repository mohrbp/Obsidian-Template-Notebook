const { notebookManager } = await cJS();
const { dvHelperFuncs } = await cJS();

// Usage example
const { DateTime } = dv.luxon;

// Get target note
const targetNote = notebookManager.createNoteObject(dv, input.target.path);

// Generate table
const tableData = await notebookManager.generateNoteTable(dv, targetNote, {
    sortByCreated: true,
    limit: 25 // optional
});

// Display table using dataview
dv.table(
    tableData.headers,
    tableData.rows
);