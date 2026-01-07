
// Main code
const { DateTime } = dv.luxon;
const {noteFilter} = await cJS();
const {dvHelperFuncs} = await cJS();
const {notebookManager} = await cJS();


// if (dvHelperFuncs.isMobileDevice()) {
//     console.log("This is a mobile device");
// } else {
//     console.log("This is not a mobile device");
// }
// // const dv = this.app.plugins.plugins["dataview"].api


let target = input.target;
let limit = 30

// console.log(customJS)
// let myTasks_old = dvHelperFuncs.loadTasks(dv, noteFilter, target)
// console.log("myTasks_old", myTasks_old)

// console.log("Start New Tasks")
let myTasks = await dvHelperFuncs.loadTasks_new(dv, notebookManager, target)
// console.log("myTasks_DV", myTasks)

for (let task of myTasks) {
    dvHelperFuncs.addFrontmatterToTask(dv, task);
}

let allTasks = myTasks

dvHelperFuncs.arrangeTasksForGTD(dv, allTasks, dv.date("today"));

let scheduledTasks = allTasks
                        .where(t => t.checked === false)
                        .where(t => typeof(t.scheduledDate) !== "undefined");


let overdueTasks = scheduledTasks
                        .where(t => t.timeUntilScheduled < 0);
                       
if(overdueTasks.length > 0 ){
    dvHelperFuncs.displayScheduledTasksInTable(dv,
                                "⚠️Overdue⚠️", 
                                overdueTasks, 
                                limit);
};


let futureTasks = scheduledTasks
                    .filter(t => t.hasOwnProperty("timing"))
                    .filter(t => t.timing !== "overdue");

if (futureTasks.length > 0){
    dvHelperFuncs.displayScheduledTasksInTable(dv, 
                                "Up Next", 
                                futureTasks, 
                                limit);
}

let unscheduledTasks = allTasks
                        .where(t => t.checked === false)
                        .where(t => typeof(t.scheduledDate) === "undefined");

dvHelperFuncs.displayUnscheduledTasksInTable(dv, 
                            "Unscheduled", 
                            unscheduledTasks, 
                            limit);

// dvHelperFuncs.displayTasksWithUriTable(dv,
//                             "Unscheduled", 
//                             unscheduledTasks, 
//                             limit)

let myRecentCompleteTasks = allTasks
                        .where(t => t.checked === true)
                        .where(t => typeof(t.completedDate) !== "undefined");

//dv.taskList(myRecentCompleteTasks);

dvHelperFuncs.displayCompletedTasksInTable(dv,
                            "Recently Completed (Limit " + limit + ")",
                            myRecentCompleteTasks,
                            limit);

// Updating dataviewJS element to be scrollable everywhere

// Put all dataviewjs in a scroll view.
let elements = document.getElementsByClassName('block-language-dataviewjs');
for (let i = 0; i < elements.length; i++) {
  let item = elements.item(i);
  item.setAttribute("style", "max-height:400px;overflow:auto;");
}


