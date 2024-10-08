// Function to check if the device is a mobile device
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Function to add file frontmatter to task object
function addFrontmatterToTask(task) {
    if (dv.page(task.path) && dv.page(task.path).file) {
        const page = dv.page(task.path).file;
        const frontmatter = page.frontmatter;
        task.created = frontmatter.created || task.created;
        task.modified = page.mtime || task.modified
        task.noteBook = frontmatter.noteBook || task.noteBook;
        task.parent = frontmatter.parent || task.parent;
        task.noteType = frontmatter.noteType || task.noteType;
        task.noteLink = page.link || task.noteLink;
    }
}

// Function to arrange and format tasks for GTD
function arrangeTasksForGTD(tasks, currentTime) {

    let recentLow = 1;
    let recentMid = 3;
    let recentHigh = 7;

    const red = "<span style='border-left: 3px solid red;'>&nbsp;</span>";
    const blue = "<span style='border-left: 3px solid rgb(39, 117, 182);'>&nbsp;</span>";
    const green = "<span style='border-left: 3px solid green;'>&nbsp;</span>";

    const taskCounts = {};
    for (let task of tasks) {
        task.visual = task.text;

        if (task.checked === true && task.text.match(/([✅]) ?(\d{4}-\d{2}-\d{2})/) != null) {
            dateMatch = task.text.match(/([✅]) ?(\d{4}-\d{2}-\d{2})/)[2];
            task.completedDate = DateTime.fromISO(dateMatch);
            task.visual = task.visual.replace(/([✅]) ?(\d{4}-\d{2}-\d{2})/, "")
        }

        if (task.text.match(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/) != null) {
        // Adding Task Scheduled Date
            dateMatch = task.text.match(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/)[2];
            task.scheduledDate = DateTime.fromISO(dateMatch);
            task.timeUntilScheduled = Math.round(task.scheduledDate.diff(currentTime, "days").as("minutes"));
            if (task.timeUntilScheduled < (0)) {
                task.color = red;
                task.timing = "overdue";
            } else if ((task.timeUntilScheduled < (1400 * recentLow)) && (task.timeUntilScheduled >= (0))) {
                task.color = green;
                task.timing = "due";
            } else if ((task.timeUntilScheduled < (1400 * recentMid)) && (task.timeUntilScheduled >= (1400 * recentLow))) {
                task.color = blue;
                task.timing = "upcoming";
            } else if (task.timeUntilScheduled >= 0 && task.timeUntilScheduled < (1440 * recentHigh)) {
                task.timing = "future";
                task.color = "";
            }
            if (task.checked === false) {
                task.visual = task.color + task.visual.replace(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/, "")
                } else {
                task.visual = task.visual.replace(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/, "")
            };
            // Count tasks by timing, project, and projectCategory
   //         const key = `${task.timing}_${task.project}_${task.projectCategory}`;
            const key = `${task.timing}_${task.projectCategory}`;
            taskCounts[key] = (taskCounts[key] || 0) + 1;
  //      console.log("Scheduled - ", task.scheduled,
  //                  "\n scheduledDate - ", task.scheduledDate,
  //                  "\n timeUntilScheduled = ", task.timeUntilScheduled);
        }
}
    // console.log("Task Counts:", taskCounts);
}

// Function to display Scheduled tasks in a table
function displayScheduledTasksInTable(title, tasks, limit) {
    // Map table variables
    dv.header(3, title);
    dv.table(
        ["Task", "Scheduled", "Parent", "noteType", "noteBook", "Note", "Created"], 
        tasks
        .sort(t => DateTime.fromISO(t.scheduledDate), "asc")
        // Logic to filter, sort, and map tasks
        .map(t => [
        t.visual,
        t.scheduledDate.toFormat("DD"),
        noteFilter.convertLinksToCommaSeparatedList(t.parent),
        t.noteType,
        t.noteBook,     
        t.noteLink,
        DateTime.fromISO(t.created).toFormat("DD"),
        ])
        .limit(limit)
    );
}

// Function to display Unscheduled tasks in a table
function displayUnscheduledTasksInTable(title, tasks, limit) {
    // Map table variables
    dv.header(3, title);
    dv.table(
        ["Task", "Project Category", "Project", "Note", "Created"], 
        tasks
        .sort(t => DateTime.fromISO(t.created), "desc")
        // Logic to filter, sort, and map tasks
        .map(t => [
        t.visual,
        noteFilter.convertLinksToCommaSeparatedList(t.projectCategory),
        noteFilter.convertLinksToCommaSeparatedList(t.project),
        t.note_link,
        DateTime.fromISO(t.created).toFormat("DD"),
        ])
        .limit(limit)
    );
}

// Function to display Completed tasks in a table
function displayCompletedTasksInTable(title, tasks, limit) {
    // Map table variables 
    dv.header(3, title);
    dv.table(
        ["Task", "Project Category", "Project", "Note", "Created", "Completed"],
        tasks
        .sort(t => DateTime.fromISO(t.completedDate), "desc")
        // Logic to filter, sort, and map tasks
        .map(t => [
        t.visual,
        noteFilter.convertLinksToCommaSeparatedList(t.projectCategory),
        noteFilter.convertLinksToCommaSeparatedList(t.project),
        t.note_link,
        DateTime.fromISO(t.created).toFormat("DD"),
        t.completedDate,
        ])
        .limit(limit)
    );
}


// Main code

if (isMobileDevice()) {
    console.log("This is a mobile device");
} else {
    console.log("This is not a mobile device");
}
// const dv = this.app.plugins.plugins["dataview"].api

const { DateTime } = dv.luxon;
const {noteFilter} = await cJS();

let target = input.target;
let limit = 30

// console.log(customJS)
let myTasks = noteFilter.loadTasks(dv, target)
console.log("myTasks", myTasks)

for (let task of myTasks) {
    addFrontmatterToTask(task);
}

let allTasks = myTasks

arrangeTasksForGTD(allTasks, dv.date("today"));

let scheduledTasks = allTasks
                        .where(t => t.checked === false)
                        .where(t => typeof(t.scheduledDate) !== "undefined");


let overdueTasks = scheduledTasks
                        .where(t => t.timeUntilScheduled < 0);
                       
if(overdueTasks.length > 0 ){
    displayScheduledTasksInTable("⚠️Overdue⚠️", 
                                overdueTasks, 
                                limit);
};


let futureTasks = scheduledTasks
                    .filter(t => t.hasOwnProperty("timing"))
                    .filter(t => t.timing !== "overdue");

if (futureTasks.length > 0){
    displayScheduledTasksInTable("Up Next", 
                                futureTasks, 
                                limit);
}

let unscheduledTasks = allTasks
                        .where(t => t.checked === false)
                        .where(t => typeof(t.scheduledDate) === "undefined");

displayUnscheduledTasksInTable("Unscheduled", 
                            unscheduledTasks, 
                            limit);

let myRecentCompleteTasks = allTasks
                        .where(t => t.checked === true)
                        .where(t => typeof(t.completedDate) !== "undefined");

//dv.taskList(myRecentCompleteTasks);

displayCompletedTasksInTable("Recently Completed (Limit " + limit + ")",
                              myRecentCompleteTasks,
                              limit);

// Updating dataviewJS element to be scrollable everywhere

// Put all dataviewjs in a scroll view.
let elements = document.getElementsByClassName('block-language-dataviewjs');
for (let i = 0; i < elements.length; i++) {
  let item = elements.item(i);
  item.setAttribute("style", "max-height:400px;overflow:auto;");
}


