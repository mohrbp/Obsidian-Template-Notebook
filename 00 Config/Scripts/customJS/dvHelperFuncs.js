class dvHelperFuncs {

    // ============================================================================
    // CORE DATA LOADING FUNCTIONS - Using traverseNotebook for both
    // ============================================================================

    /**
     * Load all Actions (checkboxes) from target note and its children
     * Uses traverseNotebook with 'child' strategy
     */
    async loadActions(dv, notebookManager, target) {
        let targetNote = notebookManager.createNoteObject(dv, target.path);
        let nestedInput = {
            parent: [targetNote]
        };
        
        // Get all child notes recursively using traverseNotebook
        let allChildNotes = await notebookManager.traverseNotebook(dv, nestedInput, {
            recursive: true,
            includeSource: true,
            formatOutput: false,
            traversalType: 'child'
        });

        // Flatten the notes from all categories and extract paths
        let notePaths = Object.values(allChildNotes)
            .flat()
            .map(note => note.page?.file?.path)
            .filter(Boolean);

        // Return all tasks from these notes that are in the "Tasks" section
        return dv.pages()
            .file
            .filter(p => notePaths.includes(p.path))
            .tasks
            // .where(t => t.link.subpath == "Tasks")
            .where(t => !t.hasOwnProperty("parent"));
    }

    /**
     * Load all Tasks (note files) that have the target in their parent field
     * Uses traverseNotebook with 'task_children' strategy
     */
    async loadTasks(dv, notebookManager, target) {
        let targetNote = notebookManager.createNoteObject(dv, target.path);
        let nestedInput = {
            parent: [targetNote]
        };
        
        // Use traverseNotebook with task_children strategy
        let taskNotes = await notebookManager.traverseNotebook(dv, nestedInput, {
            recursive: false,  // Tasks are direct children only (not recursive)
            includeSource: false,
            formatOutput: false,
            traversalType: 'task_children'
        });

        // Flatten and return as array of pages
        return Object.values(taskNotes)
            .flat()
            .map(note => note.page)
            .filter(Boolean);
    }

    // ============================================================================
    // GTD PROCESSING FUNCTIONS
    // ============================================================================

    /**
     * Arrange and format Actions for GTD workflow
     * Note: addFrontmatterToTask should be called BEFORE this function
     */
    arrangeActionsForGTD(dv, actions, currentTime) {
        const { DateTime } = dv.luxon;  

        let recentLow = 1;
        let recentMid = 3;
        let recentHigh = 7;

        const red = "<span style='border-left: 3px solid red;'>&nbsp;</span>";
        const blue = "<span style='border-left: 3px solid rgb(39, 117, 182);'>&nbsp;</span>";
        const green = "<span style='border-left: 3px solid green;'>&nbsp;</span>";

        for (let action of actions) {
            action.visual = action.text;

            // Handle completed actions
            if (action.checked === true && action.text.match(/([✅]) ?(\d{4}-\d{2}-\d{2})/) != null) {
                let dateMatch = action.text.match(/([✅]) ?(\d{4}-\d{2}-\d{2})/)[2];
                action.completedDate = DateTime.fromISO(dateMatch);
                action.visual = action.visual.replace(/([✅]) ?(\d{4}-\d{2}-\d{2})/, "");
            }

            // Handle scheduled actions
            if (action.text.match(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/) != null) {
                let dateMatch = action.text.match(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/)[2];
                action.scheduledDate = DateTime.fromISO(dateMatch);
                action.timeUntilScheduled = Math.round(action.scheduledDate.diff(currentTime, "days").as("minutes"));
                
                if (action.timeUntilScheduled < 0) {
                    action.color = red;
                    action.timing = "overdue";
                } else if (action.timeUntilScheduled < (1440 * recentLow)) {
                    action.color = green;
                    action.timing = "due";
                } else if (action.timeUntilScheduled < (1440 * recentMid)) {
                    action.color = blue;
                    action.timing = "upcoming";
                } else if (action.timeUntilScheduled < (1440 * recentHigh)) {
                    action.timing = "future";
                    action.color = "";
                }
                
                if (action.checked === false) {
                    action.visual = action.color + action.visual.replace(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/, "");
                } else {
                    action.visual = action.visual.replace(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})/, "");
                }
            }
        }
    }

    /**
     * Arrange and format Tasks (note files) for GTD workflow
     */
    arrangeTasksForGTD(dv, tasks, currentTime) {
        const { DateTime } = dv.luxon;  

        let recentLow = 1;
        let recentMid = 3;
        let recentHigh = 7;

        const red = "<span style='border-left: 3px solid red;'>&nbsp;</span>";
        const blue = "<span style='border-left: 3px solid rgb(39, 117, 182);'>&nbsp;</span>";
        const green = "<span style='border-left: 3px solid green;'>&nbsp;</span>";

        for (let task of tasks) {
            task.visual = task.file.link;

            // Handle completed tasks
            if (task.completed) {
                task.completedDate = DateTime.fromISO(task.completed);
            }

            // Handle scheduled tasks
            if (task.scheduled) {
                task.scheduledDate = DateTime.fromISO(task.scheduled);
                task.timeUntilScheduled = Math.round(task.scheduledDate.diff(currentTime, "days").as("minutes"));
                
                if (task.timeUntilScheduled < 0) {
                    task.color = red;
                    task.timing = "overdue";
                } else if (task.timeUntilScheduled < (1440 * recentLow)) {
                    task.color = green;
                    task.timing = "due";
                } else if (task.timeUntilScheduled < (1440 * recentMid)) {
                    task.color = blue;
                    task.timing = "upcoming";
                } else if (task.timeUntilScheduled < (1440 * recentHigh)) {
                    task.timing = "future";
                    task.color = "";
                }
                
                task.visual = task.color + " " + task.file.link;
            }
        }
    }

    // ============================================================================
    // TABLE DISPLAY FUNCTIONS - ACTIONS
    // ============================================================================

    displayScheduledActionsTable(dv, title, actions, limit) {
        const { DateTime } = dv.luxon;  
        
        if (title) dv.header(3, title);
        
        let filteredActions = actions
            .filter(a => a.scheduledDate && !a.checked)
            .sort(a => a.scheduledDate, "asc");
            
        if (filteredActions.length === 0) return;
        
        dv.table(
            ["Action", "Scheduled", "Parent", "noteType", "noteBook", "Note", "Created"], 
            filteredActions
                .map(a => [
                    a.visual,
                    a.scheduledDate.toFormat("DD"),
                    this.convertLinksToCommaSeparatedList(a.parent),
                    a.noteType,
                    a.noteBook,
                    a.noteLink,
                    DateTime.fromISO(a.created).toFormat("DD"),
                ])
                .limit(limit)
        );
    }

    displayUnscheduledActionsTable(dv, title, actions, limit) {
        const { DateTime } = dv.luxon;
        
        if (title) dv.header(3, title);
        
        let filteredActions = actions
            .filter(a => !a.scheduledDate && !a.checked)
            .sort(a => DateTime.fromISO(a.created), "desc");
            
        if (filteredActions.length === 0) return;
        
        dv.table(
            ["Action", "Notebook", "Project", "Note", "Created"], 
            filteredActions
                .map(a => [
                    a.visual,
                    this.convertLinksToCommaSeparatedList(a.noteBook),
                    this.convertLinksToCommaSeparatedList(a.parent),
                    a.noteLink,
                    DateTime.fromISO(a.created).toFormat("DD"),
                ])
                .limit(limit)
        );
    }

    displayCompletedActionsTable(dv, title, actions, limit) {
        const { DateTime } = dv.luxon;
        
        if (title) dv.header(3, title);
        
        let filteredActions = actions
            .filter(a => a.checked && a.completedDate)
            .sort(a => a.completedDate, "desc");
            
        if (filteredActions.length === 0) return;
        
        dv.table(
            ["Action", "Notebook", "Project", "Note", "Created", "Completed"],
            filteredActions
                .map(a => [
                    a.visual,
                    this.convertLinksToCommaSeparatedList(a.noteBook),
                    this.convertLinksToCommaSeparatedList(a.parent),
                    a.noteLink,
                    DateTime.fromISO(a.created).toFormat("DD"),
                    a.completedDate.toFormat("DD"),
                ])
                .limit(limit)
        );
    }

    // ============================================================================
    // TABLE DISPLAY FUNCTIONS - TASKS
    // ============================================================================

    displayScheduledTasksTable(dv, title, tasks, limit) {
        const { DateTime } = dv.luxon;  
        
        if (title) dv.header(3, title);
        
        let filteredTasks = tasks
            .filter(t => t.scheduled && !t.completed)
            .sort(t => t.scheduledDate, "asc");
            
        if (filteredTasks.length === 0) return;
        
        dv.table(
            ["Task", "Scheduled", "Status", "Priority", "Parent", "noteType", "noteBook", "Created"], 
            filteredTasks
                .map(t => [
                    t.visual,
                    t.scheduledDate.toFormat("DD"),
                    t.status || "",
                    t.priority || "",
                    this.convertLinksToCommaSeparatedList(t.parent),
                    t.noteType,
                    t.noteBook,
                    DateTime.fromISO(t.created).toFormat("DD"),
                ])
                .slice(0, limit)
        );
    }

    displayUnscheduledTasksTable(dv, title, tasks, limit) {
        const { DateTime } = dv.luxon;
        
        if (title) dv.header(3, title);
        
        let filteredTasks = tasks
            .filter(t => !t.scheduled && !t.completed)
            .sort(t => DateTime.fromISO(t.created), "desc");
            
        if (filteredTasks.length === 0) return;
        
        dv.table(
            ["Task", "Status", "Priority", "Notebook", "Project", "Created"], 
            filteredTasks
                .map(t => [
                    t.file.link,
                    t.status || "",
                    t.priority || "",
                    this.convertLinksToCommaSeparatedList(t.noteBook),
                    this.convertLinksToCommaSeparatedList(t.parent),
                    DateTime.fromISO(t.created).toFormat("DD"),
                ])
                .slice(0, limit)
        );
    }

    displayCompletedTasksTable(dv, title, tasks, limit) {
        const { DateTime } = dv.luxon;
        
        if (title) dv.header(3, title);
        
        let filteredTasks = tasks
            .filter(t => t.completed)
            .sort(t => t.completedDate, "desc");
            
        if (filteredTasks.length === 0) return;
        
        dv.table(
            ["Task", "Status", "Priority", "Project", "Created", "Completed"],
            filteredTasks
                .map(t => [
                    t.file.link,
                    t.status || "",
                    t.priority || "",
                    this.convertLinksToCommaSeparatedList(t.parent),
                    DateTime.fromISO(t.created).toFormat("DD"),
                    t.completedDate.toFormat("DD"),
                ])
                .slice(0, limit)
        );
    }

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    addFrontmatterToAction(dv, task) {
        if (dv.page(task.path) && dv.page(task.path).file) {
            const page = dv.page(task.path).file;
            const frontmatter = page.frontmatter;
            task.created = frontmatter.created || task.created;
            task.modified = page.mtime || task.modified;
            task.noteBook = frontmatter.noteBook || task.noteBook;
            task.parent = frontmatter.parent || task.parent;
            task.noteType = frontmatter.noteType || task.noteType;
            task.noteLink = page.link || task.noteLink;
        }
    }

    convertLinksToCommaSeparatedList(text) {
        if (!text) return '';
        
        if (Array.isArray(text)) {
            return text
                .map(item => {
                    if (typeof item === 'object' && item.path) {
                        return `[[${item.path}]]`;
                    }
                    return String(item);
                })
                .join(', ');
        }
        
        const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const wikiRegex = /\[\[([^\]]+)\]\]/g;
        const linksArray = [];

        let markdownMatch;
        while ((markdownMatch = markdownRegex.exec(text)) !== null) {
            const linkText = markdownMatch[1];
            const linkUrl = markdownMatch[2];
            linksArray.push(`[${linkText}](${linkUrl})`);
        }

        let wikiMatch;
        while ((wikiMatch = wikiRegex.exec(text)) !== null) {
            const wikiLink = wikiMatch[1];
            linksArray.push(`[[${wikiLink}]]`);
        }

        return linksArray.length > 0 ? linksArray.join(', ') : String(text);
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
            )
        }   
}