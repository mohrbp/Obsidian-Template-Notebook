// Save this file in your vault's customJS folder (e.g., Scripts/customJS/MoodMeter.js)

class MoodMeter {
  moods = [
    // Row 1 (Energy 10)
    { word: "ENRAGED", energy: 10, affect: 1, color: "#7d1a1a" },
    { word: "PANICKED", energy: 10, affect: 2, color: "#8b1818" },
    { word: "STRESSED", energy: 10, affect: 3, color: "#991616" },
    { word: "JITTERY", energy: 10, affect: 4, color: "#d84315" },
    { word: "SHOCKED", energy: 10, affect: 5, color: "#f4511e" },
    { word: "SURPRISED", energy: 10, affect: 6, color: "#fdd835" },
    { word: "UPBEAT", energy: 10, affect: 7, color: "#fbc02d" },
    { word: "FESTIVE", energy: 10, affect: 8, color: "#c6a700" },
    { word: "EXHILARATED", energy: 10, affect: 9, color: "#d4af37" },
    { word: "ECSTATIC", energy: 10, affect: 10, color: "#f9a825" },
    
    // Row 2 (Energy 9)
    { word: "LIVID", energy: 9, affect: 1, color: "#8b1e1e" },
    { word: "FURIOUS", energy: 9, affect: 2, color: "#991c1c" },
    { word: "FRUSTRATED", energy: 9, affect: 3, color: "#a81a1a" },
    { word: "TENSE", energy: 9, affect: 4, color: "#e64a19" },
    { word: "STUNNED", energy: 9, affect: 5, color: "#ff5722" },
    { word: "HYPER", energy: 9, affect: 6, color: "#fdd835" },
    { word: "CHEERFUL", energy: 9, affect: 7, color: "#fbc02d" },
    { word: "MOTIVATED", energy: 9, affect: 8, color: "#c6a700" },
    { word: "INSPIRED", energy: 9, affect: 9, color: "#d4af37" },
    { word: "ELATED", energy: 9, affect: 10, color: "#f9a825" },
    
    // Row 3 (Energy 8)
    { word: "FUMING", energy: 8, affect: 1, color: "#9a2020" },
    { word: "FRIGHTENED", energy: 8, affect: 2, color: "#a71e1e" },
    { word: "ANGRY", energy: 8, affect: 3, color: "#b51c1c" },
    { word: "NERVOUS", energy: 8, affect: 4, color: "#f4511e" },
    { word: "RESTLESS", energy: 8, affect: 5, color: "#ff6f43" },
    { word: "ENERGIZED", energy: 8, affect: 6, color: "#fdd835" },
    { word: "LIVELY", energy: 8, affect: 7, color: "#fbc02d" },
    { word: "ENTHUSIASTIC", energy: 8, affect: 8, color: "#c6a700" },
    { word: "OPTIMISTIC", energy: 8, affect: 9, color: "#d4af37" },
    { word: "EXCITED", energy: 8, affect: 10, color: "#f9a825" },
    
    // Row 4 (Energy 7)
    { word: "ANXIOUS", energy: 7, affect: 1, color: "#a82424" },
    { word: "APPREHENSIVE", energy: 7, affect: 2, color: "#b52222" },
    { word: "WORRIED", energy: 7, affect: 3, color: "#c32020" },
    { word: "IRRITATED", energy: 7, affect: 4, color: "#ff5722" },
    { word: "ANNOYED", energy: 7, affect: 5, color: "#ff7043" },
    { word: "PLEASED", energy: 7, affect: 6, color: "#fdd835" },
    { word: "HAPPY", energy: 7, affect: 7, color: "#fbc02d" },
    { word: "FOCUSED", energy: 7, affect: 8, color: "#c6a700" },
    { word: "PROUD", energy: 7, affect: 9, color: "#d4af37" },
    { word: "THRILLED", energy: 7, affect: 10, color: "#f9a825" },
    
    // Row 5 (Energy 6)
    { word: "REPULSED", energy: 6, affect: 1, color: "#b62828" },
    { word: "TROUBLED", energy: 6, affect: 2, color: "#c32626" },
    { word: "CONCERNED", energy: 6, affect: 3, color: "#d12424" },
    { word: "UNEASY", energy: 6, affect: 4, color: "#ff6f43" },
    { word: "PEEVED", energy: 6, affect: 5, color: "#ff8a65" },
    { word: "PLEASANT", energy: 6, affect: 6, color: "#fdd835" },
    { word: "JOYFUL", energy: 6, affect: 7, color: "#fbc02d" },
    { word: "HOPEFUL", energy: 6, affect: 8, color: "#c6a700" },
    { word: "PLAYFUL", energy: 6, affect: 9, color: "#d4af37" },
    { word: "BLISSFUL", energy: 6, affect: 10, color: "#f9a825" },
    
    // Row 6 (Energy 5)
    { word: "DISGUSTED", energy: 5, affect: 1, color: "#1a237e" },
    { word: "GLUM", energy: 5, affect: 2, color: "#283593" },
    { word: "DISAPPOINTED", energy: 5, affect: 3, color: "#3949ab" },
    { word: "DOWN", energy: 5, affect: 4, color: "#1976d2" },
    { word: "APATHETIC", energy: 5, affect: 5, color: "#42a5f5" },
    { word: "AT EASE", energy: 5, affect: 6, color: "#66bb6a" },
    { word: "EASYGOING", energy: 5, affect: 7, color: "#4caf50" },
    { word: "CONTENT", energy: 5, affect: 8, color: "#43a047" },
    { word: "LOVING", energy: 5, affect: 9, color: "#388e3c" },
    { word: "FULFILLED", energy: 5, affect: 10, color: "#2e7d32" },
    
    // Row 7 (Energy 4)
    { word: "PESSIMISTIC", energy: 4, affect: 1, color: "#1a237e" },
    { word: "MOROSE", energy: 4, affect: 2, color: "#283593" },
    { word: "DISCOURAGED", energy: 4, affect: 3, color: "#3949ab" },
    { word: "SAD", energy: 4, affect: 4, color: "#1976d2" },
    { word: "BORED", energy: 4, affect: 5, color: "#42a5f5" },
    { word: "CALM", energy: 4, affect: 6, color: "#66bb6a" },
    { word: "SECURE", energy: 4, affect: 7, color: "#4caf50" },
    { word: "SATISFIED", energy: 4, affect: 8, color: "#43a047" },
    { word: "GRATEFUL", energy: 4, affect: 9, color: "#388e3c" },
    { word: "TOUCHED", energy: 4, affect: 10, color: "#2e7d32" },
    
    // Row 8 (Energy 3)
    { word: "ALIENATED", energy: 3, affect: 1, color: "#1a237e" },
    { word: "MISERABLE", energy: 3, affect: 2, color: "#283593" },
    { word: "LONELY", energy: 3, affect: 3, color: "#3949ab" },
    { word: "DISHEARTENED", energy: 3, affect: 4, color: "#1976d2" },
    { word: "TIRED", energy: 3, affect: 5, color: "#42a5f5" },
    { word: "RELAXED", energy: 3, affect: 6, color: "#66bb6a" },
    { word: "CHILL", energy: 3, affect: 7, color: "#4caf50" },
    { word: "RESTFUL", energy: 3, affect: 8, color: "#43a047" },
    { word: "BLESSED", energy: 3, affect: 9, color: "#388e3c" },
    { word: "BALANCED", energy: 3, affect: 10, color: "#2e7d32" },
    
    // Row 9 (Energy 2)
    { word: "DESPONDENT", energy: 2, affect: 1, color: "#0d47a1" },
    { word: "DEPRESSED", energy: 2, affect: 2, color: "#1565c0" },
    { word: "SULLEN", energy: 2, affect: 3, color: "#1976d2" },
    { word: "EXHAUSTED", energy: 2, affect: 4, color: "#1e88e5" },
    { word: "FATIGUED", energy: 2, affect: 5, color: "#42a5f5" },
    { word: "MELLOW", energy: 2, affect: 6, color: "#66bb6a" },
    { word: "THOUGHTFUL", energy: 2, affect: 7, color: "#4caf50" },
    { word: "PEACEFUL", energy: 2, affect: 8, color: "#43a047" },
    { word: "COMFY", energy: 2, affect: 9, color: "#388e3c" },
    { word: "CAREFREE", energy: 2, affect: 10, color: "#2e7d32" },
    
    // Row 10 (Energy 1)
    { word: "DESPAIR", energy: 1, affect: 1, color: "#01579b" },
    { word: "HOPELESS", energy: 1, affect: 2, color: "#0277bd" },
    { word: "DESOLATE", energy: 1, affect: 3, color: "#0288d1" },
    { word: "SPENT", energy: 1, affect: 4, color: "#039be5" },
    { word: "DRAINED", energy: 1, affect: 5, color: "#03a9f4" },
    { word: "SLEEPY", energy: 1, affect: 6, color: "#66bb6a" },
    { word: "COMPLACENT", energy: 1, affect: 7, color: "#4caf50" },
    { word: "TRANQUIL", energy: 1, affect: 8, color: "#43a047" },
    { word: "COZY", energy: 1, affect: 9, color: "#388e3c" },
    { word: "SERENE", energy: 1, affect: 10, color: "#2e7d32" }
  ];

