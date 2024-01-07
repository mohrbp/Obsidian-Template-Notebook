<%*
  let newFile = await tp.file.find_tfile(tp.file.path(true))
setTimeout(() => {
  // Process the frontmatter
  app.fileManager.processFrontMatter(newFile, (frontmatter) => {
    // Add a new field
		// Update Template Frontmatter
		frontmatter["note_type"] = "lit";
		// Update project Frontmatter
        // Apply Default frontmatter
		frontmatter["people"] = null;
        frontmatter["topics"] = null;
        frontmatter["created"] = tp.date.now("YYYY-MM-DDTHH:mm:ssZ");
  })
  // needs to be at least 2500 or else it erases the existing template info
  }, 3500) _%>
{% include "[[Paper Metadata Callout]]"%}
{% include "[[Orange Summary]]"%}
{% include "[[5 Color Concepts]]"%}
{% include "[[Yellow Highlights]]"%}
