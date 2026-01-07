async function forwardContenttoTarget(tp, selection, targetBasename, newHeading = false) {
  try {
    const targetNote = await tp.file.find_tfile(targetBasename);
    if (!targetNote) {
      new Notice(`Target file "${targetBasename}" not found`);
      return "";
    }
    
    let targetNoteContent = await app.vault.read(targetNote);
    
    let headerFwd = "# Notes\n" + selection;
    if (newHeading) {
      headerFwd = "# Notes\n## " + newHeading + "\n" + selection;
    }
    
    // Check if "# Content" exists, if not append to end
    let targetNoteReplaced;
    if (targetNoteContent.includes("# Notes")) {
      targetNoteReplaced = targetNoteContent.replace("# Notes", headerFwd);
    } else {
      targetNoteReplaced = targetNoteContent + "\n\n" + headerFwd;
    }
    
    await app.vault.modify(targetNote, targetNoteReplaced);
    
    let fileHeading = "[[" + targetNote.path + "|" + targetNote.basename + "]]";
    if (newHeading) {
      fileHeading = "[[" + targetNote.path + "#" + newHeading + "|" + targetNote.basename + "]]";
    }
    
    return fileHeading;
  } catch (error) {
    new Notice(`Error forwarding content: ${error.message}`);
    console.error(error);
    return "";
  }
}

module.exports = forwardContenttoTarget;