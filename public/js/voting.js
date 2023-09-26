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
