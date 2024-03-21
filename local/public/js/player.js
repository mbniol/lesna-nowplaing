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

  return { image, artists, duration, name, id };
}

const nowPlayingContainer = document.querySelector(".main-left");

const params = new URL(document.location).searchParams;
const code = params.get("code");
window.onSpotifyWebPlaybackSDKReady = async () => {
  const response = await fetch("/api/token/sdk?code=" + code);

  const jsonResponse = await response.json();
  let token = jsonResponse.token;

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
      // fetch("/api/playlist", {
      //   method: "POST",
      // });
      addConnectEnforcer();
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

    const events = new EventSource(`/api/player`);

    events.onmessage = (event) => {
      const { action } = JSON.parse(event.data);
      if (action === "resume") {
        player.resume();
      } else if (action === "pause") {
        player.pause();
      }
      // console.log(action);
    };

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
        console.log(position, event_previous_tracks, event_current_track);
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
          const minutes = Math.floor(position / 60000);
          const seconds = Math.ceil((position - minutes * 60000) / 1000);
          const position_human =
            minutes + ":" + String(seconds).padStart(2, "0");
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
            return fetch("/api/display", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                current_track: fetch_current_track,
                queue: fetch_queue,
                position: {
                  seconds: Math.ceil(position / 1000),
                  human: position_human,
                },
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
            return fetch("/api/display", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                current_track: fetch_current_track,
                queue: fetch_queue,
                position: {
                  seconds: Math.ceil(position / 1000),
                  human: position_human,
                },
                paused,
                action: "position_change",
              }),
            });
          }
          if (position === 0) {
            // return console.log("nowa piosenka");
            return fetch("/api/display", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                current_track: fetch_current_track,
                queue: fetch_queue,
                position: {
                  seconds: Math.ceil(position / 1000),
                  human: position_human,
                },
                paused,
                action: "new_song",
              }),
            });
          }
        }
      }
    );
    player.connect().then((suc) => console.log("succ"));
  }, 1500);
};

function addClickEnforcer() {
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
