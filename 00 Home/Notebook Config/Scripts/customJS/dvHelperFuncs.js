class dvHelperFuncs {
	
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
    arrangeTasksForGTD(tasks, currentTime) {

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
                dateMatch = task.text.match(/([✅]) ?(\d{4}-\d{2}-\d{2})/)[2];
                task.completedDate = DateTime.fromISO(dateMatch);
                task.visual = task.visual.replace(/([✅]) ?(\d{4}-\d{2}-\d{2})/, "")
            }

            if (task.text.match(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/) != null) {
            // Adding Task Scheduled Date
                dateMatch = task.text.match(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/)[2];
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
    displayScheduledTasksInTable(dv, DateTime, title, tasks, limit) {
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
     displayUnscheduledTasksInTable(dv, DateTime, title, tasks, limit) {
        // Map table variables
        dv.header(3, title);
        dv.table(
            ["Task", "Project Category", "Project", "Note", "Created"], 
            tasks
            .sort(t => DateTime.fromISO(t.created), "desc")
            // Logic to filter, sort, and map tasks
            .map(t => [
            t.visual,
            this.convertLinksToCommaSeparatedList(t.projectCategory),
            this.convertLinksToCommaSeparatedList(t.project),
            t.note_link,
            DateTime.fromISO(t.created).toFormat("DD"),
            ])
            .limit(limit)
        );
    }

    // Function to display Completed tasks in a table
     displayCompletedTasksInTable(dv, DateTime, title, tasks, limit) {
        // Map table variables 
        dv.header(3, title);
        dv.table(
            ["Task", "Project Category", "Project", "Note", "Created", "Completed"],
            tasks
            .sort(t => DateTime.fromISO(t.completedDate), "desc")
            // Logic to filter, sort, and map tasks
            .map(t => [
            t.visual,
            this.convertLinksToCommaSeparatedList(t.projectCategory),
            this.convertLinksToCommaSeparatedList(t.project),
            t.note_link,
            DateTime.fromISO(t.created).toFormat("DD"),
            t.completedDate,
            ])
            .limit(limit)
        );
    }

}