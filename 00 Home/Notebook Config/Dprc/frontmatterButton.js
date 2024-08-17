function renderButtonAndUpdateFrontmatter(buttonTitle, xValue, yValue, frontmatterField, selectedColor, deselectedColor) {    
    const button = dv.el('button', buttonTitle);

    // Check if the frontmatter object exists and if the associated frontmatter field is equivalent to the button title
    let file = app.workspace.getActiveFile();
    let frontmatterValue = '';
    if (dv.current()[frontmatterField]) {
        frontmatterValue = dv.current()[frontmatterField];
        console.log(frontmatterValue)
    }

    const onClickHandler = () => {
        app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter[frontmatterField] = buttonTitle;
            frontmatter["energy_level"] = yValue;
            frontmatter["affect_level"] = xValue;
        });
      //   Update the color of the button after it's clicked
       const container = document.querySelector(".cm-scroller");
        const buttons = container.querySelectorAll('button'); 
        buttons.forEach(btn => {
              if (btn.textContent === buttonTitle) {
                btn.style.backgroundColor = selectedColor;
            } else {
                btn.style.backgroundColor =  deselectedColor; // Reset color for other buttons
            }
        });
    };

    button.onclick = onClickHandler;

    // Update the color of the button after it's rendered
    if (frontmatterValue === buttonTitle) {
        button.style.backgroundColor = selectedColor;
    } else {
        button.style.backgroundColor = deselectedColor; // Reset color for other buttons
    }

    dv.span(button);

}

function getCSSVariableValue(variableName) {
    let rootStyle = getComputedStyle(document.documentElement);
    return rootStyle.getPropertyValue(variableName); // This is a CSS variable name, like '--my-background-color'.
}


// Button rendering:
let buttonTitle = input.buttonTitle;
let frontmatterField = input.targetField;
let xValue = input.xValue;
let yValue = input.yValue;
let selectedColor = input.selectedColor;
let deselectedColor = getCSSVariableValue('--background-color').trim()
renderButtonAndUpdateFrontmatter(buttonTitle, xValue, yValue, frontmatterField, selectedColor, deselectedColor);

