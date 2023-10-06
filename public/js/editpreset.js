const pathname = window.location.pathname;
const pathnameSplitted = pathname.split("/");
const patternID = pathnameSplitted[pathnameSplitted.length - 1];
const breaksContainer = document.querySelector(".edit-preset-breaks");
const submitChangesButton = document.querySelector("#submit-changes");
let containers;

function addRemovingFunctionality() {
  const deleteButtons = document.querySelectorAll(".break-delete-button");
  deleteButtons.forEach((el) => {
    el.addEventListener("click", () => {
      let breakContainer = el.parentElement;
      while (!breakContainer.classList.contains("break-container")) {
        breakContainer = breakContainer.parentElement;
      }
      breakContainer.remove();
      containers = document.querySelectorAll(".break-container");

      containers.forEach((container, i) => {
        container.dataset.position = i;
        const breakNumber = container.querySelector(".break-number");
        const position = +container.dataset.position + 1;
        breakNumber.textContent = position;
      });
      //
      //   await fetch(`/api/pattern/${patternID}/break/${el.dataset.id}`, {
      //     method: "DELETE",
      //   });
      //   location.replace(`/admin/pattern/${patternID}`);
    });
  });
}

submitChangesButton.addEventListener("click", (e) => {
  if (breaksContainer.checkValidity()) {
    const breakElements = document.querySelectorAll(".break");
    const breaksData = [];
    breakElements.forEach((el, i) => {
      const container = el.parentElement;
      const position = container.dataset.position;
      const nameInput = el.querySelector(".break-name-input");
      const startInput = el.querySelector(".break-start-input");
      const endInput = el.querySelector(".break-end-input");
      const forRequestedInput = el.querySelector(".break-requested-checkbox");
      breaksData.push({
        name: nameInput.value,
        position,
        start: startInput.value + ":00",
        end: endInput.value + ":00",
        forRequested: forRequestedInput.checked,
      });
    });
    validateBreaks(breaksData);
    fetch(`/api/pattern/${patternID}/break`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data",
      },
      body: JSON.stringify(breaksData),
    });
  } else {
    breaksContainer.reportValidity();
  }
});

function addDragability() {
  const dragableElements = document.querySelectorAll(".break");
  const inputs = breaksContainer.querySelectorAll("input");

  dragableElements.forEach((element) => {
    element.addEventListener("dragstart", (e) => {
      const target = e.currentTarget;
      e.dataTransfer.setData(
        "parent-position",
        target.parentElement.dataset.position
      );
      e.dataTransfer.setData("dragged-id", target.id);
      e.dataTransfer.effectAllowed = "move";
    });
  });

  containers.forEach((element) => {
    element.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    element.addEventListener("drop", (e) => {
      const target = e.currentTarget;
      e.preventDefault();
      const data = e.dataTransfer.getData("dragged-id");
      const prev = target.previousSibling;
      const currentPosition = +target.dataset.position;
      const prevPosition = +e.dataTransfer.getData("parent-position");
      const positionDiff = currentPosition - prevPosition;
      if (positionDiff > 0) {
        for (let i = prevPosition + 1; i <= currentPosition; i++) {
          containers[i - 1].appendChild(containers[i].children[0]);
        }
      } else if (positionDiff < 0) {
        for (let i = prevPosition - 1; currentPosition <= i; i--) {
          containers[i + 1].appendChild(containers[i].children[0]);
        }
      }
      target.appendChild(document.getElementById(data));
      containers.forEach((container) => {
        const breakNumber = container.querySelector(".break-number");
        const position = +container.dataset.position + 1;
        breakNumber.textContent = position;
      });
    });
  });

  //https://stackoverflow.com/questions/27149192/no-possibility-to-select-text-inside-input-when-parent-is-draggable

  inputs.forEach((el) => {
    el.addEventListener("focus", (e) => fixSelectable(e.target, true));
    el.addEventListener("blur", (e) => fixSelectable(e.target, false));
  });

  function fixSelectable(oElement, bGotFocus) {
    let oParent = oElement.parentElement;
    while (oParent !== null && !oParent.classList.contains("break"))
      oParent = oParent.parentElement;
    if (oParent !== null) oParent.draggable = !bGotFocus;
  }
}

async function getPatternData() {
  const result = await fetch(`/api/pattern/${patternID}`);
  return await result.json();
}

async function updatePatternForm() {
  const { name, alarm_offset, active } = await getPatternData();
  const patternForm = document.querySelector("#pattern-form");
  const nameInput = patternForm.querySelector("#presetName");
  const offsetInput = patternForm.querySelector("#presetOffset");
  const activeInput = patternForm.querySelector("#isActive");
  nameInput.value = name;
  offsetInput.value = alarm_offset;
  activeInput.checked = Boolean(active);
}

