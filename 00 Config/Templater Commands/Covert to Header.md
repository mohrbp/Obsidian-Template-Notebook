<%*
let text = tp.file.selection()
console.log(text)
let newText = await tp.user.bulletsToHeader(text, startLevel = 2)
tR += newText
_%>
