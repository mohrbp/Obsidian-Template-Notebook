async function embedPageToTarget (tp, Target, Source, TargetHeading = null, NewHeading = null, linkToHeading = false){

  let targetNote = await tp.file.find_tfile(Target);
  let targetNoteContent = await app.vault.read(targetNote);

  let sourceNote = await tp.file.find_tfile(Source);

  (TargetHeading) ? targetHeading = TargetHeading : targetHeading = "# Notebook";
  let headerContent = targetHeading;
  if (NewHeading) headerContent = targetHeading + "\n" + NewHeading + sourceNote.basename;
  let linkContent = "\n ![[" + sourceNote.path + "|" + sourceNote.basename + "]]";
  if (linkToHeading) linkContent = "\n ![[" + sourceNote.path + linkToHeading +"|" + sourceNote.basename + "]]";
  let headerReplacementContent = headerContent + linkContent;
  let targetNoteReplaced = targetNoteContent.replace(targetHeading, headerReplacementContent);
  await app.vault.modify(targetNote, targetNoteReplaced);
}
  
module.exports = embedPageToTarget;