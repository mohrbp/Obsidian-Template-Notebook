function renderTextField(frontmatterField) {
    const input = dv.el('input');
    input.type = 'text';

    // Event listener to update frontmatter field with entered text
    input.addEventListener('change', () => {
        const enteredText = input.value;
        let file = app.workspace.getActiveFile();
        app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter[frontmatterField] = enteredText;
        });
    });

    dv.span(input);
}

// Example usage:
let targetField = input.targetField;
renderTextField(targetField);