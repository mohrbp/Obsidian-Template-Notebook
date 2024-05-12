// Import Luxon variables from dv
const { DateTime } = dv.luxon;
let target = input.target;
let query = dv.current()[target];


// Function to sanitize section names for the Gantt chart
function escapeGanttSectionName(name) {
  return name.replace(/[^\w\s]/g, '-').trim().replace(/\s+/g, '_');
}

// Output Gantt header
let ganttOutput = "```mermaid\n";
ganttOutput += "gantt\n";
ganttOutput += "dateFormat  YYYY-MM-DD\n";
ganttOutput += "axisFormat  %Y-%m-%d\n";

// Load Utilities
// Ensure you implement or have this utility function in your script
var dataviewUtils = require(app.vault.adapter.basePath + "/04 Resources/Notebook/Scripts/Dataview/utils.js");

// Fetch tasks from pages with proper attributes
const tasks = dv.pages()
      .where(p => String(p[target]).indexOf(query) != -1)
      .where(p => p.note_type == "page" | p.note_type == "card")
          .file
          .tasks
            .where(t => t.checked === false);

// Process each task into a Gantt chart section
tasks.forEach(task => {
  // Check if the task has a scheduled date
  if (task.scheduled) {
    // Sanitize section name to conform to Mermaid syntax
    const sectionName = escapeGanttSectionName(task.project || "No Project");
    const detailText = escapeGanttSectionName(task.text) || "No description";
    console.log(task)
    // Use the scheduled date as the start date
    // Assume task duration is one day, so the end date is the same as the start date
    const startDate = DateTime.fromISO(task.scheduled).toISODate();
    const endDate = DateTime.fromISO(task.scheduled).plus({ days: 1 }).toISODate();

    // Append to ganttOutput
    ganttOutput += `    section ${sectionName}\n`;
    ganttOutput += `    ${detailText} :done, ${startDate}, 1d\n`;
  }
});

// Close the MermaidJS code block
ganttOutput += "```";

// Render the MermaidJS Gantt chart
dv.paragraph(ganttOutput);