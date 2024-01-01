// const currDate = new Date()
// const currMonth = currDate.getMonth()
// const firstDate = new Date(currDate.getFullYear(), currMonth, 1)
// const lastDate = new Date(currDate.getFullYear(), currMonth + 1, 0)
// const lastDay = lastDate.getDate()
// const firstDay = firstDate.getDate()
// const firstDayWeekdayName = firstDate.getDay()

const datesContainer = document.querySelector(".calendar__dates-container");
// let loopDateRow = createNewDateRow();
const freeDaysArray = [0, 6];
const currDate = new Date();
const calendarArray = Array.from({ length: 12 }, mapFn);
function mapFn(v, i) {
  const monthArray = [[]];
  const firstDate = new Date(currDate.getFullYear(), i, 1);
  const lastDate = new Date(currDate.getFullYear(), i + 1, 0);
  const lastDay = lastDate.getDate();
  const firstDay = firstDate.getDate();
  const firstDayWeekdayName = firstDate.getDay();
  console.log(firstDayWeekdayName, i);
  for (let j = firstDay, loopWeekday = firstDayWeekdayName; j <= lastDay; j++) {
    const lastWeekArray = monthArray[monthArray.length - 1];
    console.log(loopWeekday);
    if (loopWeekday === 0) {
      loopDateRow = monthArray.push([]);
    }
    lastWeekArray.push({
      isFree: freeDaysArray.includes(loopWeekday),
      weekday: loopWeekday,
      date: new Date(currDate.getFullYear(), i, j),
    });
    loopWeekday = (loopWeekday + 1) % 7;
  }
  return monthArray;
}
console.log(calendarArray);
// for(let i = 0; i < 12; i++){
//   const currDate = new Date()
//   // const currMonth = currDate.getMonth()
//   const firstDate = new Date(currDate.getFullYear(), i, 1)
//   const lastDate = new Date(currDate.getFullYear(), i + 1, 0)
//   const lastDay = lastDate.getDate()
//   const firstDay = firstDate.getDate()
//   const firstDayWeekdayName = firstDate.getDay()
// }
// for(let i = firstDay, loopWeekday = firstDayWeekdayName; i < lastDay; i++){
//   if(loopWeekday === 0){
//     loopDateRow = createNewDateRow()
//   }
//   const firstChild
//   loopDateRow.appendChild()
//   loopWeekday = (loopWeekday + 1) % 6
// }

function createNewDateRow() {
  const dateRow = Document.createElementFromString(
    '<div class="calendar__dates-row"></div>'
  );
  datesContainer.appendChild(dateRow);
  return dateRow;
}
