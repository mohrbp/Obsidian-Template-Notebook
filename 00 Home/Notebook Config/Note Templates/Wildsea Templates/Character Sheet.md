---
noteType: "[[Character Sheet]]"
noteBook: "[[Note Templates]]"
adminTemplate:
  - "[[Inventory Sheet Template|Inventory]]"
  - "[[Aspect Template|Aspects]]"
  - "[[Journal Template|Journal]]"
  - "[[Tracks Template|Tracks]]"
allTemplate: 
folderNote: true
skill_teeth_command: 0
skill_teeth_flourish: 0
skill_teeth_hack: 0
skill_teeth_hunt: 0
skill_tides_craft: 0
skill_tides_nurture: 0
skill_tides_sense: 0
skill_tides_study: 0
skill_veils_delve: 0
skill_veils_outwit: 0
skill_veils_skulk: 0
skill_veils_sway: 0
aspect_teeth_track: 0
aspect_tides_track: 0
aspect_veils_track: 0
---

// Initialize dataview plugin variable
const dv = this.app.plugins.plugins["dataview"].api;
await tp.user.wildseaTemplate(tp, dv)

# Character Stats
## Aspects
``` dataviewjs
// Function to create buttons for increasing and decreasing frontmatter values
function createAdjustButtons(frontmatterField, increaseText, decreaseText, max) {
    const increaseButton = document.createElement('button');
    increaseButton.textContent = increaseText;
    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = decreaseText;
    let file = app.workspace.getActiveFile();

    increaseButton.onclick = () => {
        app.fileManager.processFrontMatter(file, (frontmatter) => {
            if (!frontmatter[frontmatterField]) {
                frontmatter[frontmatterField] = 0;
            }
            if (frontmatter[frontmatterField] < max) {
                frontmatter[frontmatterField] += 1;
            }
        });
    };

    decreaseButton.onclick = () => {
        app.fileManager.processFrontMatter(file, (frontmatter) => {
            if (!frontmatter[frontmatterField]) {
                frontmatter[frontmatterField] = 0;
            }
            if (frontmatter[frontmatterField] > 0) {
                frontmatter[frontmatterField] -= 1;
            }
        });
    };

    const container = document.createElement('div');
    container.appendChild(increaseButton);
    container.appendChild(decreaseButton);

    return container;
}

let thisNote = dv.current();
let aspects = [
    { name: 'teeth', skillPoints: thisNote.aspect_teeth_track, maxPoints: 2 },
    { name: 'tides', skillPoints: thisNote.aspect_tides_track, maxPoints: 2 },
    { name: 'veils', skillPoints: thisNote.aspect_veils_track, maxPoints: 2 }
];

aspects.forEach(aspect => {
    let skillsInAspect = Object.keys(thisNote)
        .filter(key => key.startsWith(`skill_${aspect.name}_`));
    let totalPoints = skillsInAspect.reduce((sum, skill) => sum + thisNote[skill], 0);
    let nonZeroSkills = skillsInAspect.filter(skill => thisNote[skill] > 0).length;

    // Directly access the frontmatter value for the track
    let trackFilled = thisNote[`aspect_${aspect.name}_track`];

    aspect.trackFilled = trackFilled || 0; // Default to 0 if the value is undefined
    aspect.totalPoints = totalPoints;
    aspect.nonZeroSkills = nonZeroSkills;
});

dv.table(
    ["Aspect", "Skill Points", "Skill Count", "Track", "Change Track"],
    aspects.map(aspect => {
        const buttonContainer = createAdjustButtons(
            `aspect_${aspect.name.toLowerCase()}_track`,
            '➕',
            '➖',
            aspect.maxPoints
        );
        return [
            aspect.name,
            aspect.totalPoints,
            aspect.nonZeroSkills,
            "⚫".repeat(aspect.trackFilled),
            buttonContainer
        ];
    })
);
```
## Skills
``` dataviewjs
let thisNote = dv.current();
let skillSummary = {};

// Iterate over each property in `thisNote`
for (let key in thisNote) {
    // Check if the key starts with "skill_"
    if (key.startsWith("skill_")) {
        // Extract the category and skill name from the key
        let [_, category, skill] = key.split('_');
        let skillName = `${category}_${skill}`;

        // Populate the skillSummary object with the necessary information
        skillSummary[skillName] = {
            attribute: category,
            count: thisNote[key], // This is where the points are stored
            skillMod: thisNote[key], // Assuming this is equivalent to points
            trackBurn: 0, // Placeholder, update with actual logic if available
            totalTrack: 5, // Placeholder, update with actual logic if available
            trackUnchecked: 5 - thisNote[key], // Placeholder, update with actual logic if available
            links: [] // Placeholder, update with actual logic if available
        };
    }
}

// Sort the skillSummary keys alphabetically based on the skill name
let customSortOrder = Object.keys(skillSummary).sort();

// Generate the table
dv.table(["Aspect", "Skill", 
		 // "Edge", 
		  "SP", 
		//  "Track", "Aspects"
		  ],
    customSortOrder.map(skill => [
        skillSummary[skill].attribute,
        skill.split('_')[1], // Extracting the skill name after the first underscore
     //   (skillSummary[skill].count > 0) ? "⚫" : "⚪",
        "⚫".repeat(skillSummary[skill].skillMod),
    //    "🔥".repeat(skillSummary[skill].trackBurn) + "⬛".repeat((skillSummary[skill].totalTrack - skillSummary[skill].trackUnchecked - skillSummary[skill].trackBurn)) + "⬜".repeat(skillSummary[skill].trackUnchecked),
 //       skillSummary[skill].links.join(', ') // Join links if there are multiple
    ])
);
```
