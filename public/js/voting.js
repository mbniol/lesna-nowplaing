const closeBtn = document.getElementById("closeBtn");
const openBtn = document.getElementsByClassName("add-song-floating-btn")[0];
const addSongPanel = document.getElementsByClassName("add-song")[0];
const addSongBtn = document.getElementById("addSongBtn");

openBtn.addEventListener("click", async (e) => {
  addSongPanel.classList.add("visible");
});

closeBtn.addEventListener("click", async (e) => {
  addSongPanel.classList.remove("visible");
});

addSongBtn.addEventListener("click", async (e) => {
  //przejdz do potwierdzenia
});

//dodawanie piosenki
const new_pattern_form = document.querySelector("#spotifyForm");
const add_song = new_pattern_form.querySelector("#addSongBtn");
add_song.addEventListener("click", async (e) => {
  e.preventDefault();
  const formData = new FormData(new_pattern_form);
  const params = new URLSearchParams(formData);
  await fetch("/api/votes", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  location.reload();
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
