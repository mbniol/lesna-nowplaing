const closeBtn = document.querySelectorAll(".closeBtn");
const backBtn = document.getElementById("backBtn");
const openBtn = document.getElementsByClassName("add-song-floating-btn")[0];
const addSongPanel = document.getElementsByClassName("add-song")[0];
const addSongBtn = document.getElementById("addSongBtn");

openBtn.addEventListener("click", async (e) => {
  addSongPanel.classList.remove("hide");
  setTimeout(() => addSongPanel.classList.add("visible"), 0);
  setTimeout(() => addSongPanel.classList.remove("forceHide"), 500);
  //XDDDDDDDDD
});

closeBtn.forEach((el) => {
  el.addEventListener("click", async (e) => {
    addSongPanel.classList.remove("visible");
    setTimeout(() => addSongPanel.classList.add("hide"), 0);
    setTimeout(() => addSongPanel.classList.add("forceHide"), 500);
  });
});

backBtn.addEventListener("click", async (e) => {
  document
    .getElementsByClassName("add-song-step1")[0]
    .classList.remove("fadeOut");
  document
    .getElementsByClassName("add-song-step2")[0]
    .classList.remove("fadeIn");
  document.getElementsByClassName("add-song-step1")[0].classList.add("fadeIn");
  document.getElementsByClassName("add-song-step2")[0].classList.add("fadeOut");
});

//dodawanie piosenki
const new_pattern_form = document.querySelector("#spotifyForm");
const add_song = new_pattern_form.querySelector("#addSongBtn");
add_song.addEventListener("click", async (e) => {
  e.preventDefault();
  const formData = new FormData(new_pattern_form);
  const params = new URLSearchParams(formData);
  const response = await fetch("/api/check_track", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  //przypisanie danych z odpowiedzi do json
  const json = await response.json();
  //podmiana danych na otrzymane z bazy w step2
  document.getElementById("error").innerHTML = "";
  document.getElementById("step2-song-title").innerHTML = json["name"];
  document.getElementById("step2-song-artist").innerHTML = json["artist"];
  document.getElementById("step2-song-img").setAttribute("src", json["img"]);
  document
    .getElementById("voting-vote-btn")
    .setAttribute("data-track-id", json["id"]);

  if (json["error"] == undefined) {
    document
      .getElementsByClassName("add-song-step1")[0]
      .classList.remove("fadeIn");
    document
      .getElementsByClassName("add-song-step2")[0]
      .classList.remove("fadeOut");
    document
      .getElementsByClassName("add-song-step1")[0]
      .classList.add("fadeOut");
    document
      .getElementsByClassName("add-song-step2")[0]
      .classList.add("fadeIn");
  } else {
    document.getElementById("error").innerHTML = json["error"];
  }
});

async function show_votes() {
  const result = await fetch("/api/track_list");
  const json = await result.json();
  json.forEach((row) => {
    document.getElementById("voting-list").innerHTML += add_track(row);
  });
  const votingButtons = document.querySelectorAll(".voting-vote-btn");
  votingButtons.forEach((el) => {
    el.addEventListener("click", async (e) => {
      console.log("xD");
      const trackID = el.dataset.trackId;
      const response = await fetch(`/api/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spotifyLink: trackID }),
      });
      location.reload();
    });
  });
}
function add_track({ id, name, artist, count, cover }) {
  return `
  <div class="voting-item">
  <div class="voting-song-cover">
    <img src="${cover}" alt="" srcset="" />
  </div>
  <div class="voting-song-info-wrapper">
    <div class="voting-title">${name}</div>
    <div class="voting-artist">${artist}</div>
    <div class="voting-votecount-wrapper">
      Głosów: <span class="voting-votecount-count">${count}</span>
    </div>
  </div>
  <button
    class="voting-vote-btn"
    data-track-id="${id}"
  >
    Zagłosuj
  </button>
</div>`;
}
show_votes();
