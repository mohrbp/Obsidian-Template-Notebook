async function bulletToHeader(text, headerLevel = 2) {
  const lines = text.split('\n');
  const result = [];
  let firstBulletFound = false;
  let firstBulletIndent = 0;
  
  for (const line of lines) {
    // Skip empty lines
    if (line.trim() === '') {
      result.push(line);
      continue;
    }
    
    // Match bullet points with indentation
    // Supports: -, *, +, and numbered bullets (1., 2., etc.)
    const match = line.match(/^(\t*)([-*+]|\d+\.)\s+(.+)$/);
    
    if (match) {
      const indentation = match[1];
      const bulletType = match[2];
      const content = match[3];
      const indentCount = indentation.length;
      
      if (!firstBulletFound) {
        // Convert first bullet to header and remember its indent level
        firstBulletFound = true;
        firstBulletIndent = indentCount;
        const headerPrefix = '#'.repeat(headerLevel);
        result.push(`${headerPrefix} ${content}`);
      } else {
        // Remove the same amount of indentation as the first bullet had
        const newIndentCount = Math.max(0, indentCount - firstBulletIndent - 1);
        const newIndent = '\t'.repeat(newIndentCount);
        result.push(`${newIndent}${bulletType} ${content}`);
      }
    } else {
      // If it's not a bullet point, keep it as is
      result.push(line);
    }
  }
  
  return result.join('\n');
}

module.exports = bulletToHeader;
