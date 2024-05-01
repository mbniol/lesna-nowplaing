const parser = new DOMParser();

Document.prototype.createElementFromString = function (str) {
  const element = parser.parseFromString(str, "text/html");
  const child = element.documentElement.querySelector("body").firstChild;
  return child;
};

const currDate = new Date();
let calendar;
let daysOff;
const datesContainer = document.querySelector(".calendar__dates-container");

(async function init() {
  daysOff = await getDaysOff();
  calendar = Array.from({ length: 12 }, createMonthObject);
  console.log(calendar, daysOff);
  renderCalendar();
})();

async function getDaysOff() {
  const res = await fetch("/api/days_off");
  return await res.json();
}

function createMonthObject(v, i) {
  const firstDay = new Date(currDate.getFullYear(), i, 1);
  const lastDay = new Date(currDate.getFullYear(), i + 1, 0);
  const monthName = firstDay.toLocaleDateString("pl-PL", {
    month: "long",
  });
  const month = { name: monthName, weeks: [[]] };
  const firstDayName = firstDay.getDay();
  for (
    let j = firstDay.getDate(), loopWeekday = firstDayName;
    j <= lastDay.getDate();
    j++
  ) {
    const lastWeekArray = month.weeks.at(-1);
    if (loopWeekday === 0 && j !== lastDay.getDate()) {
      loopDateRow = month.weeks.push([]);
    }
    const indexInDaysOffArr = daysOff.findIndex(
      (date) => date.month === i + 1 && date.day === j
    );
    if (indexInDaysOffArr >= 0) {
      daysOff.splice(indexInDaysOffArr, 1);
    }
    lastWeekArray.push({
      isOff: indexInDaysOffArr >= 0,
      date: new Date(currDate.getFullYear(), i, j),
    });
    loopWeekday = (loopWeekday + 1) % 7;
  }
  return month;
}

const monthNameElement = document.querySelector(".calendar__month-name");

let currMonth = currDate.getMonth();

const calendarGrid = document.querySelector(".calendar__grid");

function renderCalendar() {
  calendar.forEach((month, i) => {
    const monthGrid = document.createElementFromString(
      `<div class='calendar__month' data-month-index="${i}"></div>`
    );
    month.element = monthGrid;
    month.weeks.forEach((week) => {
      const weekRow = document.createElementFromString(
        `<div class="calendar__week"></div>`
      );
      week.forEach((day) => {
        const dayOfTheMonth = day.date.getDate();
        const dayCell = document.createElementFromString(
          `<div class="calendar__weekday ${
            day.isOff ? "calendar__weekday--non-working" : ""
          }" >${dayOfTheMonth}`
        );
        day.element = dayCell;
        weekRow.appendChild(dayCell);
      });
      monthGrid.appendChild(weekRow);
    });
    calendarGrid.appendChild(monthGrid);
  });
  calendar[currMonth].element.classList.add("calendar__month--visible");
  monthNameElement.innerText = calendar[currMonth].name;
}

document
  .querySelector(".calendar__right-arrow")
  .addEventListener("click", goToNextMonth);

function goToNextMonth() {
  const nextMonth = (currMonth + 1) % 12;
  calendar[currMonth].element.classList.remove("calendar__month--visible");
  calendar[nextMonth].element.classList.add("calendar__month--visible");
  currMonth = nextMonth;
  monthNameElement.innerText = calendar[currMonth].name;
}

document
  .querySelector(".calendar__left-arrow")
  .addEventListener("click", goToPreviousMonth);

function goToPreviousMonth() {
  const prevMonth = (12 + currMonth - 1) % 12;
  calendar[currMonth].element.classList.remove("calendar__month--visible");
  calendar[prevMonth].element.classList.add("calendar__month--visible");
  currMonth = prevMonth;
  monthNameElement.innerText = calendar[currMonth].name;
}

