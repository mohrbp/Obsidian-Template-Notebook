# Obsidian Template Notebook
 
## Configuration
### Options
- Editor
  - Efault editing mode - Live Preview
  - Properties in document - Hidden
  - Fold heading and indent - ON
- Files an links
  - Automatically update internal links - ON
  - New Link Format - Shortest path when possible
  - Use [[Wikilinks]] - ON
  - Detect all file extensions - ON
  - Default location for new attachments - Same folder as current file
- Apperance
  - Themes - Minimal
  - Interface font - Atkinson Hyerlegible
### Plugins
- Core Plugins
  - Turn off "Daily Note" - not currently configured
  - Turn off "Note composer"
- Community Plugins
  - Dataview
    - Turn on Javascript Queries
  - CustomJS
    - Set Scripts folder to `00 Home/Notebook Config/Scripts/customJS`
  - Templater
    - Set Template Folder location to `00 Home/Notebook Config/Scripts/Templater`
    - Set Script files folder location to `00 Home/Notebook Config/Scripts/Templater`
    - Add Templater Hotkeys for the following functions
      - New Page
      - Annotate Task
  - Folder Notes
    - Default settings - but notably use Storage Location = "Inside the folder", Hide Folder note and Underline the name of folder notes - ON
  - Attachment Mangement
    - Root path to save attachement - Copy Obsidian settings
    - Attachment Format - ${date}-${originalname}
    - Date format YYYY-MM-DDTHHmmssSSS
    - Automatically rename attachment - Up to you, but I recommend setting exclusion patterns/paths and Exclude Subpaths to ON
  - Style Settings
    - Under Minimal
      - Under Text -> Italic text color and Bold Text color 
  - Minimal Style Settings
    - Colorful Headings - ON
    - Table Width - Wide Line Width
  - Some Bonus Plugins I use
    - Calendar
    - Outliner
    - Time Ruler
    - Excalidraw
    - Media Extended
    - Pomodoro Timer
      - Task Format - Dataview
      - Log File - File
      - Log file path - none
      - Log Level - All
      - Log Format - Custom
      - Log template `<%* await tp.user.pomodoroLog(tp, log) %>`
    - Zotero Integration
    - Linter


### Workspace layout
- TL File Explorer
- BL Backlinks, Tags, Bookmarks
- TR Properties, Calendar
- BR Outline, Pomo timer

### Hotkeys
- Notable presets
  - Ctrl/Cmd + P - Command Template
  - Ctrl/Cmd + O - Quick Switcher
- Hotkeys to set yourself
  - Ctrl/Cmd + N - Templater New Note
  - Ctrl/Cmd + T - Templater Annotate Task
  - Ctrl/Cmd + Shift + L/R - Toggle Left/Right Side Bar