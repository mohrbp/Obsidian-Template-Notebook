async function buildPageAndLink(p_tp, p_strTemplateName, p_strName, p_strFolderPath, p_bPrefixDateStamp = false)
{
	let strName = p_strName;
	if (p_bPrefixDateStamp) strName = p_tp.date.now("YYYY-MM-DD") + " " + strName;
	let fFolder = app.vault.getAbstractFileByPath(p_strFolderPath);
	let fTemplate = await p_tp.file.find_tfile(p_strTemplateName);
	let strContent = await app.vault.read(fTemplate);
	let tFile = await p_tp.file.create_new(strContent, strName, false, fFolder);
	return tFile;
}
module.exports = buildPageAndLink;
