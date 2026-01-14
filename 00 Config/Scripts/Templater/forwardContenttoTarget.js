async function forwardContenttoTarget(tp, selection, targetBasename, sourceFileName) {
  try {
    const targetNote = await tp.file.find_tfile(targetBasename);
    if (!targetNote) {
      new Notice(`Target file "${targetBasename}" not found`);
      return { linkedHeading: "", embedLink: "" };
    }
    
    const sourceFile = tp.file.find_tfile(tp.file.path(true));
    if (!sourceFile) {
      new Notice("Source file not found");
      return { linkedHeading: "", embedLink: "" };
    }
    
    let targetNoteContent = await app.vault.read(targetNote);
    
    // Create heading with wiki-link to source
    const newHeading = `Forwarded from [[${sourceFile.basename}]]`;
    
    // For the embed/link reference, use just the display text portion
    const headingReference = `Forwarded from ${sourceFile.basename}`;
    
    // Process selection: add level to headers if it starts with ##
    const processedSelection = processHeaderLevels(selection);
    
    // Build content to insert in target
    let headerFwd = `# Notes\n## ${newHeading}\n${processedSelection}`;
    
    // Check if "# Notes" exists in target, if not append to end
    let targetNoteReplaced;
    if (targetNoteContent.includes("# Notes")) {
      targetNoteReplaced = targetNoteContent.replace("# Notes", headerFwd);
    } else {
      targetNoteReplaced = targetNoteContent + "\n\n" + headerFwd;
    }
    
    await app.vault.modify(targetNote, targetNoteReplaced);
    
    // Return both formats for different use cases
    return {
      linkedHeading: `[[${targetNote.basename}#${headingReference}|${targetNote.basename}]]`,
      embedLink: `${targetNote.basename}#${headingReference}|${targetNote.basename}`
    };
    
  } catch (error) {
    new Notice(`Error forwarding content: ${error.message}`);
    console.error(error);
    return { linkedHeading: "", embedLink: "" };
  }
}

// Helper function to process header levels
function processHeaderLevels(text) {
  const lines = text.split('\n');
  
  // Check if first line is a level 2 header
  const firstLine = lines[0].trim();
  const startsWithH2 = /^##\s/.test(firstLine);
  
  if (!startsWithH2) {
    return text;
  }
  
  // Add one level to all headers (# becomes ##, ## becomes ###, etc.)
  const processedLines = lines.map(line => {
    // Match headers (one or more # followed by space)
    if (/^#+\s/.test(line)) {
      return '#' + line;
    }
    return line;
  });
  
  return processedLines.join('\n');
}

module.exports = forwardContenttoTarget;