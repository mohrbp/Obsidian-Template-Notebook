// Usage in your note: ```dataviewjs await dv.view("moodMeterButton")```

const { MoodMeter } = await cJS();

// Create a button container
const buttonContainer = dv.container.createEl("div", {
  cls: "mood-meter-button-container"
});

// Create the button
const button = buttonContainer.createEl("button", {
  text: "📊 Record Mood",
  cls: "mood-meter-button-action"
});

// Add button styling
button.style.cssText = `
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// Add hover effect
button.addEventListener("mouseenter", () => {
  button.style.transform = "translateY(-2px)";
  button.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
});

button.addEventListener("mouseleave", () => {
  button.style.transform = "translateY(0)";
  button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
});

// Add click handler
button.addEventListener("click", async () => {
  try {
    // Show loading state
    const originalText = button.textContent;
    button.textContent = "⏳ Opening...";
    button.disabled = true;

    // Show the mood picker modal
    const selectedMood = await MoodMeter.showMoodPicker();

    if (selectedMood) {
      // Get the current file
      const currentFile = app.workspace.getActiveFile();
      
      if (currentFile) {
        // Update frontmatter with mood data
        await app.fileManager.processFrontMatter(currentFile, (frontmatter) => {
          frontmatter.mood = selectedMood.word;
          frontmatter.energyLevel = selectedMood.energy;
          frontmatter.affectLevel = selectedMood.affect;
          // frontmatter.moodColor = selectedMood.color;
          frontmatter.moodTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        });
        
        // Show success notification
        // new Notice(`Mood set to: ${selectedMood.word} (Energy: ${selectedMood.energy}, Affect: ${selectedMood.affect})`);
        
        // Update button to show the mood color and keep it inactive
        button.textContent = selectedMood.word;
        button.style.background = selectedMood.color;
        button.style.cursor = "default";
        // Keep button disabled
      } else {
        throw new Error("No active file found");
      }
    } else {
      // User cancelled - just reset the button
      button.textContent = originalText;
      button.disabled = false;
    }
  } catch (error) {
    console.error("Error recording mood:", error);
    new Notice("Error recording mood: " + error.message);
    button.textContent = "❌ Error";
    button.style.background = "#e74c3c";
    
    // Reset button after 2 seconds
    setTimeout(() => {
      button.textContent = "📊 Record Mood";
      button.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      button.disabled = false;
    }, 2000);
  }
});