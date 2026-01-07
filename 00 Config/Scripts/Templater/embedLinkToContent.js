async function embedLinkToContent (tp, Target, Source, NewHeading = false, linkToHeading = false){

  let targetNote = await tp.file.find_tfile(Target);
  let targetNoteContent = await app.vault.read(targetNote);

  let sourceNote = await tp.file.find_tfile(Source);

  let headerContent = "# Notes";
  if (NewHeading) headerContent = "# Notes\n## " + sourceNote.basename;
  let linkContent = "\n ![[" + sourceNote.basename + "]]";
  if (linkToHeading) linkContent = "\n ![[" + sourceNote.path + "#" + NewHeading +"|" + sourceNote.basename + "]]";
  let headerReplacementContent = headerContent + linkContent;
  let targetNoteReplaced = targetNoteContent.replace("# Notes", headerReplacementContent);
  await app.vault.modify(targetNote, targetNoteReplaced);
}
  
module.exports = embedLinkToContent;