async function loadConfig (tp, dv){

let config = {
    categories : {}
}
// Load the configuration note
let configNote = dv.page("/01 Home/Notebook Config/Notebook Config");

configCategories = {...configNote};
configCategories = Object.keys(configCategories).reduce((filteredConfigCategories, key) => {
    if (key.startsWith("category")) {
        filteredConfigCategories[key] = configCategories[key];
    }
    return filteredConfigCategories;
}, {});

for (key in configCategories) {
    let catName = configCategories[key][0]["display"];
    config["categories"][catName] = {
        Name: catName,
        catNumber: key,
        Link: configCategories[key][0]
        // Add other properties here if needed
    };
};

// Output config
console.log("config:", config);
return config;
}

module.exports = loadConfig;