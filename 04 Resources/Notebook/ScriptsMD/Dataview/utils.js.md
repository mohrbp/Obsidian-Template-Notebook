
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



function userInfo() {
  // Information about this notebook user
  let user = "BMohr"
  
  // Join the links with commas and return the result
  return user;
}
exports.userInfo = userInfo;


function selectParentMarkdownFile(path) {
  const lastSeparatorIndex = path.lastIndexOf('/');
  if (lastSeparatorIndex === -1) {
    // If no separator is found, return the original path
    return path;
  } else {
    // Get the path without the last directory
    const newPath = path.slice(0, lastSeparatorIndex);

    // Find the second-to-last separator index
    const secondToLastSeparatorIndex = newPath.lastIndexOf('/');
    
    if (secondToLastSeparatorIndex !== -1) {
      // Get the second-to-last directory
      const secondToLastDirectory = newPath.slice(secondToLastSeparatorIndex + 1);

      // Append the second-to-last directory with a Markdown extension
      return `${newPath}/${secondToLastDirectory}.md`;
    } else {
      // If no second-to-last separator is found, return the original path
      return path;
    }
  }
}

exports.selectParentMarkdownFile = selectParentMarkdownFile;


function extractPathFromWikiLink(wikiLink, fullPath = true, returnLinkText = false) {
  // Regular expression to match both [[...]] and [[...|...]]
  const regex = /\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/;

  // Extract the path and link text using the regex
  const match = wikiLink.match(regex);

  if (!match) {
    // Return an empty string if the input is not a valid wiki link
    return '';
  }

  const [, path, linkText] = match;

  // Trim spaces from both ends of the path and link text
  const trimmedPath = path.trim();
  const trimmedLinkText = linkText ? linkText.trim() : '';

  if (returnLinkText) {
    return trimmedLinkText; // Return the link text
  } else if (fullPath) {
    return trimmedPath; // Return the full path
  } else {
    // Return the parent directory
    const lastSeparatorIndex = trimmedPath.lastIndexOf('/');
    const parentDirectory = lastSeparatorIndex !== -1 ? trimmedPath.slice(0, lastSeparatorIndex) : '';
    return parentDirectory;
  }
}
exports.extractPathFromWikiLink = extractPathFromWikiLink;


function subsetByFolderDepth(paths, depth, includeExtension, extension) {
  const subset = [];
  const seenPaths = new Set();

  paths.forEach(path => {
    const folders = path.split('/');
    const folderDepth = folders.length - 1;

    if (folderDepth >= depth) {
      const subsetPath = folders.slice(0, depth + 1).join('/');
      const hasExtension = subsetPath.endsWith(`.${extension}`);  
      if (
        !seenPaths.has(subsetPath) &&
        ((includeExtension && hasExtension) || (!includeExtension && !hasExtension))
      ) {
        seenPaths.add(subsetPath);
        subset.push(subsetPath);
      }
    }
  });

  return subset;
}

exports.subsetByFolderDepth = subsetByFolderDepth;

function formatPaths(data, formatType) {
  if (!Array.isArray(data) || data.length === 0) {
    return "Invalid input data.";
  }

  if (formatType !== "tasks" && formatType !== "embeds") {
    return "Invalid format type. Use `tasks` for a bulleted list and `embeds` for links under level 2 headers.";
  }

  let formattedData = "";

  if (formatType === "tasks") {
    formattedData = data.map(item => `- [ ] [${item.split('/').pop().replace(/\.[^/.]+$/, "")}](${item.replace(/\s/g, "%20")})`).join('\n');
  } else if (formatType === "embeds") {
    formattedData = data.map(item => `## ${item.split('/').pop().replace(/\.[^/.]+$/, "")}\n![${item.split('/').pop().replace(/\.[^/.]+$/, "")}](${item.replace(/\s/g, "%20")})`).join('\n');
  }

  return formattedData;
}

exports.formatPaths = formatPaths;
