const pathname = window.location.pathname;
const pathnameSplitted = pathname.split("/");
const patternID = pathnameSplitted[pathnameSplitted.length - 1];

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
  const breaksContainer = document.querySelector(".edit-preset-breaks");
  const breaks = await getBreaksData();
  breaks.forEach((row) => {
    breaksContainer.innerHTML += generateElement(row);
  });
}

updatePatternForm();
populateBreaksContainer();

function generateElement({ id, name, position, start, end, for_requested }) {
  return `
  <div class="break" data-id="${id}">
  <div class="break-number">${position + 1}</div>
  <div class="break-main">
    <div class="break-name">
      <input
        type="text"
        name="breakName"
        id="breakName"
        value="${name}"
      />
    </div>
    <div class="break-time">
      Od:<input type="number" name="breakFrom" id="breakFrom" value="${start}" /> Do:
      <input type="number" name="breakTo" id="breakTo" value="${end}" />
    </div>
    <div class="break-settings">
      <input
        type="checkbox"
        name="onDemandSongs"
        id="onDemandSongs"
        ${for_requested ? "checked" : ""}
      /><label for="onDemandSongs">piosenki na żądanie</label>
    </div>
  </div>
  <div class="break-delete">
    <button id="deleteBreak">Usun</button>
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