window.addEventListener("click", async (e) => {
  const element = e.target;
  const clickedOnCell = element.classList.contains("calendar__weekday");
  if (clickedOnCell) {
    const isDayOff = element.classList.toggle("calendar__weekday--non-working");
    await fetch("/api/days_off", {
      method: isDayOff ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dates: [{ month: currMonth + 1, day: element.innerText }],
      }),
    });
  }
});

const dialog = document.querySelector(".dialog");

const alertText = document.querySelector(".alert-text");

const weekdaySelector = document.querySelector(".weekday-selector");

const typeSelector = document.querySelector(".type-selector");

let pendingOperation;

document.querySelector(".open-dialog").addEventListener("click", () => {
  const selectedWeekday = +weekdaySelector.value;
  const selectedWeekdayElement = weekdaySelector.querySelector(
    `option[value="${selectedWeekday}"]`
  );
  const selectedType = typeSelector.value;
  const selectedOperationElement = typeSelector.querySelector(
    `option[value="${selectedType}"]`
  );

  const weekdayName = selectedWeekdayElement.innerText;
  const selectedOperation = selectedOperationElement.innerText;
  alertText.innerText = ` ustalić wszystkie ${weekdayName} jako dni ${selectedOperation}?`;
  dialog.showModal();
  pendingOperation = modifyDaysOfIndex(selectedWeekday, selectedType);
  console.log(pendingOperation);
});

class OperationEnum {
  static "non-working" = "POST";
  static working = "DELETE";
}

function modifyDaysOfIndex(weekday, type) {
  return async function () {
    const days = getDaysOfIndex(weekday);
    const dates = days.map(({ date }) => ({
      day: date.getDate(),
      month: date.getMonth() + 1,
    }));
    await fetch("/api/days_off", {
      method: OperationEnum[type],
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dates,
      }),
    });
    updateCalendar(days, type);
  };
}

function getDaysOfIndex(index) {
  const daysOfIndex = [];
  calendar.forEach((month) => {
    month.weeks.forEach((week) => {
      const theDay = week.find(({ date }) => index === date.getDay());
      if (theDay) {
        daysOfIndex.push(theDay);
      }
      //week[(7 + dayIndex - 1) % 7]
    });
  });
  return daysOfIndex;
}

function updateCalendar(days, type) {
  days.forEach((day) => {
    day.isOff = type === "non-working";
    if (day.isOff) {
      day.element.classList.add("calendar__weekday--non-working");
    } else {
      day.element.classList.remove("calendar__weekday--non-working");
    }
  });
}

const submitOperation = document.querySelector(".submit-operation");
const cancelOperation = document.querySelector(".cancel-operation");

cancelOperation.addEventListener("click", () => {
  dialog.close();
});

submitOperation.addEventListener("click", async () => {
  await pendingOperation();
  dialog.close();
});

const wholeMonthOff = document.querySelector(".whole-month-off");
const resetCalendarButton = document.querySelector(".reset-calendar");

wholeMonthOff.addEventListener("click", () => {
  alertText.innerText = `ustalić ${calendar[currMonth].name} jako miesiąc wolny od zajęć`;
  dialog.showModal();
  pendingOperation = makeWholeMonthOff;
});

async function makeWholeMonthOff() {
  const currMonthDays = calendar[currMonth].weeks.flat();
  const dates = [];
  for (let i = 0; i < currMonthDays.length; i++) {
    currMonthDays[i].isOff = true;
    currMonthDays[i].element.classList.add("calendar__weekday--non-working");
    dates.push({ month: currMonth + 1, day: i + 1 });
  }
  await fetch("/api/days_off", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dates,
    }),
  });
}

resetCalendarButton.addEventListener("click", () => {
  alertText.innerText = `zresetować cały kalendarz.`;
  dialog.showModal();
  pendingOperation = resetCalendar;
});

async function resetCalendar() {
  calendar.forEach((month) =>
    month.weeks.forEach((week) =>
      week.forEach((day) => {
        day.isOff = false;
        day.element.classList.remove("calendar__weekday--non-working");
      })
    )
  );
  await fetch("/api/days_off/all", {
    method: "DELETE",
  });
}
