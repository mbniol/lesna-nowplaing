function convertToHumanTime(wholeSeconds) {
  const position_minutes = Math.floor(wholeSeconds / 60);
  const position_seconds = wholeSeconds - position_minutes * 60;
  return position_minutes + ":" + String(position_seconds).padStart(2, "0");
}

const tableBody = document.querySelector(".table__body");
const submitButton = document.querySelector(".submit-button");
//wygenerowanie widoku do unbana
// const bannetTracksBtn = document.querySelector("#banned_tracks");
// bannetTracksBtn.addEventListener("click", async (e) => {
//   await getSongs("/api/banned_tracks", 1);
// });
//wygenerowanie widoku do banowania zweryfikowanych piosenek
// const verifiedTracksBtn = document.querySelector("#verified_tracks");
// verifiedTracksBtn.addEventListener("click", async (e) => {
//   await getSongs("/api/verified_tracks", 2);
// });
//wygenerowanie widoku do weryfikacji piosenek
// const verifyTracksBtn = document.querySelector("#verify_tracks");
// verifyTracksBtn.addEventListener("click", async (e) => {
//   await getSongs();
// });

const originalState = {};
const changes = {};
const navigationContainer = document.querySelector(".navigation");

function changePage(page) {
  const currentSearchParams = new URL(location.href).searchParams;
  currentSearchParams.set("page", page);
  // const newURL = url;
  history.pushState(
    currentSearchParams.toString(),
    "",
    "?" + currentSearchParams.toString()
  );
  getSongs(currentSearchParams.toString());
  // locationcurrentSearchParams
}

async function getSongs(searchParams = "") {
  const response = await fetch("/api/songs?" + searchParams);
  const json = await response.json();
  let tableRows = "";
  let navigationContent = "";
  json.navigation.forEach(({ num, current }) => {
    navigationContent += `<div><a data-page="${num}" class="navigation__anchor ${
      current ? "navigation__anchor--current" : ""
    }" href="#">${num}</a></div>`;
  });
  navigationContainer.innerHTML = navigationContent;
  const newNavigationAnchors = document.querySelectorAll(".navigation__anchor");
  newNavigationAnchors.forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      changePage(anchor.dataset.page);
    });
  });
  console.log(json);
  json.songs.forEach(
    ({ cover, name, artist, length, id, banned, verified }) => {
      const bannedBoolean = Boolean(banned);
      let tableRow = `
    <tr class="table__body-row">
      <td class="table__cell"><div><img src="${cover}" alt=""></div></td>
      <td class="table__cell"><div>${name}</div></td>
      <td class="table__cell"><div>${artist}</div></td>
      <td class="table__cell">${convertToHumanTime(
        Math.ceil(length / 1000)
      )}</td>
     `;
      if (banned) {
        tableRow += `<td class="table__cell"><button class="table__button table__button--unban" data-track-id="${id}">unban</button></td>`;
      } else {
        tableRow += `<td class="table__cell"><button class="table__button table__button--ban" data-track-id="${id}">ban</button></td>`;
      }
      if (!verified) {
        tableRow += `<td class="table__cell"><button class="table__button table__button--verify" data-track-id="${id}">verify</button></td>`;
      }
      // if (mode === 0) {
      //domyślny widok-nowe piosenki
      //   tableRow += `
      //     <td class="table__cell"><button class="track_ban" data-track-id="${id}">ban</button></td>
      //     <td class="table__cell"><button class="track_verify" data-track-id="${id}">verify</button></td>
      //   </tr>
      // `;
      //   } else if (mode === 1) {
      //     //piosenki zbanowane
      //     tableRow += `
      //     <td class="table__cell"><button class="track_unban" data-track-id="${id}">unban</button></td>
      //   </tr>
      // `;
      //   } else if (mode === 2) {
      //     //piosenki zwryfikowane do zbanowania
      //     tableRow += `
      //     <td class="table__cell"><button class="verified_track_ban" data-track-id="${id}">ban</button></td>
      //   </tr>
      // `;
      //   }

      originalState[id] = bannedBoolean;
      tableRows += tableRow;
    }
  );
  tableBody.innerHTML = tableRows;
  waitForBan();
  waitForVerify();
  waitForUnBan();
  // waitForVerifyBan();
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
}
async function waitForBan() {
  const banButtons = document.querySelectorAll(".table__button--ban");
  banButtons.forEach((el) => {
    el.addEventListener("click", async (e) => {
      const trackID = el.dataset.trackId;
      await fetch(`/api/songs_ban`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spotifyLink: trackID }),
      });
      const currentSearchParams = new URL(location.href).searchParams;
      getSongs(currentSearchParams.toString());
    });
  });
}
// async function waitForVerifyBan() {
//   const verifiedBanButtons = document.querySelectorAll(".verified_track_ban");
//   verifiedBanButtons.forEach((el) => {
//     el.addEventListener("click", async (e) => {
//       const trackID = el.dataset.trackId;
//       await fetch(`/api/songs_ban`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ spotifyLink: trackID }),
//       });
//       await getSongs("/api/verified_tracks", 2);
//     });
//   });
// }
async function waitForUnBan() {
  const banButtons = document.querySelectorAll(".table__button--unban");
  banButtons.forEach((el) => {
    el.addEventListener("click", async (e) => {
      const trackID = el.dataset.trackId;
      await fetch(`/api/songs_unban`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spotifyLink: trackID }),
      });
      const currentSearchParams = new URL(location.href).searchParams;
      getSongs(currentSearchParams.toString());
    });
  });
}
async function waitForVerify() {
  const verifyButtons = document.querySelectorAll(".table__button--verify");
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
      const currentSearchParams = new URL(location.href).searchParams;
      getSongs(currentSearchParams.toString());
    });
  });
}

