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
  add_song.classList.add("hidden");
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
    setTimeout(() => {
      add_song.classList.remove("hidden");
    }, 500);
  } else {
    document.getElementById("error").innerHTML = json["error"];
    add_song.classList.remove("hidden");
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
      const trackID = el.dataset.trackId;
      await fetch(`/api/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spotifyLink: trackID }),
      });
      //console.log("test");
      await location.reload();
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
  <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z"/>
</svg>
  </button>
</div>`;
}

function disableVoting() {
  const buttons = document.querySelectorAll("button");
  console.log(buttons);
  buttons.forEach((e) => {
    e.disabled = true;
  });
}
show_votes();
