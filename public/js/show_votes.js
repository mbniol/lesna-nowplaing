async function show_votes() {
  const result = await fetch("/api/track_list");
  const json = await result.json();
  json.forEach((row) => {
    console.log(row);
    document.getElementById("voting-list").innerHTML += add_track(row);
  });
}
function add_track({ id, name, count, cover }) {
  return `
  <div class="voting-item">
  <div class="voting-song-cover">
    <img src="${cover}" alt="" srcset="" />
  </div>
  <div class="voting-song-info-wrapper">
    <div class="voting-title">${name}</div>
    <div class="voting-artist"></div>
    <div class="voting-votecount-wrapper">
      Głosów: <span class="voting-votecount-count">${count}</span>
    </div>
  </div>
  <!-- <div class="voting-vote-btn"> -->
  <div>
  <button class="voting-vote-btn">oddaj głos</button>
  </div>
  <!-- </div> -->
</div>`;
}
show_votes();
