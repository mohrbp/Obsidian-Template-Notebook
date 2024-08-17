async function datePicker(tp)
{
	let resultDate = ""
let myformat = "DD MMMM YYYY"
let resultFormat = "YYYY-MM-DD"

let dateString = await tp.system.suggester(["(write date)", "today", "tomorrow", "> weekday", "> calendar"], ["(write date)", "today", "tomorrow", "> weekday", "> calendar"])
if (dateString != null) {

if (dateString == "today") {
	resultDate = tp.date.now()

}  else if (dateString == "tomorrow") {
	resultDate = tp.date.tomorrow()

}  else if (dateString == "> weekday") {
	let weekday = await tp.system.suggester(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], [1, 2, 3, 4, 5, 6, 0])
	if (weekday != null) {
		let offset = weekday - tp.date.now("d")
		if (offset <= 0) { offset =  offset + 7 }
		resultDate = tp.date.now("YYYY-MM-DD", offset)
	}

}  else if (dateString == "> calendar") {
	let thisYear = Number(tp.date.now("YYYY"))
	let yearList = []
	for (let  i= 0; i < 10; i++) {
	    yearList.push(thisYear + i)
	}
let year = await tp.system.suggester(yearList, yearList)

if (year != null) {

	let month = await tp.system.suggester(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

	if (month != null) {

		let daysInMonth = new Date(year, month, 0).getDate();
		let dateList = []
		for (let i = 1; i <= daysInMonth; i++) {
			dateList.push(i)
		}
		
		const getDateString = (year, month, date) => {
			const dateStringFix = (num) => {
			    if (num < 10) {
				      return "0" + num
				} else return "" + num
			}
		    return year + "-" + dateStringFix(month) + "-" + dateStringFix(date)
	    }
	    
		let dateListString = dateList.map(d => {
			let rawString =  getDateString(year, month, d)
			let weekdayString = tp.date.now("d", 0, rawString, "YYYY-MM-DD")
			let resultString = tp.date.now("DD MMMM — dd", 0, rawString, "YYYY-MM-DD")
			if (weekdayString == 0) {
				resultString = resultString + "   ________________________________________________________"
			}
			return resultString
		})
		let date = await tp.system.suggester(dateListString, dateList)
		
		if (date != null) {	
			resultDate = getDateString(year, month, date)
		}}} 

} else if (dateString == "(write date)") {
	dateString = await tp.system.prompt("Date format: " + myformat)
	resultDate = tp.date.now("YYYY-MM-DD", 0, dateString, myformat)
	if (resultDate == "Invalid date") {
		resultDate = ""
}}}

if (resultDate != "") {
resultDate = tp.date.now(resultFormat, 0, resultDate)
}
	return resultDate;
}
module.exports = datePicker;

