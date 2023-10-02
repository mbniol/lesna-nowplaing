Document.prototype.createElementFromString = function (str) {
  const element = new DOMParser().parseFromString(str, "text/html");
  const child = element.documentElement.querySelector("body").firstChild;
  return child;
};

let playerChanges = 0;
let connectEnforcer;
let progressInterval;
function addConnectEnforcer() {
  connectEnforcer = document.createElement("div");
  connectEnforcer.classList.add("enforcer");
  connectEnforcer.innerText = "Podłącz do Spotify";
  document.body.appendChild(connectEnforcer);
  // connectEnforcer.addEventListener("click", () => {
  //   connectEnforcer.remove();
  // });
}

function getTheEssence(track, imageSize) {
  const image = track.album.images.find(
    (image) => image.height === imageSize
  ).url;
  const artists = track.artists.map((artist) => artist.name).join`, `;
  const minutes = Math.floor(track.duration_ms / 60000);
  const seconds = Math.floor((track.duration_ms - minutes * 60000) / 1000);
  const duration = minutes + ":" + String(seconds).padStart(2, "0");
  const name = track.name;
  const id = track.id;
  // console.log(track);
  return { image, artists, duration, name, id };
}

const nowPlayingContainer = document.querySelector(".main-left");

window.onSpotifyWebPlaybackSDKReady = async () => {
  const response = await fetch("/api/token/sdk");
  const jsonResponse = await response.json();
  const token = jsonResponse.token;
  // console.log(token);

  const player = new Spotify.Player({
    name: "Lesna",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });

  player.addListener("ready", ({ device_id }) => {
    addConnectEnforcer();
    console.log("The Web Playback SDK is ready to play music!");
    console.log("Device ID", device_id);
  });

  let lastId = undefined;

  let lastRequest = {
    id: undefined,
    position: undefined,
    paused: undefined,
  };
  // fetch("/api/queue");

  function convertToHumanTime(wholeSeconds) {
    const position_minutes = Math.floor(wholeSeconds / 60);
    const position_seconds = wholeSeconds - position_minutes * 60;
    return position_minutes + ":" + String(position_seconds).padStart(2, "0");
  }

  function sameQueue(queue1, queue2) {
    return JSON.stringify(queue1) === JSON.stringify(queue2);
  }

  player.addListener(
    "player_state_changed",
    async ({
      paused,
      position,
      track_window: {
        current_track: event_current_track,
        previous_tracks: event_previous_tracks,
      },
    }) => {
      if (
        !(
          lastRequest.id === event_current_track.id &&
          lastRequest.position === position
        ) ||
        lastRequest.paused !== paused
      ) {
        const lastRequestArchive = lastRequest;
        lastRequest = {
          id: event_current_track.id,
          position,
          paused,
        };
        // console.log(lastRequest, {
        //   id: event_current_track.id,
        //   position,
        //   paused,
        // });

        if (playerChanges++ === 0) {
          addClickEnforcer();
        }
        // clearInterval(progressInterval);
        const rzeczy = await fetch("/api/queue");
        // console.log(event_previous_tracks);
        const previous_track =
          event_previous_tracks[event_previous_tracks.length - 1];
        const duration_s = Math.ceil(event_current_track.duration_ms / 1000);
        const position_whole_seconds = Math.floor(position / 1000);
        // console.log(event_previous_tracks, event_current_track);
        let { current_track: fetch_current_track, queue } = await rzeczy.json();
        console.log(fetch_current_track, queue);
        lastRequest.queue = queue;
        if (
          position === 0 &&
          queue[0].id === event_current_track.id &&
          fetch_current_track.id === previous_track.id
        ) {
          const actualCurrent = queue.shift();
          fetch_current_track = actualCurrent;
        }
        // console.log(event_current_track);
        // let progressBar;
        const playedEarlier = document.querySelector(".now-playing");
        if (playedEarlier) {
          console.log(playedEarlier.dataset.id, event_current_track.id);
        }

        if (
          (position === 0 && !sameQueue(lastRequestArchive.queue, queue)) ||
          !playedEarlier ||
          playedEarlier.dataset.id !== event_current_track.id
        ) {
          lastId = event_current_track.id;
          if (playedEarlier) {
            playedEarlier.classList.add("now-playing--go");
            setTimeout(() => playedEarlier.remove(), 500);
          }
          const nowPlaying =
            document.createElementFromString(`<div class="now-playing" data-id="${fetch_current_track.id}"><div class="cover-art">
        <progress
          class="song-progress-bar"
          value="${position_whole_seconds}"
          max="${duration_s}"
        ></progress>
        <img src="${fetch_current_track.image}" width="100%" />
      </div>
      <div class="song-title-container">
        <div class="song-title">${fetch_current_track.name}</div>
        <div class="song-artist">${fetch_current_track.artists}</div>
        <div class="song-position">00:00</div>
        <div class="song-timestamp">${fetch_current_track.duration}</div>
      </div></div>`);
          nowPlayingContainer.appendChild(nowPlaying);
        }
        const progressBar = document.querySelector(
          ".now-playing:not(.now-playing--go) .song-progress-bar"
        );
        const positionDiv = document.querySelector(
          ".now-playing:not(.now-playing--go) .song-position"
        );
        positionDiv.innerText = convertToHumanTime(position_whole_seconds);
        progressBar.value = position_whole_seconds;
        progressBar.max = duration_s;
        // console.log(progressBar, paused);
        if (!paused) {
          clearInterval(progressInterval);
          // console.log(progressBar);
          progressInterval = setInterval(() => {
            progressBar.value++;
            const position_converted = convertToHumanTime(progressBar.value);
            positionDiv.innerText = position_converted;
            // console.log(progressBar.value);
          }, 1000);
        } else {
          clearInterval(progressInterval);
        }
        // document.querySelector('.song-progress-bar').addEventListener()
        const queryList = document.querySelector(".queue-list");
        let queryListNewContent = "";
        queue.forEach((track) => {
          queryListNewContent += `<div class="queue-item">
            <img class="queue-item-image" src="${track.image}" hei />
            <div class="queue-item-title">${track.name}</div>
            <div class="queue-item-artist">
            ${track.artists}
            </div>
            <div class="song-timestamp">${track.duration}</div>
          </div>`;
        });
        queryList.innerHTML = queryListNewContent;
        // if (current_track !== currentSongID) {
        //   const previous_track = previous_tracks[previous_tracks.length - 1];
        //   //
        //   fetch("/api/queue", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       current: current_track.uid,
        //       previous: previous_track.uid,
        //     }),
        //   });
        // }
      }
    }
  );
  player.connect();
};

function addClickEnforcer() {
  console.log(connectEnforcer);
  connectEnforcer.remove();
  const clickEnforcer = document.createElement("div");
  clickEnforcer.classList.add("enforcer");
  clickEnforcer.innerText = "Kliknij";
  document.body.appendChild(clickEnforcer);
  // document.body.innerHTML += '<div class="enforcer">Podłącz spotify</div>';
  // const clickEnforcer = document.querySelector(".enforcer");
  clickEnforcer.addEventListener("click", () => {
    clickEnforcer.remove();
    fetch("/api/play", {
      method: "PUT",
    });
  });
}

// document.body.innerHTML += '<div class="enforcer">Podłącz spotify</div>';
// const clickEnforcer = document.querySelector(".enforcer");
// clickEnforcer.addEventListener("click", () => {
//   clickEnforcer.remove();
//   //   player.resume().then(() => {
//   //     console.log("Resumed!");
//   //   });
// });
