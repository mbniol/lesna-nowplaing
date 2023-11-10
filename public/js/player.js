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

const params = new URL(document.location).searchParams;
const code = params.get("code");
window.onSpotifyWebPlaybackSDKReady = async () => {
  const response = await fetch("/api/token/sdk?code=" + code);
  // console.log(await response.json());
  const jsonResponse = await response.json();
  let token = jsonResponse.token;
  // console.log(jsonResponse);
  // console.log(token);
  setTimeout(() => {
    const player = new Spotify.Player({
      name: "Lesna",
      getOAuthToken: async (cb) => {
        if (!token) {
          const response = await fetch("/api/token/sdk");
          const jsonResponse = await response.json();
          token = jsonResponse.token;
        }
        cb(token);
        console.log(new Date(), token);
        token = "";
      },
      volume: 0.5,
    });
    console.log("xD");

    player.addListener("ready", ({ device_id }) => {
      console.log("ready");
      addConnectEnforcer();
      // console.log("The Web Playback SDK is ready to play music!");
      // console.log("Device ID", device_id);
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
    let j = 0;
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
        console.log(event_current_track);
        // let nextValue = myGenerator.next();
        // while (
        //   !nextValue.done &&
        //   nextValue.value.current_track.id !== event_current_track.id
        // ) {
        // console.log(
        //   event_current_track.name,
        //   position,
        //   event_current_track.duration_ms
        // );
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
            queue: lastRequest.fetch_queue,
          };
          let fetch_current_track = {},
            fetch_queue;
          // console.log(event_current_track);
          const eventArtists = event_current_track.artists.map(
            ({ name }) => name
          ).join`, `;
          while (
            !(
              fetch_current_track.artists === eventArtists &&
              // fetch_current_track.duration === event_current_track.duration_ms &&
              fetch_current_track.name === event_current_track.name
            )
          ) {
            console.log(
              "artysta",
              fetch_current_track.artists,
              eventArtists,
              "długość",
              fetch_current_track.duration,
              event_current_track.duration_ms,
              "nazwa",
              fetch_current_track.name,
              event_current_track.name
            );
            const response = await fetch("/api/queue");
            const json = await response.json();
            ({ current_track: fetch_current_track, queue: fetch_queue } = json);
          }
          console.log("afterloop");
          lastRequest.queue = fetch_queue;
          if (
            lastRequestArchive.id === event_current_track.id &&
            // lastRequestArchive.position === position &&
            lastRequestArchive.paused !== paused
          ) {
            // return console.log("pauza/unpauza");
            return fetch("/api/player", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                current_track: fetch_current_track,
                queue: fetch_queue,
                position,
                paused,
                action: paused ? "pause" : "resume",
              }),
            });
          }
          if (
            lastRequestArchive.id === event_current_track.id &&
            lastRequestArchive.position !== position &&
            sameQueue(lastRequestArchive.queue, fetch_queue)
          ) {
            // return console.log("zmiana pozycji");
            return fetch("/api/player", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                current_track: fetch_current_track,
                queue: fetch_queue,
                position,
                paused,
                action: "position_change",
              }),
            });
          } else {
            // return console.log("nowa piosenka");
            return fetch("/api/player", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                current_track: fetch_current_track,
                queue: fetch_queue,
                position,
                paused,
                action: "new_song",
              }),
            });
          }
          //   const lastRequestArchive = lastRequest;
          lastRequest = {
            id: event_current_track.id,
            position,
            paused,
          };
          // console.log(lastRequest);
          fetch("/api/player", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // "Content-Type": "multipart/form-data",
            },
            body: JSON.stringify(lastRequest),
          });

          //   if (playerChanges++ === 0) {
          //     addClickEnforcer();
          //   }
          //   const rzeczy = await fetch("/api/queue");
          //   const previous_track =
          //     event_previous_tracks[event_previous_tracks.length - 1];
          //   const duration_s = Math.ceil(event_current_track.duration_ms / 1000);
          //   const position_whole_seconds = Math.floor(position / 1000);
          //   let { current_track: fetch_current_track, queue } = await rzeczy.json();
          //   console.log(fetch_current_track, queue);
          //   lastRequest.queue = queue;
          //   if (
          //     position === 0 &&
          //     queue[0].id === event_current_track.id &&
          //     fetch_current_track.id === previous_track.id
          //   ) {
          //     const actualCurrent = queue.shift();
          //     fetch_current_track = actualCurrent;
          //   }
          //   const playedEarlier = document.querySelector(".now-playing");
          //   if (playedEarlier) {
          //     console.log(playedEarlier.dataset.id, event_current_track.id);
          //   }

          //   if (
          //     (position === 0 && !sameQueue(lastRequestArchive.queue, queue)) ||
          //     !playedEarlier ||
          //     playedEarlier.dataset.id !== event_current_track.id
          //   ) {
          //     lastId = event_current_track.id;
          //     if (playedEarlier) {
          //       playedEarlier.classList.add("now-playing--go");
          //       setTimeout(() => playedEarlier.remove(), 500);
          //     }
          //     const nowPlaying =
          //       document.createElementFromString(`<div class="now-playing" data-id="${fetch_current_track.id}"><div class="cover-art">
          //   <progress
          //     class="song-progress-bar"
          //     value="${position_whole_seconds}"
          //     max="${duration_s}"
          //   ></progress>
          //   <img src="${fetch_current_track.image}" width="100%" />
          // </div>
          // <div class="song-title-container">
          //   <div class="song-title">${fetch_current_track.name}</div>
          //   <div class="song-artist">${fetch_current_track.artists}</div>
          //   <div class="song-position">00:00</div>
          //   <div class="song-timestamp">${fetch_current_track.duration}</div>
          // </div></div>`);
          //     nowPlayingContainer.appendChild(nowPlaying);
          //   }
          //   const progressBar = document.querySelector(
          //     ".now-playing:not(.now-playing--go) .song-progress-bar"
          //   );
          //   const positionDiv = document.querySelector(
          //     ".now-playing:not(.now-playing--go) .song-position"
          //   );
          //   positionDiv.innerText = convertToHumanTime(position_whole_seconds);
          //   progressBar.value = position_whole_seconds;
          //   progressBar.max = duration_s;
          //   // console.log(progressBar, paused);
          //   if (!paused) {
          //     clearInterval(progressInterval);
          //     // console.log(progressBar);
          //     progressInterval = setInterval(() => {
          //       progressBar.value++;
          //       const position_converted = convertToHumanTime(progressBar.value);
          //       positionDiv.innerText = position_converted;
          //       // console.log(progressBar.value);
          //     }, 1000);
          //   } else {
          //     clearInterval(progressInterval);
          //   }
          // const queryList = document.querySelector(".queue-list");
          // let queryListNewContent = "";
          // queue.forEach((track) => {
          //   queryListNewContent += `<div class="queue-item">
          //     <img class="queue-item-image" src="${track.image}" hei />
          //     <div class="queue-item-title">${track.name}</div>
          //     <div class="queue-item-artist">
          //     ${track.artists}
          //     </div>
          //     <div class="song-timestamp">${track.duration}</div>
          //   </div>`;
          // });
          // queryList.innerHTML = queryListNewContent;
          // }
        }
      }
    );
    player.connect().then((suc) => console.log("succ"));
  }, 1500);
};

function addClickEnforcer() {
  // console.log(connectEnforcer);
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
// (async () => {
//   console.log("async");
//   while (true) {
//     console.log("a");
//     const response = await fetch("/api/queue");
//     const json = await response.json();
//     console.log(json);
//   }
// })();