// submitButton.addEventListener("click", sendChanges);

getSongs(new URL(location.href).searchParams.toString());
setFormValues(new URL(location.href).searchParams.toString());

const filterSubmit = document.querySelector(".filter-menu__button");

filterSubmit.addEventListener("click", async (e) => {
  const currentPageSearchParams = new URL(location.href).searchParams;
  const selectTypeElement = document.querySelector("#type-select");
  const selectedType =
    selectTypeElement.options[selectTypeElement.selectedIndex].value;

  const selectCountElement = document.querySelector("#pp-select");
  const selectedCount =
    selectCountElement.options[selectCountElement.selectedIndex].value;
  const searchInput = document.querySelector(".filter-menu__input");
  const searchValue = searchInput.value;
  const newSearchParams = new URLSearchParams({
    pp: selectedCount,
    page: currentPageSearchParams.get("page") ?? 1,
    s: searchValue,
    type: selectedType,
  });
  console.log(newSearchParams);
  history.pushState(
    newSearchParams.toString(),
    "",
    "?" + newSearchParams.toString()
  );
  getSongs(newSearchParams.toString());
});

function setFormValues(searchParamsStringified) {
  const searchParams = new URLSearchParams(searchParamsStringified);
  const searchType = searchParams.get("type") ?? "unverified";
  const selectTypeElement = document.querySelector("#type-select");
  const currentTypeOption = [...selectTypeElement.options].find(
    (option) => option.value === searchType
  );
  selectTypeElement.selectedIndex = currentTypeOption.index;
  const searchPP = searchParams.get("pp") ?? "25";
  const selectPPElement = document.querySelector("#pp-select");
  const currentPPOption = [...selectPPElement.options].find(
    (option) => option.value === searchPP
  );
  selectPPElement.selectedIndex = currentPPOption.index;
  const searchQuery = searchParams.get("s") ?? "";
  const searchInput = document.querySelector(".filter-menu__input");
  searchInput.value = searchQuery;
}

window.addEventListener("popstate", (event) => {
  setFormValues(event.state);
  getSongs(event.state);
});
