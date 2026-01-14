async function forwardTasktoTarget(tp, selection, targetBasename) {
  try {
    const targetNote = await tp.file.find_tfile(targetBasename);
    if (!targetNote) {
      new Notice(`Target file "${targetBasename}" not found`);
      return selection;
    }
    
    let targetNoteContent = await app.vault.read(targetNote);
    const forwarded = "- [>] " + "[[" + targetNote.basename + "]] ";
    
    const replace = selection.split("\n").map(select => {
      if (select.includes("- [ ] ")) {
        return select.replace("- [ ] ", forwarded);
      }
      return select;
    }).join("\n");
    
    const headerTask = "# Tasks\n" + selection;
    
    // Check if "# Tasks" exists, if not append to end
    let targetNoteReplaced;
    if (targetNoteContent.includes("# Tasks")) {
      targetNoteReplaced = targetNoteContent.replace("# Tasks", headerTask);
    } else {
      targetNoteReplaced = targetNoteContent + "\n\n" + headerTask;
    }
    
    await app.vault.modify(targetNote, targetNoteReplaced);
    return replace;
  } catch (error) {
    new Notice(`Error forwarding task: ${error.message}`);
    console.error(error);
    return selection;
  }
}

module.exports = forwardTasktoTarget;