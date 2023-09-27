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
  //location.reload();
});
