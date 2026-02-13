<%* 
// Get action details
const actionText = await tp.system.prompt("Enter action text to convert:");
const actionPath = tp.file.path(true);

// Optional: Get scheduled date if not in text
let scheduledDate = "";
const scheduleMatch = actionText.match(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/);
if (scheduleMatch) {
    scheduledDate = scheduleMatch[2];
}

// Call the conversion function
const convertActionToTask = await tp.user.convertActionToTask(tp, dv, actionText, actionPath, scheduledDate);
%>