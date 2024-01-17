
// Written with gpt 3.5
function convertLinksToCommaSeparatedList(text) {
  // Regular expression to match Markdown links
  const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  // Regular expression to match Wiki links
  const wikiRegex = /\[\[([^\]]+)\]\]/g;

  // Array to store all links
  const linksArray = [];

  // Find Markdown links and add to the array
  let markdownMatch;
  while ((markdownMatch = markdownRegex.exec(text)) !== null) {
    const linkText = markdownMatch[1];
    const linkUrl = markdownMatch[2];
    linksArray.push(`[${linkText}](${linkUrl})`);
  }

  // Find Wiki links and add to the array
  let wikiMatch;
  while ((wikiMatch = wikiRegex.exec(text)) !== null) {
    const wikiLink = wikiMatch[1];
    linksArray.push(`[[${wikiLink}]]`);
  }

  // Join the links with commas and return the result
  return linksArray.join(', ');
}
exports.convertLinksToCommaSeparatedList = convertLinksToCommaSeparatedList;




