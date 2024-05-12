let targetProject = input.targetProject;

let notes = dv.pages()
	.where(p => p.note_type == "page")
	.where(p => String(p.project).indexOf(targetProject) != -1)


dv.table(["Created Date", title, "Project","Parent"],
	notes
    .map(p => [
		p.file.link,
		p.created,
		p.project,
    	])
    	.limit(25)
    	)
