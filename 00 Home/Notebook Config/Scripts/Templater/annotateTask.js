async function annotateTask (tp, dv){

let annotation = "";
let selection = "";
let date = "";
// let peopleList = dv.pages(`"04 Resources/People"`).file;
do {
  selection = await tp.system.suggester(["schedule", "escape"], ["1", "2"]);
  
  if (selection == "1") {
    date = await tp.user.datePicker(tp);
     annotation = annotation + ("⌛") + " " + date + " ";
     break;
     } else if (selection == "2") {
    //  date = await tp.user.datePicker(tp);      
    // annotation = annotation + ("📆") + " " + date + " ";  
    // } else if (selection == "3") {      
    // annotation = annotation + await tp.system.suggester(["lab", "computer"], ["#🧪 ", "#💻 "]);     
    // } else if (selection == "4") {      
    // annotation = annotation + await tp.system.suggester(peopleList.name, peopleList.link);      
    // } else if (selection == "5") {            
        break;
        }
  }
while (selection);
return annotation;
}
  
module.exports = annotateTask;