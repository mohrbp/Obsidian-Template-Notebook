async function jsToMarkdown({js: jsFolder, md: markdownFolder}) {
  await checkFolder(markdownFolder);
  const jsTemplater = app.vault.getAbstractFileByPath(jsFolder).children;
  jsTemplater.forEach(async (file) => {
    const content = await app.vault.cachedRead(file);
    const mdFile = file.name.concat(".md");
    const mdFilePath = `${markdownFolder}/${mdFile}`;
    const exists = await app.vault.exists(mdFilePath);
    if (exists) {
      const mdFile = await app.vault.getAbstractFileByPath(mdFilePath)
      await app.vault.modify(mdFile, content);
    }
    if (!exists) {
      await app.vault.create(mdFilePath, content);
    }
  });
}

async function jsFromMarkdown({js: jsFolder, md: mdFolder}) {
  await checkFolder(jsFolder);
  const mdTemplater = app.vault.getAbstractFileByPath(mdFolder).children;
  mdTemplater.forEach(async (file) => {
    const content = await app.vault.cachedRead(file);
    const jsFile = file.name.replace(".md", "")
    const jsFilePath = `${jsFolder}/${jsFile}`;
    const exists = await app.vault.exists(jsFilePath);
    if (exists) {
      const jsFile = await app.vault.getAbstractFileByPath(jsFilePath);
      await app.vault.modify(jsFile, content);
    }
    if (!exists) {
      await app.vault.create(jsFilePath, content);
    }
  });
}

//nabbed from @zsviczian's awesome settings sync scripts
const checkFolder = async (folderPath) => {
  const folder = app.vault.getAbstractFileByPath(folderPath);
  if (!folder) await app.vault.createFolder(folderPath);
};

function sync() {
    return {jsToMarkdown, jsFromMarkdown}
}

module.exports = sync