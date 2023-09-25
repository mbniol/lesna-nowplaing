function makeRemoveButtonsReactive() {
  const buttons = document.querySelectorAll(".preset-remove-button");
  buttons.forEach((el) => {
    el.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await fetch(`/api/pattern/${id}`, {
        method: "DELETE",
      });
      location.reload();
    });
  });
}

function makeActivityButtonsReactive() {
  const buttons = document.querySelectorAll(".preset-make-active-button");
  buttons.forEach((el) => {
    el.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await fetch(`/api/pattern/${id}/active`, {
        method: "PUT",
      });
      location.reload();
    });
  });
}

function makeMenuButtonsReactive() {
  const buttons = document.querySelectorAll(".preset-header-button");
  const settingBox = document.querySelectorAll(".preset-quick-settings");

  buttons.forEach((element, i) => {
    element.addEventListener("click", (e) => {
      settingBox.forEach((element) => {
        if (element === e.target) element.classList.remove("visible");
      });
      classes = settingBox[i].classList;
      classes.toggle("visible");
    });
  });

  window.addEventListener("click", (e) => {
    if (
      !(
        e.target.classList.contains("preset-quick-settings") ||
        e.target.parentNode.classList.contains("preset-quick-settings") ||
        e.target.classList.contains("preset-header-button")
      )
    ) {
      settingBox.forEach((element) => {
        element.classList.remove("visible");
      });
    }
  });
}

function makeFormButtonsReactive() {
  const addPresetButton = document.querySelector(".add-preset-button");
  const closeAddPresetButton = document.querySelector(".add-preset-close-btn");
  const addPresetBox = document.querySelector(".add-preset");
  const addPresetBackground = document.querySelector(".add-preset-background");

  addPresetButton.addEventListener("click", (e) => {
    addPresetBox.classList.add("visible");
    addPresetBackground.classList.add("visible");
  });

  closeAddPresetButton.addEventListener("click", (e) => {
    addPresetBox.classList.remove("visible");
    addPresetBackground.classList.remove("visible");
  });

  const new_pattern_form = document.querySelector("#pattern_form");
  const button = new_pattern_form.querySelector("button");

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const formData = new FormData(new_pattern_form);
    const params = new URLSearchParams(formData);
    await fetch("/api/pattern", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    location.reload();
  });
}

function addButtonsFunctionality() {
  makeRemoveButtonsReactive();
  makeActivityButtonsReactive();
  makeMenuButtonsReactive();
  makeFormButtonsReactive();
}

async function populatePatternsContainer() {
  const adminWrapper = document.querySelector(".admin-presets");
  const result = await fetch("/api/pattern");
  const json = await result.json();
  json.forEach((row) => {
    adminWrapper.innerHTML += generateElement(row);
  });
  addButtonsFunctionality();
}

function generateElement({ id, name, alarm_offset, active, breaks_count }) {
  return `
  <div class="preset-box">
    <div class="preset-quick-settings">
      <button class="preset-remove-button" data-id="${id}">Usuń</button>
      <button class="preset-make-active-button" data-id="${id}">Ustaw jako ${
    active ? "nieaktywny" : "aktywny"
  }</button>
    </div>
    <div class="preset-header">
      <a href="/admin/pattern/${id}"
        ><div class="preset-name">${name}</div></a
      >
      <div class="preset-header-button">&#9998;</div>
    </div>
    <div class="preset-info">Liczba przerw: ${breaks_count}</div>
    <div class="preset-info">Przesunięcie przerw: ${alarm_offset}s</div>
    <div class="preset-isselected ${active ? "preset-selected" : ""}">${
    active ? "Aktywne" : "Nieaktywne"
  }</div>
  </div>`;
}

populatePatternsContainer();
