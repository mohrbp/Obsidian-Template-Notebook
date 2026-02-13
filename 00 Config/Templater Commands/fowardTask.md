<%*
// Get current task path
const taskPath = tp.file.path(true);

// Prompt for new parent
const newParentPath = await tp.system.prompt("Enter path to new parent note:");

if (!newParentPath) {
    throw new Error("No parent path provided");
}

// Call the forwarding function
const result = await tp.user.forwardTask(tp, dv, taskPath, newParentPath);

if (result.moved) {
    // File was moved, open the new location
    await tp.file.move(result.newPath);
}
%>