  MoodPickerModal = class extends customJS.obsidian.Modal {
    constructor(opts = {}) {
      super(app);
      Object.assign(this, opts);
    }

    onOpen() {
      const { contentEl, titleEl } = this;
      contentEl.empty();
      contentEl.addClass('mood-meter-modal');

      // Add title
      titleEl.setText('MOOD METER');
      
      // Add subtitle
      contentEl.createEl('p', { text: 'How are you feeling?', cls: 'mood-subtitle' });

      // Create grid container
      const gridContainer = contentEl.createDiv({ cls: 'mood-grid' });

      // Create 10x10 grid (energy levels 10 to 1, affect levels 1 to 10)
      for (let energy = 10; energy >= 1; energy--) {
        const rowMoods = this.moods.filter(m => m.energy === energy);
        rowMoods.sort((a, b) => a.affect - b.affect);

        rowMoods.forEach(mood => {
          const button = gridContainer.createEl('button', {
            text: mood.word,
            cls: 'mood-button'
          });
          button.style.backgroundColor = mood.color;
          button.style.color = '#ffffff';
          
          button.addEventListener('click', () => {
            if (this.resolve) {
              this.resolve(mood);
              this.resolve = null;
            }
            this.close();
          });
        });
      }

      // Add axis labels
      const labelsContainer = contentEl.createDiv({ cls: 'mood-labels' });
      labelsContainer.createEl('div', { text: '← PLEASANTNESS →', cls: 'axis-label' });

      // Add styles
      this.addStyles();
    }

    addStyles() {
      const styleId = 'mood-meter-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          .mood-meter-modal .modal-content {
            padding: 20px;
          }
          .mood-subtitle {
            text-align: center;
            margin-bottom: 20px;
            font-size: 1.1em;
          }
          .mood-grid {
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 4px;
            margin-bottom: 20px;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
          }
          .mood-button {
            padding: 12px 8px;
            border: none;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            transition: transform 0.1s, opacity 0.2s;
            border-radius: 4px;
          }
          .mood-button:hover {
            transform: scale(1.05);
            opacity: 0.9;
          }
          .mood-labels {
            text-align: center;
            margin-top: 10px;
          }
          .axis-label {
            font-weight: bold;
            margin-top: 5px;
          }
        `;
        document.head.appendChild(style);
      }
    }

    onClose() {
      // Ensure resolve is called even if modal is closed without selection
      setTimeout(() => {
        if (this.resolve) {
          this.resolve(null);
          this.resolve = null;
        }
      }, 0);
    }
  };

  async showMoodPicker() {
    const { MoodPickerModal } = this;
    return new Promise((resolve) => {
      const modal = new MoodPickerModal({
        moods: this.moods,
        resolve,
      });
      modal.open();
    });
  }
}
