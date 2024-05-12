---
note_type: page
projectCategory: "null"
project:
  - "[[04 Resources/Notebook/Notebook Dev/kanban/Dashboard/Dashboard.md|Dashboard]]"
people: 
topics: 
created: 2024-04-23T21:52
selectedEmotion: Comfortable
Mood: Peeved
selectedField: Button Title
energy_level: "6"
affect_level: "5"
---
# Notes

| Enraged     | Panicked     | Stressed     | Jittery      | Shocked   | Surprised | Upbeat     | Festive   | Exhilarated | Ecstatic     |
|-------------|--------------|--------------|--------------|-----------|-----------|------------|-----------|-------------|--------------|
| Livid       | Furious      | Frustrated   | Tense        | Stunned   | Hyper     | Cheerful   | Motivated | Inspired    | Elated       |
| Fuming      | Frightened   | Angry        | Nervous      | Restless  | Energized | Lively     | Excited   | Optimistic  | Enthusiastic |
| Anxious     | Apprehensive | Worried      | Irritated    | Annoyed   | Pleased   | Focused    | Happy     | Proud       | Thrilled     |
| Repulsed    | Troubled     | Concerned    | Uneasy       | Peeved    | Pleasant  | Joyful     | Hopeful   | Playful     | Blissful     |
| Disgusted   | Glum         | Disappointed | Down         | Apathetic | At Ease   | Easygoing  | Content   | Loving      | Fulfilled    |
| Pessimistic | Morose       | Discouraged  | Sad          | Bored     | Calm      | Secure     | Satisfied | Grateful    | Touched      |
| Alienated   | Miserable    | Lonely       | Disheartened | Tired     | Relaxed   | Chill      | Restful   | Blessed     | Balanced     |
| Despondent  | Depressed    | Sullen       | Exhausted    | Fatigued  | Mellow    | Thoughtful | Peaceful  | Comfortable | Carefree     |
| Despairing  | Hopeless     | Desolate     | Spent        | Drained   | Sleepy    | Complacent | Tranquil  | Cozy        | Serene       |

![[04 Resources/Notebook/Notebook Dev/kanban/Dashboard/notebook/attachments/MoodMeter.csv]]

``` dataviewjs
function renderButtonTable(csvData, frontmatterField) {
    const data = csvData.split('\n').map(row => row.split('\t'));
    const numRows = data.length;
    const numCols = data[0].length;

    const updateFrontmatter = (value) => {
        let file = app.workspace.getActiveFile();
        app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter[frontmatterField] = value;
        });
    };

    let markdownTable = '|';

    for (let i = 0; i < numRows; i++) {
        markdownTable += ' ';
        for (let j = 0; j < numCols; j++) {
            const item = data[i][j];
            const button = dv.el('button', item);
            button.onclick = () => updateFrontmatter(item);
            markdownTable += ` [${item}](javascript:updateFrontmatter('${item}')) |`;
        }
        markdownTable += '\n|';
    }

    return markdownTable;
}

// Example usage:
const csvData = `Enraged	Panicked	Stressed	Jittery	Shocked	Surprised	Upbeat	Festive	Exhilarated	Ecstatic
Livid	Furious	Frustrated	Tense	Stunned	Hyper	Cheerful	Motivated	Inspired	Elated
Fuming	Frightened	Angry	Nervous	Restless	Energized	Lively	Excited	Optimistic	Enthusiastic
Anxious	Apprehensive	Worried	Irritated	Annoyed	Pleased	Focused	Happy	Proud	Thrilled
Repulsed	Troubled	Concerned	Uneasy	Peeved	Pleasant	Joyful	Hopeful	Playful	Blissful
Disgusted	Glum	Disappointed	Down	Apathetic	At Ease	Easygoing	Content	Loving	Fulfilled
Pessimistic	Morose	Discouraged	Sad	Bored	Calm	Secure	Satisfied	Grateful	Touched
Alienated	Miserable	Lonely	Disheartened	Tired	Relaxed	Chill	Restful	Blessed	Balanced
Despondent	Depressed	Sullen	Exhausted	Fatigued	Mellow	Thoughtful	Peaceful	Comfortable	Carefree
Despairing	Hopeless	Desolate	Spent	Drained	Sleepy	Complacent	Tranquil	Cozy	Serene`;

// Render the button table
const markdownTable = renderButtonTable(csvData, "selectedEmotion");

console.log(markdownTable);


```

