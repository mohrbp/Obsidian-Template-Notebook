<%_* 
  const selection = await tp.file.selection();
  if (selection) {
    // Prompt for new or existing file
    const target = await tp.system.suggester(
      ["Existing", "New File"], 
      ["Existing", "New File"], 
      true,
      "Forward to new or existing file?"
    );
    
    // Get DataView API
    const dv = app.plugins.plugins.dataview?.api;
    if (!dv) {
      new Notice("DataView plugin is required");
      return;
    }
    
    // Get target file using appropriate method
    let newFile;
    if (target == "Existing") {
      newFile = await tp.user.selectExistingNote(tp, dv);
    } else {
      newFile = await tp.user.newNote(tp, dv);
    }
    
    if (!newFile) {
      new Notice("No file selected or created");
      return;
    }
    
    console.log(`Target file: ${newFile.basename}`);
    const thisFile = tp.file.title;
    
    // Determine forward type
    const fwdType = await tp.system.suggester(
      ["Content", "Task"], 
      ["Content", "Task"], 
      false,
      "Forward as Content or Task?"
    );
    
    if (fwdType == "Task") {
      tR += await tp.user.forwardTasktoTarget(tp, selection, newFile.basename);
    } else if (fwdType == "Content") {
      // Forward content and get link info
      const forwardResult = await tp.user.forwardContenttoTarget(
        tp, 
        selection, 
        newFile.basename,
        thisFile
      );
      
      // Determine how to handle the original content
      const contentType = await tp.system.suggester(
        ["Embed At Current Position", "Copy", "Cut", "Link"], 
        ["Embed At Current Position", "Copy", "Cut", "Link"], 
        false,
        "How to handle original content?"
      );
      
      // Handle the original content location
      if (contentType === "Copy") {
        tR += selection;
      } else if (contentType === "Cut") {
        tR += "";
      } else if (contentType === "Link") {
        tR += forwardResult.linkedHeading;
      } else if (contentType === "Embed At Current Position") {
        // Get the header level from the selection
        const headerLevel = getHeaderLevel(selection);
        const headerPrefix = '#'.repeat(headerLevel);
        
        // Create header link to target note
        const headerLink = `${headerPrefix} [[${newFile.basename}]]`;
        
        // Create embed with display name
        const embed = `![[${forwardResult.embedLink}]]`;
        
        tR += `${headerLink}\n${embed}`;
      }
    }
  } else {
    new Notice("Text not selected");
  }
  
  // Helper function to get header level from selection
  function getHeaderLevel(text) {
    const firstLine = text.trim().split('\n')[0];
    const match = firstLine.match(/^(#+)\s/);
    return match ? match[1].length : 2; // Default to ## if no header found
  }
_%>