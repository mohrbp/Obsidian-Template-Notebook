function renderTimeDropdown(frontmatterField) {
    const select = dv.el('select');

    // Add empty option as default
    const defaultOption = dv.el('option', '--');
    defaultOption.value = '';
    select.appendChild(defaultOption);

    // Populate select dropdown with 24-hour time format options
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const hourString = hour.toString().padStart(2, '0'); // Ensure two-digit format for hour
            const minuteString = minute.toString().padStart(2, '0'); // Ensure two-digit format for minute
            const option = dv.el('option', `${hourString}:${minuteString}`);
            option.value = `${hourString}:${minuteString}`;
            select.appendChild(option);
        }
    }

    // Event listener to update frontmatter field with selected time
    select.addEventListener('change', () => {
        const selectedTime = select.value;
        let file = app.workspace.getActiveFile();
        app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter[frontmatterField] = selectedTime;
        });
    });

    dv.span(select);
}

// Example usage:
let targetField = input.targetField;
renderTimeDropdown(targetField);