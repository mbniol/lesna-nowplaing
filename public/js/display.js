Document.prototype.createElementFromString = function (str) {
  const element = new DOMParser().parseFromString(str, "text/html");
  const child = element.documentElement.querySelector("body").firstChild;
  return child;
};

function convertToHumanTime(wholeSeconds) {
  const position_minutes = Math.floor(wholeSeconds / 60);
  const position_seconds = wholeSeconds - position_minutes * 60;
  return position_minutes + ":" + String(position_seconds).padStart(2, "0");
}

const events = new EventSource("http://localhost:3000/api/player");
let progressInterval;
const nowPlayingContainer = document.querySelector(".main-left");

events.onmessage = (event) => {
  const { current_track, queue, position, paused, action } = JSON.parse(
    event.data
  );
  console.log(action);
  let position_s = Math.ceil(position / 1000);
  const duration_s = Math.ceil(current_track.duration / 1000);
  const queryList = document.querySelector(".queue-list");
  let queryListNewContent = "";
  queue.forEach((track) => {
    queryListNewContent += `<div class="queue-item">
      <img class="queue-item-image" src="${track.image}" hei />
      <div class="queue-item-title">${track.name}</div>
      <div class="queue-item-artist">
      ${track.artists}
      </div>
      <div class="song-timestamp">${track.duration_human}</div>
    </div>`;
  });
  queryList.innerHTML = queryListNewContent;
  clearInterval(progressInterval);
  switch (action) {
    case "init_song": {
      const position_human = convertToHumanTime(position_s);
      const nowPlaying =
        document.createElementFromString(`<div class="now-playing" data-id="${current_track.id}"><div class="cover-art">
        <progress
          class="song-progress-bar"
          value="${position_s}"
          max="${duration_s}"
        ></progress>
        <img src="${current_track.image}" width="100%" />
      </div>
      <div class="song-title-container">
        <div class="song-title">${current_track.name}</div>
        <div class="song-artist">${current_track.artists}</div>
        <div class="song-position">${position_human}</div>
        <div class="song-timestamp">${current_track.duration_human}</div>
      </div></div>`);
      nowPlayingContainer.appendChild(nowPlaying);
      if (!paused) {
        const progressBar = document.querySelector(
          ".now-playing:not(.now-playing--go) .song-progress-bar"
        );
        const positionDiv = document.querySelector(
          ".now-playing:not(.now-playing--go) .song-position"
        );
        progressInterval = setInterval(() => {
          if (progressBar.value <= progressBar.max) {
            progressBar.value++;
            position_s++;
            positionDiv.innerText = convertToHumanTime(position_s);
          }
        }, 1000);
      }
      break;
    }
    case "new_song": {
      const playedEarlier = document.querySelector(".now-playing");
      playedEarlier.classList.add("now-playing--go");
      setTimeout(() => playedEarlier.remove(), 500);
      const nowPlaying =
        document.createElementFromString(`<div class="now-playing" data-id="${current_track.id}"><div class="cover-art">
          <progress
            class="song-progress-bar"
            value="${position_s}"
            max="${duration_s}"
          ></progress>
          <img src="${current_track.image}" width="100%" />
        </div>
        <div class="song-title-container">
          <div class="song-title">${current_track.name}</div>
          <div class="song-artist">${current_track.artists}</div>
          <div class="song-position">00:00</div>
          <div class="song-timestamp">${current_track.duration_human}</div>
        </div></div>`);
      nowPlayingContainer.appendChild(nowPlaying);
      const progressBar = document.querySelector(
        ".now-playing:not(.now-playing--go) .song-progress-bar"
      );
      const positionDiv = document.querySelector(
        ".now-playing:not(.now-playing--go) .song-position"
      );
      if (!paused) {
        const progressBar = document.querySelector(
          ".now-playing:not(.now-playing--go) .song-progress-bar"
        );
        const positionDiv = document.querySelector(
          ".now-playing:not(.now-playing--go) .song-position"
        );
        progressInterval = setInterval(() => {
          if (progressBar.value <= progressBar.max) {
            progressBar.value++;
            position_s++;
            positionDiv.innerText = convertToHumanTime(position_s);
          }
        }, 1000);
      }
      break;
    }
    case "pause": {
      const progressBar = document.querySelector(
        ".now-playing:not(.now-playing--go) .song-progress-bar"
      );
      const positionDiv = document.querySelector(
        ".now-playing:not(.now-playing--go) .song-position"
      );
      progressBar.value = position_s;
      positionDiv.innerText = convertToHumanTime(position_s);
      break;
    }
    case "resume":
    case "position_change":
      const progressBar = document.querySelector(
        ".now-playing:not(.now-playing--go) .song-progress-bar"
      );
      const positionDiv = document.querySelector(
        ".now-playing:not(.now-playing--go) .song-position"
      );
      progressBar.value = position_s;
      positionDiv.innerText = convertToHumanTime(position_s);
      if (!paused) {
        progressInterval = setInterval(() => {
          if (progressBar.value <= progressBar.max) {
            progressBar.value++;
            position_s++;
            positionDiv.innerText = convertToHumanTime(position_s);
          }
        }, 1000);
      }
      break;
  }
};