``` dataviewjs
function renderButtonAndUpdateFrontmatter(buttonTitle, frontmatterField) {
    const button = dv.el('button', buttonTitle);
    button.onclick = () => {
        let file = app.workspace.getActiveFile();
        app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter[frontmatterField] = buttonTitle;
        });
    };
    dv.span(button);
}

// Example usage:
renderButtonAndUpdateFrontmatter("Button Title", "selectedField");

```

```dataviewjs
    dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Enraged", "targetField": "Mood"})
```

``` dataviewjs
function renderButtonAndUpdateFrontmatter(buttonTitle, frontmatterField) {
    const button = dv.el('button', buttonTitle);
    
    // Check if the frontmatter object exists and if the associated frontmatter field is equivalent to the button title
    let file = app.workspace.getActiveFile();
    if (file.frontmatter && file.frontmatter[frontmatterField] === buttonTitle) {
        button.style.backgroundColor = 'lightgreen'; // Change the color of the button
    }

    button.onclick = () => {
        app.fileManager.processFrontMatter(file, (frontmatter) => {
            if (!frontmatter) {
                frontmatter = {}; // Initialize frontmatter object if it doesn't exist
            }
            frontmatter[frontmatterField] = buttonTitle;
        });
        // Update the color of the button after it's clicked
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.textContent === buttonTitle) {
                btn.style.backgroundColor = 'blue';
            } else {
                btn.style.backgroundColor = ''; // Reset color for other buttons
            }
        });
    };

    dv.span(button);
}

// Example usage:
renderButtonAndUpdateFrontmatter("Button Title", "selectedField");

```




