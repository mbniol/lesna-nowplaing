const pathname = window.location.pathname;
const pathnameSplitted = pathname.split("/");
const patternID = pathnameSplitted[pathnameSplitted.length - 1];
const breaksContainer = document.querySelector(".edit-preset-breaks");
const submitChangesButton = document.querySelector("#submit-changes");
let containers;

function addRemovingFunctionality() {
  const deleteButtons = document.querySelectorAll(".break__delete-button");
  deleteButtons.forEach((el) => {
    console.log("hej");
    el.addEventListener("click", () => {
      let breakContainer = el.parentElement;
      while (!breakContainer.classList.contains("break-container")) {
        breakContainer = breakContainer.parentElement;
      }
      breakContainer.remove();
      containers = document.querySelectorAll(".break-container");
      console.log(containers);
      containers.forEach((container, i) => {
        container.dataset.position = i;
        const breakNumber = container.querySelector(".break__number");
        const position = +container.dataset.position + 1;
        breakNumber.textContent = position;
      });
      //   console.log("hej");
      //   await fetch(`/api/pattern/${patternID}/break/${el.dataset.id}`, {
      //     method: "DELETE",
      //   });
      //   location.replace(`/admin/pattern/${patternID}`);
    });
  });
}

submitChangesButton.addEventListener("click", (e) => {
  const breakElements = document.querySelectorAll(".break");
  const breaksData = [];
  breakElements.forEach((el, i) => {
    const container = el.parentElement;
    const position = container.dataset.position;
    const nameInput = el.querySelector(".break__name-input");
    const startInput = el.querySelector(".break__start-input");
    const endInput = el.querySelector(".break__end-input");
    const forRequestedInput = el.querySelector(".break__requested-checkbox");
    breaksData.push({
      name: nameInput.value,
      position,
      start: startInput.value,
      end: endInput.value,
      forRequested: forRequestedInput.checked,
    });
  });
  fetch(`/api/pattern/${patternID}/break`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "multipart/form-data",
    },
    body: JSON.stringify(breaksData),
  });
  console.log(breaksData);
});

function addDragability() {
  const dragableElements = document.querySelectorAll(".break");
  const inputs = breaksContainer.querySelectorAll("input");

  dragableElements.forEach((element) => {
    element.addEventListener("dragstart", (e) => {
      console.log(e.target, e.currentTarget);
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
          console.log(containers[i].children[0]);
          containers[i - 1].appendChild(containers[i].children[0]);
        }
      } else if (positionDiff < 0) {
        console.log(prevPosition, currentPosition);
        for (let i = prevPosition - 1; currentPosition <= i; i--) {
          console.log(containers[i].children[0]);
          containers[i + 1].appendChild(containers[i].children[0]);
        }
      }
      target.appendChild(document.getElementById(data));
      containers.forEach((container) => {
        const breakNumber = container.querySelector(".break__number");
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
      start,
      end,
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
      <div class="break__number">${position + 1}</div>
      <div class="break__main">
        <div class="break__name">
          <input
            class="break__name-input"
            type="text"
            name="breakName"
            id="breakName"
            value="${name}"
          />
        </div>
        <div class="break__time">
          Od:<input class="break__start-input" type="number" name="breakFrom" id="breakFrom" value="${start}" /> Do:
          <input class="break__end-input" type="number" name="breakTo" id="breakTo" value="${end}" />
        </div>
        <div class="break__settings">
          <input
            class="break__requested-checkbox"
            type="checkbox"
            name="onDemandSongs"
            id="onDemandSongs"
            ${for_requested ? "checked" : ""}
          /><label for="onDemandSongs">piosenki na żądanie</label>
        </div>
      </div>
      <div class="break__delete">
        <button class="break__delete-button" data-id="${id}">Usun</button>
      </div>
    </div>
  </div>`;
}

const newBreakForm = document.querySelector("#new-break-form");
const newBreakSubmit = newBreakForm.querySelector("button");

newBreakSubmit.addEventListener("click", async (e) => {
  e.preventDefault();
  const params = new FormData(newBreakForm);
  console.log(params, `/api/pattern/${patternID}/break`);
  await fetch(`/api/pattern/${patternID}/break`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // "Content-Type": "multipart/form-data",
    },
    body: new URLSearchParams(params),
  });
  location.reload();
});

const patternEditForm = document.querySelector("#pattern-form");
const patternEditSubmit = patternEditForm.querySelector("#saveChanges");
const patternDeleteButton = patternEditForm.querySelector("#deletePreset");

patternEditSubmit.addEventListener("click", async (e) => {
  e.preventDefault();
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
});

patternDeleteButton.addEventListener("click", async (e) => {
  e.preventDefault();
  await fetch(`/api/pattern/${patternID}`, {
    method: "DELETE",
  });
  location.replace("/admin");
});
