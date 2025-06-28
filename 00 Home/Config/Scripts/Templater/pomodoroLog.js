async function pomodoroLog (tp, log){

let logMessage;
if (log.mode == "WORK") {
    logHeader = `${log.begin.format("YYYY-MM-DD")} ${log.begin.format("HH:mm")} - ${log.end.format("HH:mm")}`;
    logMessage = `- [T] ${log.task.name} 🍅 ${log.task.actual} ✅ ${log.end.format("YYYY-MM-DD")}`
} 

await tp.user.appendContentToTarget(tp, log.task.path, "# Work", "## " + logHeader + "\n" + logMessage);
}
  
module.exports = pomodoroLog;