|  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Enraged", "xValue" : "1", "yValue": "10", "targetField": "Mood", "selectedColor" : "#FF0055"})`   |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Panicked", "xValue" : "2", "yValue": "10", "targetField": "Mood", "selectedColor" : "#FF0055"})`   |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Stressed", "xValue" : "3", "yValue": "10", "targetField": "Mood", "selectedColor" : "#FF0055"})`   |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Jittery", "xValue" : "4", "yValue": "10", "targetField": "Mood", "selectedColor" : "#FF0055"})`   | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Shocked", "xValue" : "5", "yValue": "10", "targetField": "Mood", "selectedColor" : "#FF0055"})`  | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Surprised", "xValue" : "6", "yValue": "10", "targetField": "Mood", "selectedColor" : "#C0911B"})` |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Upbeat", "xValue" : "7", "yValue": "10", "targetField": "Mood", "selectedColor" : "#C0911B"})`   | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Festive", "xValue" : "8", "yValue": "10", "targetField": "Mood", "selectedColor" : "#C0911B"})`  | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Exhilarated", "xValue" : "9", "yValue": "10", "targetField": "Mood", "selectedColor" : "#C0911B"})` |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Ecstatic", "xValue" : "10", "yValue": "10", "targetField": "Mood", "selectedColor" : "#C0911B"})`   |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Livid", "xValue" : "1", "yValue": "9", "targetField": "Mood", "selectedColor" : "#FF0055"})`    |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Furious", "xValue" : "2", "yValue": "9", "targetField": "Mood", "selectedColor" : "#FF0055"})`    |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Frustrated", "xValue" : "3", "yValue": "9", "targetField": "Mood", "selectedColor" : "#FF0055"})`  |    `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Tense", "xValue" : "4", "yValue": "9", "targetField": "Mood", "selectedColor" : "#FF0055"})`     |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Stunned", "xValue" : "5", "yValue": "9", "targetField": "Mood", "selectedColor" : "#FF0055"})`  |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Hyper", "xValue" : "6", "yValue": "9", "targetField": "Mood", "selectedColor" : "#C0911B"})`    |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Cheerful", "xValue" : "7", "yValue": "9", "targetField": "Mood", "selectedColor" : "#C0911B"})`  | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Motivated", "xValue" : "8", "yValue": "9", "targetField": "Mood", "selectedColor" : "#C0911B"})` |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Inspired", "xValue" : "9", "yValue": "10", "targetField": "Mood", "selectedColor" : "#C0911B"})`   |    `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Elated", "xValue" : "10", "yValue": "9", "targetField": "Mood", "selectedColor" : "#C0911B"})`    |
|   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Fuming", "xValue" : "1", "yValue": "8", "targetField": "Mood", "selectedColor" : "#FF0055"})`    |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Frightened", "xValue" : "2", "yValue": "8", "targetField": "Mood", "selectedColor" : "#FF0055"})`  |    `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Angry", "xValue" : "3", "yValue": "8", "targetField": "Mood", "selectedColor" : "#FF0055"})`     |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Nervous", "xValue" : "4", "yValue": "8", "targetField": "Mood", "selectedColor" : "#FF0055"})`    | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Restless", "xValue" : "5", "yValue": "8", "targetField": "Mood", "selectedColor" : "#FF0055"})`  | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Energized", "xValue" : "6", "yValue": "8", "targetField": "Mood", "selectedColor" : "#C0911B"})`  |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Lively", "xValue" : "7", "yValue": "8", "targetField": "Mood", "selectedColor" : "#C0911B"})`   |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Excited", "xValue" : "8", "yValue": "8", "targetField": "Mood", "selectedColor" : "#C0911B"})`  |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Optimistic", "xValue" : "9", "yValue": "8", "targetField": "Mood", "selectedColor" : "#C0911B"})`  | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Enthusiastic", "xValue" : "10", "yValue": "8", "targetField": "Mood", "selectedColor" : "#C0911B"})` |
|   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Anxious", "xValue" : "1", "yValue": "7", "targetField": "Mood", "selectedColor" : "#FF0055"})`   | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Apprehensive", "xValue" : "2", "yValue": "7", "targetField": "Mood", "selectedColor" : "#FF0055"})` |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Worried", "xValue" : "3", "yValue": "7", "targetField": "Mood", "selectedColor" : "#FF0055"})`    |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Irritated", "xValue" : "4", "yValue": "7", "targetField": "Mood", "selectedColor" : "#FF0055"})`   |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Annoyed", "xValue" : "5", "yValue": "7", "targetField": "Mood", "selectedColor" : "#FF0055"})`  |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Pleased", "xValue" : "6", "yValue": "7", "targetField": "Mood", "selectedColor" : "#C0911B"})`   |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Focused", "xValue" : "7", "yValue": "7", "targetField": "Mood", "selectedColor" : "#C0911B"})`   |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Happy", "xValue" : "8", "yValue": "7", "targetField": "Mood", "selectedColor" : "#C0911B"})`   |    `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Proud", "xValue" : "9", "yValue": "7", "targetField": "Mood", "selectedColor" : "#C0911B"})`     |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Thrilled", "xValue" : "10", "yValue": "7", "targetField": "Mood", "selectedColor" : "#C0911B"})`   |
|  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Repulsed", "xValue" : "1", "yValue": "6", "targetField": "Mood", "selectedColor" : "#FF0055"})`   |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Troubled", "xValue" : "2", "yValue": "6", "targetField": "Mood", "selectedColor" : "#FF0055"})`   |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Concered", "xValue" : "3", "yValue": "6", "targetField": "Mood", "selectedColor" : "#FF0055"})`   |    `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Uneasy", "xValue" : "4", "yValue": "6", "targetField": "Mood", "selectedColor" : "#FF0055"})`    |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Peeved", "xValue" : "5", "yValue": "6", "targetField": "Mood", "selectedColor" : "#FF0055"})`   |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Pleasant", "xValue" : "6", "yValue": "6", "targetField": "Mood", "selectedColor" : "#C0911B"})`  |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Joyful", "xValue" : "7", "yValue": "6", "targetField": "Mood", "selectedColor" : "#C0911B"})`   |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Hopeful", "xValue" : "8", "yValue": "6", "targetField": "Mood", "selectedColor" : "#C0911B"})`  |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Playful", "xValue" : "9", "yValue": "6", "targetField": "Mood", "selectedColor" : "#C0911B"})`    |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Blissful", "xValue" : "10", "yValue": "6", "targetField": "Mood", "selectedColor" : "#C0911B"})`   |
|  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Disgusted", "xValue" : "1", "yValue": "5", "targetField": "Mood", "selectedColor" : "#5490F3"})`  |     `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Glum", "xValue" : "2", "yValue": "5", "targetField": "Mood", "selectedColor" : "#5490F3"})`     | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Disappointed", "xValue" : "3", "yValue": "5", "targetField": "Mood", "selectedColor" : "#5490F3"})` |     `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Down", "xValue" : "4", "yValue": "5", "targetField": "Mood", "selectedColor" : "#5490F3"})`     | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Apathetic", "xValue" : "5", "yValue": "5", "targetField": "Mood", "selectedColor" : "#5490F3"})` |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "At Ease", "xValue" : "6", "yValue": "5", "targetField": "Mood", "selectedColor" : "#487C2F"})`   | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Easygoing", "xValue" : "7", "yValue": "5", "targetField": "Mood", "selectedColor" : "#487C2F"})`  |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Content", "xValue" : "8", "yValue": "5", "targetField": "Mood", "selectedColor" : "#487C2F"})`  |    `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Loving", "xValue" : "9", "yValue": "5", "targetField": "Mood", "selectedColor" : "#487C2F"})`    |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Fulfilled", "xValue" : "10", "yValue": "5", "targetField": "Mood", "selectedColor" : "#487C2F"})`   |
| `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Pessimistic", "xValue" : "1", "yValue": "4", "targetField": "Mood", "selectedColor" : "#5490F3"})` |    `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Morose", "xValue" : "2", "yValue": "4", "targetField": "Mood", "selectedColor" : "#5490F3"})`    | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Discouraged", "xValue" : "3", "yValue": "4", "targetField": "Mood", "selectedColor" : "#5490F3"})`  |     `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Sad", "xValue" : "4", "yValue": "4", "targetField": "Mood", "selectedColor" : "#5490F3"})`      |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Bored", "xValue" : "5", "yValue": "4", "targetField": "Mood", "selectedColor" : "#5490F3"})`   |    `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Calm", "xValue" : "6", "yValue": "4", "targetField": "Mood", "selectedColor" : "#487C2F"})`    |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Secure", "xValue" : "7", "yValue": "4", "targetField": "Mood", "selectedColor" : "#487C2F"})`   | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Satisfied", "xValue" : "8", "yValue": "4", "targetField": "Mood", "selectedColor" : "#487C2F"})` |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Grateful", "xValue" : "9", "yValue": "4", "targetField": "Mood", "selectedColor" : "#487C2F"})`   |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Touched", "xValue" : "10", "yValue": "4", "targetField": "Mood", "selectedColor" : "#487C2F"})`    |
|  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Alienated", "xValue" : "1", "yValue": "3", "targetField": "Mood", "selectedColor" : "#5490F3"})`  |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Miserable", "xValue" : "2", "yValue": "3", "targetField": "Mood", "selectedColor" : "#5490F3"})`   |    `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Loney", "xValue" : "3", "yValue": "3", "targetField": "Mood", "selectedColor" : "#5490F3"})`     | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Disheartened", "xValue" : "4", "yValue": "3", "targetField": "Mood", "selectedColor" : "#5490F3"})` |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Tired", "xValue" : "5", "yValue": "3", "targetField": "Mood", "selectedColor" : "#5490F3"})`   |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Relaxed", "xValue" : "6", "yValue": "3", "targetField": "Mood", "selectedColor" : "#487C2F"})`   |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Chill", "xValue" : "7", "yValue": "3", "targetField": "Mood", "selectedColor" : "#487C2F"})`    |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Restful", "xValue" : "8", "yValue": "3", "targetField": "Mood", "selectedColor" : "#487C2F"})`  |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Blessed", "xValue" : "9", "yValue": "3", "targetField": "Mood", "selectedColor" : "#487C2F"})`    |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Balanced", "xValue" : "10", "yValue": "3", "targetField": "Mood", "selectedColor" : "#487C2F"})`   |
| `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Despondent", "xValue" : "1", "yValue": "2", "targetField": "Mood", "selectedColor" : "#5490F3"})`  |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Depressed", "xValue" : "2", "yValue": "2", "targetField": "Mood", "selectedColor" : "#5490F3"})`   |    `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Sullen", "xValue" : "3", "yValue": "2", "targetField": "Mood", "selectedColor" : "#5490F3"})`    |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Exhausted", "xValue" : "4", "yValue": "2", "targetField": "Mood", "selectedColor" : "#5490F3"})`   | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Fatigued", "xValue" : "5", "yValue": "2", "targetField": "Mood", "selectedColor" : "#5490F3"})`  |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Mellow", "xValue" : "6", "yValue": "2", "targetField": "Mood", "selectedColor" : "#487C2F"})`   | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Thoughtful", "xValue" : "7", "yValue": "2", "targetField": "Mood", "selectedColor" : "#487C2F"})` | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Peaceful", "xValue" : "8", "yValue": "2", "targetField": "Mood", "selectedColor" : "#487C2F"})`  | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Comfortable", "xValue" : "9", "yValue": "2", "targetField": "Mood", "selectedColor" : "#487C2F"})`  |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Carefree", "xValue" : "10", "yValue": "2", "targetField": "Mood", "selectedColor" : "#487C2F"})`   |
| `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Despairing", "xValue" : "1", "yValue": "1", "targetField": "Mood", "selectedColor" : "#5490F3"})`  |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Hopeless", "xValue" : "2", "yValue": "1", "targetField": "Mood", "selectedColor" : "#5490F3"})`   |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Desolate", "xValue" : "3", "yValue": "1", "targetField": "Mood", "selectedColor" : "#5490F3"})`   |    `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Spent", "xValue" : "4", "yValue": "1", "targetField": "Mood", "selectedColor" : "#5490F3"})`     |  `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Drained", "xValue" : "5", "yValue": "1", "targetField": "Mood", "selectedColor" : "#5490F3"})`  |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Sleepy", "xValue" : "6", "yValue": "1", "targetField": "Mood", "selectedColor" : "#487C2F"})`   | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Complacent", "xValue" : "7", "yValue": "1", "targetField": "Mood", "selectedColor" : "#487C2F"})` | `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Tranquil", "xValue" : "8", "yValue": "1", "targetField": "Mood", "selectedColor" : "#487C2F"})`  |   `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Tranquil", "xValue" : "9", "yValue": "1", "targetField": "Mood", "selectedColor" : "#487C2F"})`   |    `$= dv.view("04 Resources/notebook/Scripts/Dataview/frontmatterButton", {"buttonTitle": "Serene", "xValue" : "10", "yValue": "1", "targetField": "Mood", "selectedColor" : "#487C2F"})`    |


# Tasks