async function getBreaksData() {
  const result = await fetch(`/api/pattern/${patternID}/break`);
  return await result.json();
}

async function populateBreaksContainer() {
  const breaks = await getBreaksData();
  breaks.forEach(({ id, name, position, start, end, for_requested }, i) => {
    breaksContainer.innerHTML += generateElement(
      i,
      id,
      name,
      position,
      start.slice(0, -3),
      end.slice(0, -3),
      for_requested
    );
  });
  containers = document.querySelectorAll(".break-container");
  addDragability();
  addRemovingFunctionality();
}

updatePatternForm();
populateBreaksContainer();

function generateElement(index, id, name, position, start, end, for_requested) {
  return `
  <div class="break-container" data-position="${index}">
    <div class="break" id="break-${id}" data-id="${id}" draggable="true">
      <div class="break-number">${position + 1}</div>
      <div class="break-main">
        <div class="break-name">
          <input
            class="break-name-input"
            type="text"
            name="breakName"
            id="breakName"
            value="${name}"
            required
          />
        </div>
        <div class="break-time">
          Od:<input required class="break-start-input" type="time" name="breakFrom" id="breakFrom" value="${start}" /> Do:
          <input required class="break-end-input" type="time" name="breakTo" id="breakTo" value="${end}" />
        </div>
        <div class="break-settings">
          <input
            class="break-requested-checkbox"
            type="checkbox"
            name="onDemandSongs"
            id="onDemandSongs"
            ${for_requested ? "checked" : ""}
          /><label for="onDemandSongs">piosenki na żądanie</label>
        </div>
      </div>
      <div class="break-delete">
        <button class="break-delete-button" data-id="${id}">Usun</button>
      </div>
    </div>
  </div>`;
}

const newBreakForm = document.querySelector("#new-break-form");
const newBreakSubmit = newBreakForm.querySelector("button");

function addSeconds(formdata, ...attrs) {
  attrs.forEach((attr) => {
    const paramsWithSeconds = formdata.get(attr) + ":00";
    formdata.set(attr, paramsWithSeconds);
  });
}

function convertIntoTimestamp(clock) {
  if (clock.length === 5) {
    clock += ":00";
  }
  const date = new Date(`January 1, 1970 ${clock}`);

  return date.getTime();
}

function validateBreak(start, end) {
  if (convertIntoTimestamp(start) >= convertIntoTimestamp(end)) {
    throw new Error(`${start} jest większe od ${end}`);
    return false;
  }
  return true;
}

function validateBreaks(breaks) {
  breaks.forEach((singleBreak) =>
    validateBreak(singleBreak.start, singleBreak.end)
  );
  for (let i = 1; i < breaks.length; i++) {
    const previousBreak = breaks[i - 1];
    const currentBreak = breaks[i];
    const minStart = previousBreak.end;
    if (
      convertIntoTimestamp(minStart) >= convertIntoTimestamp(currentBreak.start)
    ) {
      throw new Error(`przerwa nr. ${i} nachodzi się z przerwą nr. ${i + 1}`);
    }
  }
}

newBreakSubmit.addEventListener("click", async (e) => {
  e.preventDefault();
  if (newBreakForm.checkValidity()) {
    const params = new FormData(newBreakForm);
    validateBreak(params.get("start"), params.get("end"));
    addSeconds(params, "end", "start");
    await fetch(`/api/pattern/${patternID}/break`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Content-Type": "multipart/form-data",
      },
      body: new URLSearchParams(params),
    });
    location.reload();
  } else {
    newBreakForm.reportValidity();
  }
});

const patternEditForm = document.querySelector("#pattern-form");
const patternEditSubmit = patternEditForm.querySelector("#saveChanges");
const patternDeleteButton = patternEditForm.querySelector("#deletePreset");

patternEditSubmit.addEventListener("click", async (e) => {
  e.preventDefault();
  if (patternEditForm.checkValidity()) {
    const params = new FormData(patternEditForm);
    await fetch(`/api/pattern/${patternID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Content-Type": "multipart/form-data",
      },
      body: new URLSearchParams(params),
    });
    location.reload();
  } else {
    patternEditForm.reportValidity();
  }
});

patternDeleteButton.addEventListener("click", async (e) => {
  e.preventDefault();
  await fetch(`/api/pattern/${patternID}`, {
    method: "DELETE",
  });
  location.replace("/admin");
});
