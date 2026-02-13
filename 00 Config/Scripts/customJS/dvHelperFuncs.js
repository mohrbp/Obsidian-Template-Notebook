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
            .where(t => t.link.subpath == "Tasks")
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
    // ADVANCED URI FUNCTIONS
    // ============================================================================

    /**
     * Get vault name from app
     */
    getVaultName() {
        return app.vault.getName();
    }

    /**
     * Create URI to update frontmatter field
     */
    createFrontmatterUri(notePath, frontmatterKey, value) {
        const vaultName = this.getVaultName();
        const encodedVault = encodeURIComponent(vaultName);
        const encodedPath = encodeURIComponent(notePath);
        const encodedKeyPath = encodeURIComponent(([frontmatterKey]));
        const encodedData = encodeURIComponent(JSON.stringify(value));

        return `obsidian://advanced-uri?vault=${encodedVault}&filepath=${encodedPath}&frontmatterkey=${encodedKeyPath}&data=${encodedData}`;
    }

    /**
     * Create URI to replace text in a file
     */
    createTextReplaceUri(notePath, searchText, replaceText) {
        const vaultName = this.getVaultName();
        const encodedVault = encodeURIComponent(vaultName);
        const encodedPath = encodeURIComponent(notePath);
        const encodedSearch = encodeURIComponent(searchText);
        const encodedReplace = encodeURIComponent(replaceText);

        return `obsidian://advanced-uri?vault=${encodedVault}&filepath=${encodedPath}&search=${encodedSearch}&replace=${encodedReplace}`;
    }

    /**
     * Create URI to run a Templater template
     * Note: Requires the file path to the Templater script
     */
    createTemplaterUri(templatePath, targetFolder = "", fileName = "") {
        const vaultName = this.getVaultName();
        const encodedVault = encodeURIComponent(vaultName);
        const encodedTemplate = encodeURIComponent(templatePath);
        
        let uri = `obsidian://advanced-uri?vault=${encodedVault}&filepath=${encodedTemplate}`;
        
        if (targetFolder) {
            uri += `&folder=${encodeURIComponent(targetFolder)}`;
        }
        
        if (fileName) {
            uri += `&filename=${encodeURIComponent(fileName)}`;
        }
        
        return uri;
    }

    /**
     * Get luxon from dataview (helper for creating URIs without dv parameter)
     */
    getLuxon() {
        // Access luxon from window.DataviewAPI if available
        if (window.DataviewAPI && window.DataviewAPI.luxon) {
            return window.DataviewAPI.luxon;
        }
        // Fallback - will be set in display functions
        return this._luxon || { DateTime: { now: () => ({ toFormat: () => new Date().toISOString() }) } };
    }

    // ============================================================================
    // TASK TEMPLATE VALIDATION
    // ============================================================================

    /**
     * Check if a note's noteType has Task Template in its leaf or branch templates
     * Returns object with { canCreateTask: boolean, taskTemplateInfo: object }
     */
    checkCanCreateTask(dv, parentNotePath) {
        const parentPage = dv.page(parentNotePath);
        
        if (!parentPage || !parentPage.noteType || !parentPage.noteType.path) {
            return { canCreateTask: false, taskTemplateInfo: null };
        }
        
        const parentNoteType = dv.page(parentPage.noteType.path);
        if (!parentNoteType) {
            return { canCreateTask: false, taskTemplateInfo: null };
        }
        
        // Check all numbered leaf and branch templates for Task Template
        let templateIndex = 1;
        
        // Check leaf templates
        while (parentNoteType[`leafTemplate${templateIndex}`]) {
            const template = parentNoteType[`leafTemplate${templateIndex}`];
            if (template && template.path && template.path.toLowerCase().includes('task')) {
                return {
                    canCreateTask: true,
                    taskTemplateInfo: {
                        templatePath: template.path,
                        templateDisplay: template.display || 'Task',
                        fieldName: 'leafTemplate',
                        index: templateIndex,
                        folderField: `leafFolder${templateIndex}`,
                        embedField: `leafEmbed${templateIndex}`
                    }
                };
            }
            templateIndex++;
        }
        
        // Check branch templates
        templateIndex = 1;
        while (parentNoteType[`branchTemplate${templateIndex}`]) {
            const template = parentNoteType[`branchTemplate${templateIndex}`];
            if (template && template.path && template.path.toLowerCase().includes('task')) {
                return {
                    canCreateTask: true,
                    taskTemplateInfo: {
                        templatePath: template.path,
                        templateDisplay: template.display || 'Task',
                        fieldName: 'branchTemplate',
                        index: templateIndex,
                        folderField: `branchFolder${templateIndex}`,
                        embedField: `branchEmbed${templateIndex}`
                    }
                };
            }
            templateIndex++;
        }
        
        return { canCreateTask: false, taskTemplateInfo: null };
    }

    // ============================================================================
    // COMPLETION URI FUNCTIONS
    // ============================================================================

    /**
     * Create completion URI for Task (note file)
     * Updates the 'completed' frontmatter field with current timestamp
     */
    createTaskCompletionUri(task) {
        const { DateTime } = this.getLuxon();
        const now = DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        return this.createFrontmatterUri(task.file.path, "completed", now);
    }

    /**
     * Create completion URI for Action (checkbox)
     * Replaces the checkbox line with checked version and completion date
     */
    createActionCompletionUri(action) {
        const { DateTime } = this.getLuxon();
        const today = DateTime.now().toFormat("yyyy-MM-dd");
        
        // Original text (unchecked)
        const searchText = `- [ ] ${action.text}`;
        
        // New text (checked with completion date)
        // Remove any existing date markers first
        let cleanText = action.text
            .replace(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})\s*/g, '')
            .trim();
        
        const replaceText = `- [x] ${cleanText} ✅ ${today}`;
        
        return this.createTextReplaceUri(action.path, searchText, replaceText);
    }

    // ============================================================================
    // SCHEDULING URI FUNCTIONS
    // ============================================================================

    /**
     * Create scheduling URI for Task (note file)
     * Updates the 'scheduled' frontmatter field with provided date
     */
    createTaskScheduleUri(task, scheduledDate) {
        return this.createFrontmatterUri(task.file.path, "scheduled", scheduledDate);
    }

    /**
     * Create scheduling URI for Action (checkbox)
     * Adds or updates the schedule date marker in the checkbox text
     */
    createActionScheduleUri(action, scheduledDate) {
        const searchText = `- [ ] ${action.text}`;
        
        // Remove any existing schedule markers
        let cleanText = action.text
            .replace(/([⌛⏳]) ?(\d{4}-\d{2}-\d{2})\s*/g, '')
            .trim();
        
        // Add new schedule marker
        const replaceText = `- [ ] ⏳ ${scheduledDate} ${cleanText}`;
        
        return this.createTextReplaceUri(action.path, searchText, replaceText);
    }

    /**
     * Create quick schedule URIs for common timeframes
     * Returns object with URIs for today, tomorrow, and next week
     */
    createQuickScheduleUris(item, isTask = true) {
        const { DateTime } = this.getLuxon();
        
        const today = DateTime.now().toFormat("yyyy-MM-dd");
        const tomorrow = DateTime.now().plus({ days: 1 }).toFormat("yyyy-MM-dd");
        const nextWeek = DateTime.now().plus({ days: 7 }).toFormat("yyyy-MM-dd");
        const nextMonth = DateTime.now().plus({ months: 1 }).toFormat("yyyy-MM-dd");
        
        if (isTask) {
            return {
                today: this.createTaskScheduleUri(item, today),
                tomorrow: this.createTaskScheduleUri(item, tomorrow),
                nextWeek: this.createTaskScheduleUri(item, nextWeek),
                nextMonth: this.createTaskScheduleUri(item, nextMonth)
            };
        } else {
            return {
                today: this.createActionScheduleUri(item, today),
                tomorrow: this.createActionScheduleUri(item, tomorrow),
                nextWeek: this.createActionScheduleUri(item, nextWeek),
                nextMonth: this.createActionScheduleUri(item, nextMonth)
            };
        }
    }

    /**
     * Create reschedule URIs for already scheduled items
     * Adds +1 day, +3 days, and +7 days options
     */
    createRescheduleUris(item, currentScheduledDate, isTask = true) {
        const { DateTime } = this.getLuxon();
        
        const currentDate = DateTime.fromISO(currentScheduledDate);
        const plusOneDay = currentDate.plus({ days: 1 }).toFormat("yyyy-MM-dd");
        const plusThreeDays = currentDate.plus({ days: 3 }).toFormat("yyyy-MM-dd");
        const plusSevenDays = currentDate.plus({ days: 7 }).toFormat("yyyy-MM-dd");
        
        if (isTask) {
            return {
                plusOne: this.createTaskScheduleUri(item, plusOneDay),
                plusThree: this.createTaskScheduleUri(item, plusThreeDays),
                plusSeven: this.createTaskScheduleUri(item, plusSevenDays)
            };
        } else {
            return {
                plusOne: this.createActionScheduleUri(item, plusOneDay),
                plusThree: this.createActionScheduleUri(item, plusThreeDays),
                plusSeven: this.createActionScheduleUri(item, plusSevenDays)
            };
        }
    }

    // ============================================================================
    // ACTION-TO-TASK CONVERSION URI FUNCTIONS
    // ============================================================================

    /**
     * Create link to open parent note for conversion
     * Since we can't pass parameters via Advanced URI to Templater easily,
     * we open the parent note where user can manually trigger conversion
     */
    createActionToTaskLink(dv, action) {
        // Just return a link to open the note containing the action
        // User will need to use a separate conversion command/template
        const parentPath = action.path;
        return `obsidian://open?vault=${encodeURIComponent(this.getVaultName())}&file=${encodeURIComponent(parentPath)}`;
    }

    /**
     * Store action data for conversion
     * This stores the action info so the Templater script can access it
     */
    storeActionForConversion(action) {
        // Store in window object for Templater to access
        window.pendingActionConversion = {
            text: action.text,
            path: action.path,
            scheduled: action.scheduledDate ? action.scheduledDate.toFormat("yyyy-MM-dd") : ""
        };
    }

    // ============================================================================
    // TASK FORWARDING URI FUNCTIONS
    // ============================================================================

    /**
     * Store task data for forwarding
     * This stores the task info so the Templater script can access it
     */
    storeTaskForForwarding(task) {
        window.pendingTaskForward = {
            path: task.file.path,
            currentParents: task.parent
        };
    }

    // ============================================================================
    // TABLE DISPLAY FUNCTIONS - ACTIONS
    // ============================================================================

    displayScheduledActionsTable(dv, title, actions, limit) {
        const { DateTime } = dv.luxon;
        this._luxon = dv.luxon;
        this._dv = dv;
        
        if (title) dv.header(3, title);
        
        let filteredActions = actions
            .filter(a => a.scheduledDate && !a.checked)
            .sort(a => a.scheduledDate, "asc");
            
        if (filteredActions.length === 0) return;
        
        dv.table(
            ["✓", "📅", "📝", "Action", "Scheduled", "Parent", "noteType", "noteBook", "Note", "Created"], 
            filteredActions
                .map(a => {
                    const reschedule = this.createRescheduleUris(
                        a, 
                        a.scheduledDate.toFormat("yyyy-MM-dd"), 
                        false
                    );
                    const rescheduleLinks = `[+1](${reschedule.plusOne}) [+3](${reschedule.plusThree}) [+7](${reschedule.plusSeven})`;
                    
                    // Check if parent can create tasks
                    const parentPath = a.path;
                    const taskCheck = this.checkCanCreateTask(dv, parentPath);
                    const conversionLink = taskCheck.canCreateTask 
                        ? `[→T](${a.noteLink.path}#conversion-${a.line})`  // Link to note with anchor
                        : "";
                    
                    return [
                        `[✓](${this.createActionCompletionUri(a)})`,
                        rescheduleLinks,
                        conversionLink,
                        a.visual,
                        a.scheduledDate.toFormat("DD"),
                        this.convertLinksToCommaSeparatedList(a.parent),
                        a.noteType,
                        a.noteBook,
                        a.noteLink,
                        DateTime.fromISO(a.created).toFormat("DD"),
                    ];
                })
                .slice(0, limit)
        );
    }

    displayUnscheduledActionsTable(dv, title, actions, limit) {
        const { DateTime } = dv.luxon;
        this._luxon = dv.luxon;
        this._dv = dv;
        
        if (title) dv.header(3, title);
        
        let filteredActions = actions
            .filter(a => !a.scheduledDate && !a.checked)
            .sort(a => DateTime.fromISO(a.created), "desc");
            
        if (filteredActions.length === 0) return;
        
        dv.table(
            ["✓", "📅", "📝", "Action", "Notebook", "Project", "Note", "Created"], 
            filteredActions
                .map(a => {
                    const schedule = this.createQuickScheduleUris(a, false);
                    const scheduleLinks = `[T](${schedule.today}) [Tm](${schedule.tomorrow}) [W](${schedule.nextWeek}) [M](${schedule.nextMonth})`;
                    
                    // Check if parent can create tasks
                    const parentPath = a.path;
                    const taskCheck = this.checkCanCreateTask(dv, parentPath);
                    const conversionLink = taskCheck.canCreateTask 
                        ? `[→T](${a.noteLink.path}#conversion-${a.line})`
                        : "";
                    
                    return [
                        `[✓](${this.createActionCompletionUri(a)})`,
                        scheduleLinks,
                        conversionLink,
                        a.visual,
                        this.convertLinksToCommaSeparatedList(a.noteBook),
                        this.convertLinksToCommaSeparatedList(a.parent),
                        a.noteLink,
                        DateTime.fromISO(a.created).toFormat("DD"),
                    ];
                })
                .slice(0, limit)
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
                .slice(0, limit)
        );
    }

    // ============================================================================
    // TABLE DISPLAY FUNCTIONS - TASKS
    // ============================================================================

    displayScheduledTasksTable(dv, title, tasks, limit) {
        const { DateTime } = dv.luxon;
        this._luxon = dv.luxon;
        this._dv = dv;
        
        if (title) dv.header(3, title);
        
        let filteredTasks = tasks
            .filter(t => t.scheduled && !t.completed)
            .sort(t => t.scheduledDate, "asc");
            
        if (filteredTasks.length === 0) return;
        
        dv.table(
            ["✓", "📅", "➡️", "Task", "Scheduled", "Status", "Priority", "Parent", "noteType", "noteBook", "Created"], 
            filteredTasks
                .map(t => {
                    const reschedule = this.createRescheduleUris(
                        t, 
                        t.scheduledDate.toFormat("yyyy-MM-dd"), 
                        true
                    );
                    const rescheduleLinks = `[+1](${reschedule.plusOne}) [+3](${reschedule.plusThree}) [+7](${reschedule.plusSeven})`;
                    
                    // Link to open task note with forwarding context
                    const forwardLink = `[→](${t.file.path}#forward)`;
                    
                    return [
                        `[✓](${this.createTaskCompletionUri(t)})`,
                        rescheduleLinks,
                        forwardLink,
                        t.visual,
                        t.scheduledDate.toFormat("DD"),
                        t.status || "",
                        t.priority || "",
                        this.convertLinksToCommaSeparatedList(t.parent),
                        t.noteType,
                        t.noteBook,
                        DateTime.fromISO(t.created).toFormat("DD"),
                    ];
                })
                .slice(0, limit)
        );
    }

    displayUnscheduledTasksTable(dv, title, tasks, limit) {
        const { DateTime } = dv.luxon;
        this._luxon = dv.luxon;
        this._dv = dv;
        
        if (title) dv.header(3, title);
        
        let filteredTasks = tasks
            .filter(t => !t.scheduled && !t.completed)
            .sort(t => DateTime.fromISO(t.created), "desc");
            
        if (filteredTasks.length === 0) return;
        
        dv.table(
            ["✓", "📅", "➡️", "Task", "Status", "Priority", "Notebook", "Project", "Created"], 
            filteredTasks
                .map(t => {
                    const schedule = this.createQuickScheduleUris(t, true);
                    const scheduleLinks = `[T](${schedule.today}) [Tm](${schedule.tomorrow}) [W](${schedule.nextWeek}) [M](${schedule.nextMonth})`;
                    
                    const forwardLink = `[→](${t.file.path}#forward)`;
                    
                    return [
                        `[✓](${this.createTaskCompletionUri(t)})`,
                        scheduleLinks,
                        forwardLink,
                        t.file.link,
                        t.status || "",
                        t.priority || "",
                        this.convertLinksToCommaSeparatedList(t.noteBook),
                        this.convertLinksToCommaSeparatedList(t.parent),
                        DateTime.fromISO(t.created).toFormat("DD"),
                    ];
                })
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

    isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }
}