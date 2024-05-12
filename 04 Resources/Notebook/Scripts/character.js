
// load params
const wikiLinkRegex = /\[\[([^|\]]+)(?:\|[^|\]]+)?\]\]/;
// Get the character name from the link and return the parent directory
const playerPath = String(dv.current().character_name).match(wikiLinkRegex)[1].split('/').slice(0, -1).join('/');


// Get all of the tasks in the non-Inventory boards
// Then get the path from the markdown link text
const aspects = dv.page(playerPath + "/aspects/aspects").file.tasks
  .filter(p => !String(p.header.subpath).includes("Inventory"))
  .map(p => {
    const aspectTitle = p.text.match(wikiLinkRegex)[1];
    console.log(aspectTitle);
    const aspectPath = playerPath + "/aspects/" + aspectTitle;
    const aspectData = {
      name: aspectTitle,
      link: dv.page(aspectPath).file.link,
      aspectSlot: p.header.subpath,
      skill: dv.page(aspectPath).skill,
      skillMod: dv.page(aspectPath).skill_mod,
      trackTotal: dv.page(aspectPath).file.tasks.length,
      trackUnchecked: dv.page(aspectPath).file.tasks
        .filter(t => t.checked == false).length,
      trackBurn: dv.page(aspectPath).file.tasks
        .filter(t => t.status == "f").length,
    };

    return aspectData;
  });

//dv.span(aspects);

// Initialize skillSummary with default values for all skills
const skillSummary = {};
const customSortOrder = [
  "Command", "Flourish", "Hack", "Hunt", "Craft",
  "Scavenge", "Sense", "Tend", "Delve", "Outwit", "Skulk", "Sway"
];

const attributeMapping = {
  "Command": "Teeth",
  "Flourish": "Teeth",
  "Hack": "Teeth",
  "Hunt": "Teeth",
  "Craft": "Tides",
  "Scavenge": "Tides",
  "Sense": "Tides",
  "Tend": "Tides",
  "Delve": "Veils",
  "Outwit": "Veils",
  "Skulk": "Veils",
  "Sway": "Veils",
};

customSortOrder.forEach(skill => {
  skillSummary[skill] = { 
    name: skill, 
    count: 0, 
    skillMod: 0, 
    totalTrack: 0, 
    trackUnchecked: 0, 
    trackBurn: 0, 
    links: [],
    attribute: attributeMapping[skill] 
  };
});

// Iterate through the aspects array
for (let i = 0; i < aspects.length; i++) {
  const { skill, skillMod, trackTotal, trackUnchecked, trackBurn, link, aspectSlot } = aspects[i];

  // Increment the count for the skill in the skillSummary object
  skillSummary[skill].count += 1;
  skillSummary[skill].skillMod += skillMod;
  skillSummary[skill].totalTrack += trackTotal;
  skillSummary[skill].trackUnchecked += trackUnchecked;
  skillSummary[skill].trackBurn += trackBurn;
  skillSummary[skill].links.push(link); // Add link to the links array
  skillSummary[skill].attribute = attributeMapping[skill];
}

//dv.span(skillSummary);


// Now use DataViewJS to create a table with custom sorting
//dv.table(["Name", "Count", "Skill Mod", "Total Track", "Unchecked", "Burn"],
//  customSortOrder.map(skill => [
//    skill,
//    skillSummary[skill].count,
//    skillSummary[skill].skillMod, // You can apply functions here
//    skillSummary[skill].totalTrack,
//    skillSummary[skill].trackUnchecked,
//    skillSummary[skill].trackBurn,
//  ])
//);

dv.table(["Attr", "Name", "Edge", "SP", "Track", "Aspects"],
  customSortOrder.map(skill => [
	skillSummary[skill].attribute,
    skill,
    (skillSummary[skill].count > 0) ? "⚫" : "⚪",
    "⚫".repeat(skillSummary[skill].skillMod),
    "🔥".repeat(skillSummary[skill].trackBurn) + "⬛".repeat((skillSummary[skill].totalTrack - skillSummary[skill].trackUnchecked - skillSummary[skill].trackBurn)) + "⬜".repeat(skillSummary[skill].trackUnchecked),
	skillSummary[skill].links.join(', '), // Join links if there are multiple
  ])
);
