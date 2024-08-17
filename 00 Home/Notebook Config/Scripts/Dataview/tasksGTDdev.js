// Function to check if the device is a mobile device
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Function to load tasks for pages and cards
function loadTasks(target, query) {

//    let queryLinks = Array.isArray(query) ? query : [query];
 //   console.log(queryLinks)
    return dv.pages()
  //      .where(p => typeof(p[target] != "undefined"))
        .where(p => p.note_type === "page" || p.note_type === "card")
        .where(p => String(p[target]).indexOf(query) !== -1)
    //    .where(p => Array.isArray(p[target]) &&
     //               (p[target]).some(pp => queryLinks.includes(pp)))
        .file
        .tasks
        // Tasks only in the Tasks Header
        .where(t => t.link.subpath == "Tasks")
        // Only Parent Tasks, No Subtasks
        // Subtasks can still be accessed through parent
        .where(t => !t.hasOwnProperty("parent"));

}
// Function to add file frontmatter to task object
function addFrontmatterToTask(task) {
    if (dv.page(task.path) && dv.page(task.path).file) {
        const page = dv.page(task.path).file;
        const frontmatter = page.frontmatter;
        task.created = frontmatter.created || task.created;
        task.modified = page.mtime || task.modified;
        task.projectCategory = frontmatter.projectCategory || task.projectCategory;
        task.project = frontmatter.project || task.project;
        task.note_type = frontmatter.note_type || task.note_type;
        task.note_link = page.link || task.note_link;
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
    console.log("Task Counts:", taskCounts);
}

// Function to display Scheduled tasks in a table
function displayScheduledTasksInTable(title, tasks, limit) {
    // Map table variables
    dv.header(3, title);
    dv.table(
        ["Task", "Scheduled", "Project Category", "Project", "Note", "Created"], 
        tasks
        .sort(t => DateTime.fromISO(t.scheduledDate), "asc")
        // Logic to filter, sort, and map tasks
        .map(t => [
        t.visual,
        t.scheduledDate.toFormat("DD"),     
        convertLinksToCommaSeparatedList(t.projectCategory),
        convertLinksToCommaSeparatedList(t.project),
        t.note_link,
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
        convertLinksToCommaSeparatedList(t.projectCategory),
        convertLinksToCommaSeparatedList(t.project),
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
        convertLinksToCommaSeparatedList(t.projectCategory),
        convertLinksToCommaSeparatedList(t.project),
        t.note_link,
        DateTime.fromISO(t.created).toFormat("DD"),
        t.completedDate,
        ])
        .limit(limit)
    );
}

// Function to Format Links for Tasks Table
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

// Main code

if (isMobileDevice()) {
    console.log("This is a mobile device");
} else {
    console.log("This is not a mobile device");
}

const { DateTime } = dv.luxon;
const {noteFilter} = await cJS();

// const dv = this.app.plugins.plugins["dataview"].api
let target = input.target;
let query = dv.current()[target[0]["display"]];
let exclude = input.exclude;
let limit = 30

// console.log("target", target, query)
// console.log(customJS)
let myTasks = noteFilter.loadTasksDev({dv, target, query})
// console.log("myTasks", myTasks)

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

displayScheduledTasksInTable("Up Next", 
                            futureTasks, 
                            limit);

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


