// ============================================================================
// GTD Task Management Dashboard
// Handles both Tasks (note files) and Actions (checkboxes)
// ============================================================================

const { DateTime } = dv.luxon;
const {dvHelperFuncs} = await cJS();
const {notebookManager} = await cJS();

// Get target from input parameter
let target = input.target;
let limit = 30;

// ============================================================================
// LOAD TASKS (Note Files)
// ============================================================================

let myTaskFiles = await dvHelperFuncs.loadTasks(dv, notebookManager, target);
console.log("myTaskFiles", myTaskFiles);

// Process Tasks for GTD
dvHelperFuncs.arrangeTasksForGTD(dv, myTaskFiles, dv.date("today"));

// ============================================================================
// LOAD ACTIONS (Checkboxes)
// ============================================================================

let myActions = await dvHelperFuncs.loadActions(dv, notebookManager, target);
// console.log("myActions", myActions);

// Add frontmatter to actions
for (let action of myActions) {
    dvHelperFuncs.addFrontmatterToAction(dv, action);
}

// Process Actions for GTD
dvHelperFuncs.arrangeActionsForGTD(dv, myActions, dv.date("today"));

// ============================================================================
// DISPLAY SCHEDULED SECTION
// ============================================================================

// Filter scheduled Tasks and Actions
let scheduledTasks = myTaskFiles
    .filter(t => !t.completed)
    .filter(t => typeof(t.scheduledDate) !== "undefined");

let scheduledActions = myActions
    .where(a => a.checked === false)
    .where(a => typeof(a.scheduledDate) !== "undefined");

// Display Overdue Tasks
let overdueTaskFiles = scheduledTasks.filter(t => t.timeUntilScheduled < 0);
if (overdueTaskFiles.length > 0) {
    dvHelperFuncs.displayScheduledTasksTable(dv,
        "⚠️ Overdue Tasks ⚠️", 
        overdueTaskFiles, 
        limit);
}

// Display Overdue Actions
let overdueActions = scheduledActions.where(a => a.timeUntilScheduled < 0);
if (overdueActions.length > 0) {
    dvHelperFuncs.displayScheduledActionsTable(dv,
        "⚠️ Overdue Actions ⚠️", 
        overdueActions, 
        limit);
}

// Display Future Scheduled Tasks
let futureTaskFiles = scheduledTasks
    .filter(t => t.hasOwnProperty("timing"))
    .filter(t => t.timing !== "overdue");

if (futureTaskFiles.length > 0) {
    dvHelperFuncs.displayScheduledTasksTable(dv, 
        "Up Next - Tasks", 
        futureTaskFiles, 
        limit);
}

// Display Future Scheduled Actions
let futureActions = scheduledActions
    .filter(a => a.hasOwnProperty("timing"))
    .filter(a => a.timing !== "overdue");

if (futureActions.length > 0) {
    dvHelperFuncs.displayScheduledActionsTable(dv, 
        "Up Next - Actions", 
        futureActions, 
        limit);
}

// ============================================================================
// DISPLAY UNSCHEDULED SECTION
// ============================================================================

// Filter unscheduled Tasks and Actions
let unscheduledTasks = myTaskFiles
    .filter(t => !t.completed)
    .filter(t => typeof(t.scheduledDate) === "undefined");

let unscheduledActions = myActions
    .where(a => a.checked === false)
    .where(a => typeof(a.scheduledDate) === "undefined");

// Display unscheduled Tasks
if (unscheduledTasks.length > 0) {
    dvHelperFuncs.displayUnscheduledTasksTable(dv, 
        "Unscheduled Tasks", 
        unscheduledTasks, 
        limit);
}

// Display unscheduled Actions
if (unscheduledActions.length > 0) {
    dvHelperFuncs.displayUnscheduledActionsTable(dv, 
        "Unscheduled Actions", 
        unscheduledActions, 
        limit);
}

// ============================================================================
// DISPLAY COMPLETED SECTION
// ============================================================================

// Filter completed Tasks and Actions
let completedTasks = myTaskFiles
    .filter(t => t.completed)
    .filter(t => typeof(t.completedDate) !== "undefined");

let completedActions = myActions
    .where(a => a.checked === true)
    .where(a => typeof(a.completedDate) !== "undefined");

// Display completed Tasks
if (completedTasks.length > 0) {
    dvHelperFuncs.displayCompletedTasksTable(dv,
        "Recently Completed Tasks (Limit " + limit + ")",
        completedTasks,
        limit);
}

// Display completed Actions
if (completedActions.length > 0) {
    dvHelperFuncs.displayCompletedActionsTable(dv,
        "Recently Completed Actions (Limit " + limit + ")",
        completedActions,
        limit);
}

// ============================================================================
// MAKE DATAVIEWJS SCROLLABLE
// ============================================================================

// Put all dataviewjs in a scroll view
let elements = document.getElementsByClassName('block-language-dataviewjs');
for (let i = 0; i < elements.length; i++) {
    let item = elements.item(i);
    item.setAttribute("style", "max-height:400px;overflow:auto;");
}