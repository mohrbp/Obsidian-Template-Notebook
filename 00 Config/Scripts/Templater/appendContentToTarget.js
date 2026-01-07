async function appendContentToTarget (tp, Target, TargetHeading = null, Content = null){

  let targetNote = await tp.file.find_tfile(Target);
  let targetNoteContent = await app.vault.read(targetNote);
  console.log(targetNoteContent);
  (TargetHeading) ? targettedHeading = TargetHeading : targettedHeading = "# Notes";
  let newContent = targettedHeading + "\n" + Content;
  let targetNoteReplaced = targetNoteContent.replace(targettedHeading, newContent);
  await app.vault.modify(targetNote, targetNoteReplaced);
}
  
module.exports = appendContentToTarget;