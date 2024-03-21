// const currDate = new Date()
// const currMonth = currDate.getMonth()
// const firstDate = new Date(currDate.getFullYear(), currMonth, 1)
// const lastDate = new Date(currDate.getFullYear(), currMonth + 1, 0)
// const lastDay = lastDate.getDate()
// const firstDay = firstDate.getDate()
// const firstDayWeekdayName = firstDate.getDay()

const currDate = new Date();
let calendarArray;
let nonWorkingDays;
const datesContainer = document.querySelector(".calendar__dates-container");

async function a() {
  nonWorkingDays = await getNonWorkingDays();
  console.log(...nonWorkingDays);
  // let loopDateRow = createNewDateRow();
  // const nonWorkingDaysArray = [0, 6];
  calendarArray = Array.from({ length: 12 }, mapFn);

  renderCalendar();
}

a();

async function getNonWorkingDays() {
  const res = await fetch("/api/days_off");
  return await res.json();
}

function mapFn(v, i) {
  const monthArray = [[]];
  const firstDate = new Date(currDate.getFullYear(), i, 1);
  const lastDate = new Date(currDate.getFullYear(), i + 1, 0);
  const lastDay = lastDate.getDate();
  const firstDay = firstDate.getDate();
  const firstDayWeekdayName = firstDate.getDay();
  // console.log(firstDayWeekdayName, i);
  for (let j = firstDay, loopWeekday = firstDayWeekdayName; j <= lastDay; j++) {
    const lastWeekArray = monthArray[monthArray.length - 1];
    // console.log(loopWeekday);
    if (loopWeekday === 0) {
      loopDateRow = monthArray.push([]);
    }
    const indexInNonWorkingDaysArr = nonWorkingDays.findIndex(
      (date) => date.month === i + 1 && date.day === j
    );
    if (indexInNonWorkingDaysArr >= 0) {
      // console.log("aa", indexInNonWorkingDaysArr, Boolean(indexInNonWorkingDaysArr));
      nonWorkingDays.splice(indexInNonWorkingDaysArr, 1);
    }
    lastWeekArray.push({
      isNonWorking: indexInNonWorkingDaysArr >= 0,
      weekday: loopWeekday,
      date: new Date(currDate.getFullYear(), i, j),
    });
    loopWeekday = (loopWeekday + 1) % 7;
  }
  return monthArray;
}

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

function createNewTable(monthArray) {
  const dateRow = `
      ${monthArray.map(
        (week) =>
          `<div class="calendar__week">
        ${week.map(
          ({ isNonWorking, weekday, date: dateObj }) => `
            <div class="calendar__weekday ${
              isNonWorking ? "calendar__weekday--non-working" : ""
            }" data-day-of-the-month="${dateObj.getDate()}">
              ${dateObj.getDate()}
            </div>`
        ).join``}</div>`
      ).join``}
    <br>`;
  datesContainer.innerHTML = dateRow;
}

// calendarArray.forEach((arr) => {
//   createNewTable(arr);
// });

// currDate.getMonth

const monthNameElement = document.querySelector(".calendar__month-name");

let calendarPointer = currDate.getMonth();

function renderCalendar() {
  const firstDay = calendarArray[calendarPointer][0][0];
  const monthName = firstDay.date.toLocaleDateString("pl-PL", {
    month: "long",
  });
  console.log(calendarArray[calendarPointer]);
  createNewTable(calendarArray[calendarPointer]);
  monthNameElement.innerText = monthName;
}

document
  .querySelector(".calendar__right-arrow")
  .addEventListener("click", () => {
    calendarPointer = (calendarPointer + 1) % 12;
    renderCalendar();
  });

document
  .querySelector(".calendar__left-arrow")
  .addEventListener("click", () => {
    calendarPointer = (12 + calendarPointer - 1) % 12;
    renderCalendar();
  });

window.addEventListener("click", async (e) => {
  const element = e.target;
  if (element.classList.contains("calendar__weekday")) {
    const date = `${calendarPointer + 1}/${element.dataset.dayOfTheMonth}`;
    console.log("/api/days_off/" + date);

    const isNonWorking = element.classList.toggle(
      "calendar__weekday--non-working"
    );
    const x = await fetch("/api/days_off", {
      method: isNonWorking ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dates: [
          { month: calendarPointer + 1, day: element.dataset.dayOfTheMonth },
        ],
      }),
    });
    console.log(isNonWorking);
    // const isNonWorking = element.classList.contains("calendar__weekday--nonWorking");
  }
});

function getEveryDay(dayIndex) {
  const currDate = new Date();
  const firstDateOfTheYear = new Date(currDate.getFullYear(), 0, 1);
  const currYear = currDate.getFullYear();
  const daysTillFirstDay =
    dayIndex - firstDateOfTheYear.getDay() > 0
      ? dayIndex - firstDateOfTheYear.getDay()
      : dayIndex - firstDateOfTheYear.getDay() + 7;
  console.log(daysTillFirstDay);
  const theDay = new Date(
    currDate.getFullYear(),
    0,
    firstDateOfTheYear.getDate() + daysTillFirstDay
  );
  const arrayOfDays = [];
  console.log(theDay.getFullYear());
  while (theDay.getFullYear() === currYear) {
    arrayOfDays.push({ month: theDay.getMonth() + 1, day: theDay.getDate() });
    theDay.setDate(theDay.getDate() + 7);
  }
  return arrayOfDays;
}

async function removeRecurrentNonWorkingDays(dayIndex) {
  const dates = getEveryDay(dayIndex);
  fetch("/api/days_off", {
    method: "DELETE",
    Accept: "application/json",
    body: { dates },
  });
}

async function insertRecurrentNonWorkingDays(dayIndex) {
  const dates = getEveryDay(dayIndex);
  fetch("/api/days_off", {
    method: "POST",
    Accept: "application/json",
    body: { dates },
  });
  // await getEveryDay("POST", dayIndex);
}

const dialog = document.querySelector(".dialog");

const alertText = document.querySelector(".alert-text");

const weekdaySelector = document.querySelector(".weekday-selector");

const operationSelector = document.querySelector(".operation-selector");

let pendingOperation;

document.querySelector(".open-dialog").addEventListener("click", () => {
  // dialogChangeText =
  const selectedWeekdayElement = weekdaySelector.querySelector(
    `option[value="${weekdaySelector.value}"]`
  );
  const selectedOperationElement = operationSelector.querySelector(
    `option[value="${operationSelector.value}"]`
  );

  const weekdayName = selectedWeekdayElement.innerText;
  const selectedOperation = selectedOperationElement.innerText;
  alertText.innerText = ` ustalić wszystkie ${weekdayName} jako dni ${selectedOperation}?`;
  dialog.showModal();
  pendingOperation = async function () {
    const dates = getEveryDay(+weekdaySelector.value);
    console.log(dates, weekdaySelector.value);
    await fetch("/api/days_off", {
      method: operationSelector.value,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dates }),
    });
    location.reload();
  };
});

const submitOperation = document.querySelector(".submit-operation");
const cancelOperation = document.querySelector(".cancel-operation");

cancelOperation.addEventListener("click", () => {
  dialog.close();
});

submitOperation.addEventListener("click", async () => {
  await pendingOperation();
  dialog.close();
});

// function createNewDateRow(calendarArray[0]) {
// const dateRow = Document.createElementFromString(
//   '<div class="calendar__dates-row"></div>'
// );
//   datesContainer.appendChild(dateRow);
//   return dateRow;
// }
