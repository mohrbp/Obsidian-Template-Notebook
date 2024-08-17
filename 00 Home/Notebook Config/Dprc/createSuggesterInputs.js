async function createSuggesterInputs (dv, inputData, config,  prefix = null) {
    // Function to create suggester inputs

    let inputSug = [], inputVal = []; 
    for (let cat in inputData) {

        inputCatName = cat;
        inputValNote = inputCatName;
        console.log(inputData, cat)
        headerNote = {};


        if (inputData[cat].length > 0) {
                headerNote[cat] = [];
                let inputNote = inputData[cat][0];

            if (prefix && prefix == "Root") {

                inputCatName = prefix + " " + cat;

                let inputCatNotePath = inputNote["noteType"]["path"]
                let page = dv.page(inputCatNotePath)

                let inputCatNote = {
                    Name: page.file.name,
                    Path: page.file.path,
                    Page: page,
                    Link: inputNote["noteType"],
                    noteType: inputNote["noteType"],
                    Folder: page.folder,
                }
                headerNote[cat].push(inputCatNote)
                inputValNote = headerNote;

            } else if (prefix && prefix == "Selected") { 

                inputCatName = prefix + " " + cat + " " + inputNote["Name"];

                headerNote[cat].push(inputNote)
                inputValNote = headerNote;
                inputData[cat].shift()
            } 

            inputData[cat].forEach(note => {
                inputSug.push(note["Name"]);
                inputVal.push({ [cat]: [note] });
            });
        }

        inputSug.unshift(inputCatName);
        inputVal.unshift(inputValNote);       
    }
    console.log(inputSug, inputVal)    
    return { inputSug, inputVal };
};
module.exports = createSuggesterInputs;