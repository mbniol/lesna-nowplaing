async function show_votes() {
  const result = await fetch("/api/track_list");
  const json = await result.json();
  json.forEach((row) => {
    document.getElementById("voting-list").innerHTML += add_track(row);
  });
}
function add_track({ name, artist, count, cover }) {
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
</div>`;
}

async function show_news() {
  const result = await fetch("/api/get_news");
  const json = await result.json();
  json.forEach((row) => {
    document.getElementById("news-list").innerHTML += add_news(row);
  });
}
function add_news({ topic, content, date }) {
  return (
    `
    <div class="news-item">
        <div class="news-item-title">${topic}</div>
        <div class="news-item-content">
            ${content}
        </div>
        <div class="news-item-date">` +
    new Date(date).toLocaleDateString("pl-PL") +
    `r.</div>
    </div>`
  );
}
show_votes();
show_news();

async function startTime() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  m = checkTime(m);
  document.getElementById("clock").innerHTML = h + ":" + m;
  setTimeout(startTime, 10000);
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  } // add zero in front of numbers < 10
  return i;
}
