async function selectProjectRevised(tp, dv, noteDest) {
  //  let noteDest = await tp.system.suggester(["Projects", "Current Location"], ["Projects", "Current Location"]);
    let selected_project;   
    let target_File;
    let target_Project;  

    async function selectNestedProject(baseProjects, initialSelectedFile = null) {
        let selected_projectPath;
        let suggestions = [...baseProjects.map(p => p.file.name)];
        let values = [...baseProjects.map(p => p.file.path)];

        if (initialSelectedFile) {

            let initialProjectName = String(initialSelectedFile[0]).substring(String(initialSelectedFile[0]).search("\\|") + 1, String(initialSelectedFile[0]).search(/\||\]\]/));
            suggestions = [`${initialProjectName} (Selected Folder)`, ...suggestions];
            values = ["selected", ...values];
        }

        selected_projectPath = await tp.system.suggester(suggestions, values);

        if (selected_projectPath === "selected") {
            let initialProjectPath = String(initialSelectedFile[0]).substring(String(initialSelectedFile[0]).search("\\[\\[") + 2, String(initialSelectedFile[0]).search("\\|"));
            selected_project = dv.page(initialProjectPath);
            return selected_project; 
        } else {
                selected_project = dv.page(selected_projectPath);

                while (true) {
                    let selectedProjectLinks = Array.isArray(selected_project.file.frontmatter.project) 
                                               ? selected_project.file.frontmatter.project 
                                               : [selected_project.file.frontmatter.project];

                    let child_projects = dv.pages()
                        .where(p => p.note_type === "project" && 
                                    p.file.frontmatter.parent_project && 
                                    Array.isArray(p.file.frontmatter.parent_project) &&
                                    p.file.frontmatter.parent_project.some(pp => selectedProjectLinks.includes(pp)))
                        .sort(p => p.file.name);

                    if (child_projects.length === 0) {
                        return selected_project;
                    }

                    suggestions = [`${selected_project.file.name} (Selected Folder)`, ...child_projects.map(p => p.file.name)];
                    values = ["selected", ...child_projects.map(p => p.file.path)];

                    let selected_childPath = await tp.system.suggester(suggestions, values);
                    if (!selected_childPath || selected_childPath === "selected") {
                        return selected_project;
                    }

                    selected_project = dv.page(selected_childPath);
                }
            }
        }

    if (noteDest === "Projects") {
        let all_projects = dv.pages()
            .where(p => p.note_type === "project" && (!p.parent_project || p.parent_project.length === 0))
            .sort(p => p.file.name);

        target_File = await selectNestedProject(all_projects);
        console.log(target_File)
        target_Project = target_File.file;

    } else if (noteDest === "Current Location") {
        let current_note = dv.page(tp.file.path(true));
        let current_project = current_note.file.frontmatter.project;
        console.log("current_project is ", current_project)
        if (!current_project) {
            throw new Error("The current note does not have a project frontmatter property.");
        }

        let selectedProjectLinks;
        if (Array.isArray(current_project)) {
            console.log("is.Array", current_project, current_project.length)
            if (current_project.length > 1) {
                console.log("current_project.length > 1")
                let projectNames = current_project.map(p => {
                    return String(p).substring(String(p).search("\\|") + 1, String(p).search("\\]\\]"));
                });
                let selectedProject = await tp.system.suggester(projectNames, current_project);
                selectedProjectLinks = [selectedProject];
            } else {
                selectedProjectLinks = current_project;
            }
        } else {
            selectedProjectLinks = [current_project];
        }

        let all_child_projects = dv.pages()
            .where(p => p.note_type === "project" && 
                        p.file.frontmatter.parent_project && 
                        Array.isArray(p.file.frontmatter.parent_project) &&
                        p.file.frontmatter.parent_project.some(pp => selectedProjectLinks.includes(pp)))
            .sort(p => p.file.name);

        console.log(all_child_projects)
    //    currentProjectString.search("\\[\\[") + 2 still finds the starting position.
    //    currentProjectString.slice(startPosition).search(/\||\]\]/) finds the first occurrence of either | or ]] after the starting position.
    //    If search returns a valid index, adjust it relative to the start position.
    //    The substring method extracts the desired part of the string.

            let currentProjectString = String(current_project[0]);
            let startPosition = currentProjectString.search("\\[\\[") + 2;
            let endPosition = currentProjectString.slice(startPosition).search(/\||\]\]/);
            console.log(currentProjectString.slice(startPosition))
            console.log(startPosition, endPosition)
            if (endPosition !== -1) {
                endPosition += startPosition;
            } else {
                endPosition = currentProjectString.length;
            }
            let startingProjectPath = currentProjectString.substring(startPosition, endPosition);
            console.log(startingProjectPath)

        if (all_child_projects.length === 0) {

            target_File = dv.page(startingProjectPath);
            target_Project = target_File.file;

        } else {

            target_File = await selectNestedProject(all_child_projects, current_project);
            target_Project = target_File.file;
        }
    }

    return target_Project;
}

module.exports = selectProjectRevised;
