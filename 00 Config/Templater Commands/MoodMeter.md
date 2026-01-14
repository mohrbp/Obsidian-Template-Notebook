<%*
// Load the MoodMeter instance from customJS (already instantiated as singleton)
const { MoodMeter } = await cJS();

// Show the mood picker modal (MoodMeter is already an instance)
const selectedMood = await MoodMeter.showMoodPicker();

if (selectedMood) {
  // Get the current file
  const file = tp.file.find_tfile(tp.file.path(true));
  
  if (file) {
    // Update frontmatter with mood data
    await app.fileManager.processFrontMatter(file, (frontmatter) => {
      frontmatter.mood = selectedMood.word;
      frontmatter.energyLevel = selectedMood.energy;
      frontmatter.affectLevel = selectedMood.affect;
      <!-- frontmatter.moodColor = selectedMood.color; -->
      <!-- frontmatter.moodTimestamp = tp.date.now("YYYY-MM-DD HH:mm:ss"); -->
    });
    
    new Notice(`Mood set to: ${selectedMood.word} (Energy: ${selectedMood.energy}, Affect: ${selectedMood.affect})`);
  }
}
%>