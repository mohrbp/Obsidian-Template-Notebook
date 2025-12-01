class dvHelperFuncs {

    async loadTasks_new(dv, notebookManager, target) {
        let targetNote = notebookManager.createNoteObject(dv, target.path)
        let nestedInput = {
            parent: [targetNote]
        };
        
        // console.log("targetNote", targetNote)

        let allChildNotes = await notebookManager.traverseNotebook(dv, nestedInput, {
            recursive: true,
            includeSource: true,
            formatOutput: false,
            traversalType: 'child'
        });
        // console.log("ChildNotes", allChildNotes)

        // Flatten the notes from all categories
        let taskPaths = Object.values(allChildNotes)
            .flat()
            .map(note => note.page?.file?.path ?? [])

        // console.log("taskPaths", taskPaths)

        return dv.pages()
                    .file
                    .filter(p => taskPaths.includes(p.path))
                    .tasks
                    .where(t => t.link.subpath == "Tasks")
                    .where(t => !t.hasOwnProperty("parent"));
    }
	
    loadTasks(dv, noteFilter, target) {
        let targetNote = noteFilter.createNoteObject(dv, target.path);
        let nestedInput = {
            parent: [targetNote]
        };

        let allChildNotes = noteFilter.getAllChildNotes(dv, nestedInput);
        let taskFilter = this.createTaskFilter(targetNote, allChildNotes, include = false);

        return dv.pages()
            .filter(p => noteFilter.dataFilter([p], taskFilter).length > 0)
            .file
            .tasks
            .where(t => t.link.subpath == "Tasks")
            .where(t => !t.hasOwnProperty("parent"));
    }

    createTaskFilter(targetNote, allChildNotes, include = true) {
        let taskFilter = include == true ? {noteType: { includePaths: targetNote.noteType.path }} : 
        {noteType: { excludePaths: targetNote.noteType.path }}

        for (let cat in allChildNotes) {
            taskFilter[cat] = {
                includePaths: [targetNote.path],
                excludePaths: []
            };
            for (let index in allChildNotes[cat]) {
                taskFilter[cat].includePaths.push(String(allChildNotes[cat][index].path));
            }
        }
        
        return taskFilter;
    }

    convertLinksToCommaSeparatedList(text) {
        // Function to Format Links for Tasks Table
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

// Function to check if the device is a mobile device
    isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

// Function to add file frontmatter to task object
     addFrontmatterToTask(dv, task) {
        if (dv.page(task.path) && dv.page(task.path).file) {
            const page = dv.page(task.path).file;
            const frontmatter = page.frontmatter;
            task.created = frontmatter.created || task.created;
            task.modified = page.mtime || task.modified
            task.noteBook = frontmatter.noteBook || task.noteBook;
            task.parent = frontmatter.parent || task.parent;
            task.noteType = frontmatter.noteType || task.noteType;
            task.noteLink = page.link || task.noteLink;
        }
    }

    // Function to arrange and format tasks for GTD
    arrangeTasksForGTD(dv, tasks, currentTime) {

        const { DateTime } = dv.luxon;  

        let recentLow = 1;
        let recentMid = 3;
        let recentHigh = 7;

        const red = "<span style='border-left: 3px solid red;'>&nbsp;</span>";
        const blue = "<span style='border-left: 3px solid rgb(39, 117, 182);'>&nbsp;</span>";
        const green = "<span style='border-left: 3px solid green;'>&nbsp;</span>";

        const taskCounts = {};
        for (let task of tasks) {
            task.visual = task.text;

            if (task.checked === true && task.text.match(/([✅]) ?(\d{4}-\d{2}-\d{2})/) != null) {
                let dateMatch = task.text.match(/([✅]) ?(\d{4}-\d{2}-\d{2})/)[2];
                console.log("dateMatch",dateMatch)
                task.completedDate = DateTime.fromISO(dateMatch);
                task.visual = task.visual.replace(/([✅]) ?(\d{4}-\d{2}-\d{2})/, "")
            }

            if (task.text.match(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/) != null) {
            // Adding Task Scheduled Date
                let dateMatch = task.text.match(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/)[2];
                task.scheduledDate = DateTime.fromISO(dateMatch);
                task.timeUntilScheduled = Math.round(task.scheduledDate.diff(currentTime, "days").as("minutes"));
                if (task.timeUntilScheduled < (0)) {
                    task.color = red;
                    task.timing = "overdue";
                } else if ((task.timeUntilScheduled < (1400 * recentLow)) && (task.timeUntilScheduled >= (0))) {
                    task.color = green;
                    task.timing = "due";
                } else if ((task.timeUntilScheduled < (1400 * recentMid)) && (task.timeUntilScheduled >= (1400 * recentLow))) {
                    task.color = blue;
                    task.timing = "upcoming";
                } else if (task.timeUntilScheduled >= 0 && task.timeUntilScheduled < (1440 * recentHigh)) {
                    task.timing = "future";
                    task.color = "";
                }
                if (task.checked === false) {
                    task.visual = task.color + task.visual.replace(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/, "")
                    } else {
                    task.visual = task.visual.replace(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/, "")
                };
                // Count tasks by timing, project, and projectCategory
       //         const key = `${task.timing}_${task.project}_${task.projectCategory}`;
                const key = `${task.timing}_${task.projectCategory}`;
                taskCounts[key] = (taskCounts[key] || 0) + 1;
      //      console.log("Scheduled - ", task.scheduled,
      //                  "\n scheduledDate - ", task.scheduledDate,
      //                  "\n timeUntilScheduled = ", task.timeUntilScheduled);
            }
        }
        // console.log("Task Counts:", taskCounts);
    }

    // Function to display Scheduled tasks in a table
    displayScheduledTasksInTable(dv, title, tasks, limit) {
        const { DateTime } = dv.luxon;  
        // Map table variables
        dv.header(3, title);
        dv.table(
            ["Task", "Scheduled", "Parent", "noteType", "noteBook", "Note", "Created"], 
            tasks
            .sort(t => DateTime.fromISO(t.scheduledDate), "asc")
            // Logic to filter, sort, and map tasks
            .map(t => [
            t.visual,
            t.scheduledDate.toFormat("DD"),
            this.convertLinksToCommaSeparatedList(t.parent),
            t.noteType,
            t.noteBook,     
            t.noteLink,
            DateTime.fromISO(t.created).toFormat("DD"),
            ])
            .limit(limit)
        );
    }

    // Function to display Unscheduled tasks in a table
     displayUnscheduledTasksInTable(dv, title, tasks, limit) {
        const { DateTime } = dv.luxon;
        // Map table variables
        dv.header(3, title);
        dv.table(
            ["Task", "Notebok", "Project", "Note", "Created"], 
            tasks
            .sort(t => DateTime.fromISO(t.created), "desc")
            // Logic to filter, sort, and map tasks
            .map(t => [
            t.visual,
            this.convertLinksToCommaSeparatedList(t.noteBook),
            this.convertLinksToCommaSeparatedList(t.parent),
            t.noteLink,
            DateTime.fromISO(t.created).toFormat("DD"),
            ])
            .limit(limit)
        );
    }

    // Function to display Completed tasks in a table
     displayCompletedTasksInTable(dv, title, tasks, limit) {
        const { DateTime } = dv.luxon;
        // Map table variables 
        dv.header(3, title);
        dv.table(
            ["Task", "Notebook", "Project", "Note", "Created", "Completed"],
            tasks
            .sort(t => DateTime.fromISO(t.completedDate), "desc")
            // Logic to filter, sort, and map tasks
            .map(t => [
            t.visual,
            this.convertLinksToCommaSeparatedList(t.noteBook),
            this.convertLinksToCommaSeparatedList(t.parent),
            t.noteLink,
            DateTime.fromISO(t.created).toFormat("DD"),
            t.completedDate,
            ])
            .limit(limit)
        );
    }

    /**
     * Create an Obsidian URI for modifying frontmatter of a specific note.
     * @param {string} vaultName - The name of the Obsidian vault.
     * @param {string} notePath - The relative path to the note within the vault.
     * @param {Array<string>} frontmatterKeyPath - The key path in the frontmatter to modify.
     * @param {any} value - The value to set for the specified frontmatter key.
     * @returns {string} The Obsidian URI for the frontmatter modification.
     */
    createObsidianUri(vaultName, notePath, frontmatterKeyPath, value) {
        const encodedVault = encodeURIComponent(vaultName);
        const encodedPath = encodeURIComponent(notePath);
        const encodedKeyPath = encodeURIComponent(JSON.stringify(frontmatterKeyPath));
        const encodedData = encodeURIComponent(JSON.stringify(value));

        return `obsidian://advanced-uri?vault=${encodedVault}&filepath=${encodedPath}&frontmatterkey=${encodedKeyPath}&data=${encodedData}`;
    }


    /**
     * Display a table of tasks with dynamic links for Obsidian URI actions.
     * @param {object} dv - The Dataview API instance.
     * @param {string} title - The title of the table.
     * @param {array} tasks - The array of tasks to display.
     * @param {number} limit - The maximum number of tasks to display.
     */
    displayTasksWithUriTable(dv, title, tasks, limit) {
        // Map table variables
        dv.header(3, title);
        // Ensure tasks is a plain array
        const taskArray = Array.from(tasks);

        const vaultName = "My Notes"; // Replace with your vault's name

        return dv.table(
            ["Task", "Note Link", "Modify Frontmatter"],
            tasks.slice(0, limit).map(task => {
                const notePath = task.path;
                const frontmatterKeyPath = ["target_uri"];
                const value = "safd";

                const uri = this.createObsidianUri(vaultName, notePath, frontmatterKeyPath, value);

                return [
                    task.visual,
                    `[[${notePath}]]`,
                    `[Set Target URI](${uri})`
                ];
            })
        );
    }

}