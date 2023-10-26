function convertToHumanTime(wholeSeconds) {
  const position_minutes = Math.floor(wholeSeconds / 60);
  const position_seconds = wholeSeconds - position_minutes * 60;
  return position_minutes + ":" + String(position_seconds).padStart(2, "0");
}

const tableBody = document.querySelector(".table__body");
const submitButton = document.querySelector(".submit-button");

const originalState = {};
const changes = {};

async function getSongs() {
  console.log('test');
  const response = await fetch("/api/songs");
  const json = await response.json();
  let tableRows = "";
  json.forEach(({ cover, name, artist, length, id, banned }) => {
    const bannedBoolean = Boolean(banned);
    const tableRow = `
    <tr class="table__body-row">
      <td class="table__cell"><img src="${cover}" alt=""></td>
      <td class="table__cell">${name}</td>
      <td class="table__cell">${artist}</td>
      <td class="table__cell">${convertToHumanTime(
        Math.ceil(length / 1000)
      )}</td>
      <td class="table__cell"><button class="track_ban" data-track-id="${id}">ban</button></td>
      <td class="table__cell"><button class="track_verify" data-track-id="${id}">verify</button></td>
    </tr>
  `;
    originalState[id] = bannedBoolean;
    tableRows += tableRow;
  });
  tableBody.innerHTML = tableRows;
  waitForBan();
  waitForVerify();
}

async function sendChanges() {
  const tableRows = document.querySelectorAll(".table__body-row");
  tableRows.forEach((row) => {
    const rowCheckbox = row.querySelector(".table__checkbox");
    const rowID = rowCheckbox.dataset.id;
    const checkboxState = rowCheckbox.checked;
    if (originalState[rowID] !== checkboxState) {
      changes[rowID] = checkboxState;
    }
  });
  fetch("/api/songs_banned", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });
  // console.log(changes);
}
async function waitForBan(){
  const banButtons = document.querySelectorAll(".track_ban");
  banButtons.forEach((el) => {
    el.addEventListener("click", async (e) => {
      const trackID = el.dataset.trackId;
      await fetch(`/api/songs_banned`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spotifyLink: trackID }),
      });
      await location.reload();
    });
  });
}
async function waitForVerify(){
  const verifyButtons = document.querySelectorAll(".track_verify");
  verifyButtons.forEach((el) => {
    el.addEventListener("click", async (e) => {
      const trackID = el.dataset.trackId;
      await fetch(`/api/songs_verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spotifyLink: trackID }),
      });
      await location.reload();
    });
  });
}

submitButton.addEventListener("click", sendChanges);

getSongs();
