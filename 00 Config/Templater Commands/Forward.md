<%_* 
  const selection = await tp.file.selection();
  if (selection) {
    // Prompt for new or existing file
    const target = await tp.system.suggester(
      ["New File", "Existing"], 
      ["New File", "Existing"],
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
      const newHeading = "Forwarded from " + thisFile; 
      let linkedHeading = await tp.user.forwardContenttoTarget(
        tp, 
        selection, 
        newFile.basename, 
        newHeading
      );
      
      // Determine how to handle the original content
      const contentType = await tp.system.suggester(
        ["Copy", "Cut", "Link", "Embed Here", "Embed in Content"], 
        ["Copy", "Cut", "Link", "Embed Here", "Embed in Content"], 
        false,
        "How to handle original content?"
      );
      
      if (contentType == "Copy") {
        tR += selection;
      } else if (contentType == "Cut") {
        tR += "";
      } else if (contentType == "Link") {
        tR += linkedHeading;
      } else if (contentType == "Embed Here") {
        tR += "!" + linkedHeading;
      } else if (contentType == "Embed in Content") {
        await tp.user.embedLinkToContent(
          tp, 
          thisFile, 
          newFile.basename, 
          newHeading, 
          true
        );
      }
    }
  } else {
    new Notice("Text not selected");
  }
_%>