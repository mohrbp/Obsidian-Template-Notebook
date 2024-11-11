---
noteBook: "[[Note Templates]]"
noteType: "[[Resource Template|Resource Template]]"
branchTemplate: 
leafTemplate: 
aliases:
  - Resource
folder:
  - Resources/Specimen
  - Resources/Salvage
  - Resources/Whisper
dated: true
folderNote: false
resourceType:
---
# Templater
<%*
let thisFile = tp.file.title
let thisTFile = await tp.file.find_tfile(thisFile);
let tiers = [0, 1, 2, 3, 4, 5, 6]
let tierLetters = ["F", "E", "D", "C", "B", "A", "S"]
let resourceTier = await tp.system.suggester(tierLetters, tiers)
await app.fileManager.processFrontMatter(thisTFile, frontmatter => {
    frontmatter["Tier"] = resourceTier;
});
_%>
# Questions
- What type of resource is it?
- What tier of resource is it?
# Notes

